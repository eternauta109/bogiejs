/* eslint-disable no-unused-vars */
import { app, shell, BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

ipcMain.handle('getPath', async () => {
  const appPath = await app.getAppPath()
  console.log('MAIN: getPath', appPath)
  return app.getAppPath()
})

const {
  createDbUser,
  addNewUser,
  getManagerByCredentials,
  addNotifyManagers,
  deleteThisNotify,
  getAllManagers,
  deleteThisManager
} = require('../../database/databaseManagersHandle')

const {
  createDbEvents,
  insertEvent,
  getAllEvents,
  deleteThisEvent
} = require('../../database/eventsDB')

const { createDbTasks, insertTask, getAllTasks, deleteThisTask } = require('../../database/taskDB')

const {
  createDbTopics,
  insertTopic,
  getAllTopics,
  deleteThisTopic
} = require('../../database/topicsDB')
const { getAllOptions, createDbOptions } = require('../../database/optionsDB')

createDbUser()
createDbEvents()
createDbTasks()
createDbTopics()
createDbOptions()

let mainWindow
function createWindow() {
  // Create the browser window.
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  mainWindow.webContents.openDevTools({ mode: 'right' })
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
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

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong dal main'))

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

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

//ICP PER GESTIRE I MANAGERS

//icp per creare un nuovo user
ipcMain.handle('addNewUser', async (event, args) => {
  console.log('main addNewUSer args ', args)
  return await addNewUser({ ...args })
})

//icp per cancellare user
ipcMain.handle('deleteThisManager', async (event, args) => {
  return await deleteThisManager(args)
})

//icp per prendere tutti i managers che appartengono al cinema
ipcMain.handle('getAllManagers', async (event, args) => {
  return await getAllManagers(args)
})

//icp per cercare sul db managers chi si sta loggando
ipcMain.handle('login', async (event, args) => {
  const returnManager = await getManagerByCredentials(args.userName, args.password)
  console.log('manager ipcMain del main', returnManager)
  return returnManager
  /* await mainWindow.webContents.send('returnManager', returnManager) */
  // Gestisci le credenziali di accesso qui
  // Esegui l'autenticazione, interagisci con il database, ecc.
})

//icp electron che restituisce un array con tutti i nomi dei managers
/* ipcMain.on('send:managersName', async () => {
  const managers = await getAllManagersName()  
  await mainWindow.webContents.send('managersName', managers)
}) */

//icp che restituisce un array di notifiche aggiornate dopo aver cancellato
//quella appena letta. con questo andrò a aggionare lo stato di user
ipcMain.handle('deleteThisNotify', async (event, args) => {
  console.log(
    'sono in main e mando questa notifica da cancellare al lla funzione che gestisce il db manager',
    args
  )
  return await deleteThisNotify(args)
})

//ICP PER GESTIRE GLI EVENTI

//icp electron che inserisce un nuovo evento
ipcMain.handle('addNewEvent', async (event, args) => {
  console.log('MAIN: evento da inserire in db', args)
  await addNotifyManagers({ typeNotify: 'event', obj: args.event })
  await insertEvent(args)
  /* await readAllEvents(); */
})

//icp che restituisce tutti gli events. mi serve per caricare events alla primo avvio
//viene letta dal reducers eventi che va a modificare events nel calendar
ipcMain.handle('getEvents', async () => {
  /* console.log("argomenti di send:getEvents", args); */
  return await getAllEvents()
})

//icp che elimina un event dal db event
ipcMain.handle('removeEvent', async (event, eventId) => {
  /* console.log("send:eventToDelete", eventId); */
  await deleteThisEvent(eventId)
  /* await readAllEvents(); */
})

//ICP PER GESTIRE I TASK

//icp electron che inserisce o aggiorna  task
ipcMain.handle('addNewTask', async (event, args) => {
  /* console.log("MAIN: task da inserire in db", args); */
  await insertTask(args)
  await addNotifyManagers({ typeNotify: 'task', obj: args.task })
  /* await readAllTasks(); */
})

//icp che restituitopicsce tutti gli tasks. mi serve per caricare events alla primo avvio
//viene letta dal reducers tasks
ipcMain.handle('getAllTasks', async () => {
  /*   console.log("argomenti di send:getTasks", args); */
  const stateTasks = await getAllTasks()
  return stateTasks
})

//icp che elimina un event dal db task
ipcMain.handle('removeTask', async (event, taskId) => {
  /* console.log("send:taskToDelete", taskId); */
  await deleteThisTask(taskId)
  /* await readAllTasks(); */
})

//ICP PER GESTIRE I TOPICS

//icp electron che inserisce o aggiorna un topic
ipcMain.handle('insertTopic', async (event, args) => {
  console.log('MAIN: topic da inserire in db', args)
  await insertTopic(args)
  const stateTopics = await getAllTopics()
  await addNotifyManagers({ typeNotify: 'topic', obj: args.topic })
  return stateTopics
  /* await readAllTopics(); */
})

//icp che restituisce tutti i topics.
//viene letta dal reducers topicsS
ipcMain.handle('getAllTopics', async () => {
  console.log('main: getAllTopics')
  return await getAllTopics()
})

//icp che elimina un event dal db topics
ipcMain.handle('deleteThisTopic', async (event, topicId) => {
  console.log('deleteThisTopic', topicId)
  await deleteThisTopic(topicId)
  return await getAllTopics()
})

//ICP PER OPZIONI
//icp che restituisce tutti le opt.
//viene letta dal reducers options
ipcMain.handle('getOptions', async (event, args) => {
  /* console.log('getOptions', args) */
  const stateOptions = await getAllOptions()
  /* console.log('stateOptions in main', stateOptions) */
  return stateOptions
  /* await readAllTopics(); */
})
