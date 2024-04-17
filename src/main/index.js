import { app, shell, BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

const {
  createDbUser,
  addNewUser,

  getManagerByCredentials,
  getAllManagersName,
  addNotifyManagers,

  deleteThisNotify,
  getAllManagers,
  deleteThisManager
} = require('../../resources/database/databaseManagersHandle')

const {
  createDbEvents,
  insertEvent,
  getAllEvents,
  deleteThisEvent
} = require('../../resources/database/eventsDB')

const {
  createDbTasks,
  insertTask,
  getAllTasks,
  deleteThisTask
} = require('../../resources/database/taskDB')

const {
  createDbTopics,
  insertTopic,
  getAllTopics,
  deleteThisTopic
} = require('../../resources/database/topicsDB')
const { getAllOptions, createDbOptions } = require('../../resources/database/optionsDB')

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

/* async function login(args) {
  console.log('arrivata in preload', args)
  const managerNames = await getManagerByCredentials(args.userName, args.password)
  return managerNames
}

contextBridge.exposeInMainWorld() */

//ICP PER GESTIRE I MANAGERS

//icp per creare un nuovo user
ipcMain.on('send:newUser', async (event, args) => {
  const returnNames = await addNewUser({ ...args })
  console.log('main ritorno add new user ', returnNames)
  await mainWindow.webContents.send('return:newUser', returnNames)
})

//icp per cancellare user
ipcMain.on('send:deleteManager', async (event, args) => {
  const returnNames = await deleteThisManager(args)
  console.log('main ritorno delete new user ', returnNames)
  await mainWindow.webContents.send('return:deleteManager', returnNames)
})

//icp per prendere tutti i managers che appartengono al cinema
ipcMain.on('send:getAllManagers', async (event, args) => {
  const allManagers = await getAllManagers(args)
  console.log('main ritorno di tutti i mangers', allManagers)
  await mainWindow.webContents.send('return:getAllManagers', allManagers)
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
ipcMain.on('send:managersName', async (event, args) => {
  const managers = await getAllManagersName()
  /*  console.log("managers in main dopo chiamata al db", managers); */
  await mainWindow.webContents.send('managersName', managers)
})

//icp che restituisce un array di notifiche aggiornate dopo aver cancellato
//quella appena letta. con questo andrò a aggionare lo stato di user
ipcMain.on('send:notifyToDelete', async (event, args) => {
  console.log(
    'sono in main e mando questa notifica da cancellare al lla funzione che gestisce il db manager',
    args
  )
  const newNotify = await deleteThisNotify(args)
  console.log('main: dopo eliminazione di una notifica ritorna questo array', newNotify)
  await mainWindow.webContents.send('return:notifyToDelete', newNotify)
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
ipcMain.on('send:eventToDelete', async (event, eventId) => {
  /* console.log("send:eventToDelete", eventId); */
  await deleteThisEvent(eventId)
  /* await readAllEvents(); */
})

//ICP PER GESTIRE I TASK

//icp electron che inserisce o aggiorna  task
ipcMain.on('send:task', async (event, args) => {
  /* console.log("MAIN: task da inserire in db", args); */
  await insertTask(args)
  await addNotifyManagers({ typeNotify: 'task', obj: args.task })
  /* await readAllTasks(); */
})

//icp che restituisce tutti gli tasks. mi serve per caricare events alla primo avvio
//viene letta dal reducers tasks
ipcMain.on('send:getTasks', async (event, args) => {
  /*   console.log("argomenti di send:getTasks", args); */
  const stateTasks = await getAllTasks()
  await mainWindow.webContents.send('return:getTasks', stateTasks)
})

//icp che elimina un event dal db task
ipcMain.on('send:taskToDelete', async (event, taskId) => {
  /* console.log("send:taskToDelete", taskId); */
  await deleteThisTask(taskId)
  /* await readAllTasks(); */
})

//ICP PER GESTIRE I TOPICS

//icp electron che inserisce o aggiorna un topic
ipcMain.on('send:topic', async (event, args) => {
  console.log('MAIN: topic da inserire in db', args)
  await insertTopic(args)
  const stateTopics = await getAllTopics()
  await addNotifyManagers({ typeNotify: 'topic', obj: args.topic })
  await mainWindow.webContents.send('return:addNewTopics', stateTopics)
  /* await readAllTopics(); */
})

//icp che restituisce tutti i topics.
//viene letta dal reducers topics
ipcMain.on('send:getTopics', async (event, args) => {
  console.log('argomenti di send:getTopics', args)
  const stateTopics = await getAllTopics()

  await mainWindow.webContents.send('return:getTopics', stateTopics)
  /* await readAllTopics(); */
})

//icp che elimina un event dal db topics
ipcMain.on('send:topicToDelete', async (event, topicId) => {
  console.log('send:topicToDelete', topicId)
  await deleteThisTopic(topicId)
  const stateTopics = await getAllTopics()
  await mainWindow.webContents.send('return:topicToDelete', stateTopics)
  /* await readAllTopics(); */
})

//ICP PER OPZIONI
//icp che restituisce tutti le opt.
//viene letta dal reducers options
ipcMain.on('send:getOptions', async (event, args) => {
  console.log('argomenti di send:getOptions', args)
  const stateOptions = await getAllOptions()

  await mainWindow.webContents.send('return:getOptions', stateOptions)
  /* await readAllTopics(); */
})
