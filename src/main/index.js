/* eslint-disable no-unused-vars */
import { app, shell, BrowserWindow, ipcMain, screen, autoUpdater } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { initializeIpcHandlers } from './ipcHandlers'

ipcMain.handle('getPath', async () => {
  const appPath = await app.getAppPath()
  return appPath
})

//disabilita aggiornamenti electron
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false

// Disabilita funzionalità di telemetria di Chromium
app.commandLine.appendSwitch('disable-features', 'MetricsReportingEnabled')
app.commandLine.appendSwitch('disable-breakpad') // Disabilita i report di crash

// Disabilita servizi esterni di Google e altre funzionalità di rete non necessarie
app.commandLine.appendSwitch('disable-background-networking')
app.commandLine.appendSwitch('disable-client-side-phishing-detection')
app.commandLine.appendSwitch('disable-default-apps')
app.commandLine.appendSwitch('disable-domain-reliability')
app.commandLine.appendSwitch('disable-component-update')

const { createDbUser } = require('../../database/databaseManagersHandle')
const { createDbProducts } = require('../../database/productsDB')
const { createDbTransactions } = require('../../database/transactionsDB')
const { createDbOptions } = require('../../database/optionsDB')
const { createDbSupplies } = require('../../database/suppliesDB')
async function createAllDb() {
  try {
    await createDbUser()
    await createDbProducts()
    await createDbTransactions()
    await createDbOptions()
    await createDbSupplies()
  } catch (error) {
    console.error('Si è verificato un errore durante la creazione dei database:', error)
  }
}

;(async () => {
  await createAllDb()
})()

let mainWindow
function createWindow() {
  // Create the browser window.
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 800,
    show: false,
    icon: join(__dirname, '../../resources/icon.png'),
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true, // Disabilita richieste esterne a domini remoti

      preload: join(__dirname, '../preload/index.js')
      /* devTools: false */ // Disabilita l'apertura di DevTools
    }
  })

  // Blocca tutte le richieste di rete, eccetto quelle locali
  /*  mainWindow.webContents.session.webRequest.onBeforeRequest((details, callback) => {
    console.log('Richiesta URL:', details.url)

    if (
      details.url.startsWith('http://localhost') ||
      details.url.startsWith('file://') ||
      details.url.startsWith('ws://localhost') // Permetti richieste WebSocket in localhost
    ) {
      callback({ cancel: false }) // Consenti le richieste locali
    } else {
      console.log('Bloccato:', details.url) // Log delle richieste bloccate
      callback({ cancel: true }) // Blocca tutte le altre
    }
  }) */

  mainWindow.webContents.openDevTools({ mode: 'detach' })

  // Mostra la finestra quando è pronta
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    return { action: 'deny' } // Impedisce l'apertura di link esterni
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // inizializzo tutti gli IPC HANDLERS
  initializeIpcHandlers(ipcMain)

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
