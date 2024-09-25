import { contextBridge, ipcRenderer, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  addProductToDB,
  getProductsFromDB,
  login,
  getPath,
  getAllEvents,
  updateEvents,
  getSingleTask,
  deleteThisNotify,
  addNewEvent,
  removeEvent,
  removeMultipleEvent,
  addNewTask,
  getAllTasks,
  removeTask,
  addNewUser,
  getAllManagers,
  deleteThisManager,
  insertTopic,
  getAllTopics,
  deleteThisTopic,
  getOptions,
  shell: shell
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}

//PRODUCTS
//aggiungi prodotto
async function addProductToDB(args) {
  console.log('preload products', args)
  try {
    const result = await ipcRenderer.invoke('addProductToDB', args)
    return result
  } catch (error) {
    console.error('Errore in preload addNewEvent:', error)
    throw error
  }
}

async function getProductsFromDB() {
  try {
    const result = await ipcRenderer.invoke('getProductsFromDB')
    return result
  } catch (error) {
    console.error('Errore in preload getProductsFromDB:', error)
    throw error
  }
}

//PATH
async function getPath() {
  const retPath = await ipcRenderer.invoke('getPath')
  console.log('path in preload', retPath)
  return retPath
}

//MANAGERS ACTIONS
//login actions
async function login({ userName, password }) {
  try {
    const result = await ipcRenderer.invoke('login', { userName, password })
    return result
  } catch (error) {
    console.error('Errore in preload login:', error)
    throw error
  }
}

async function addNewUser(args) {
  try {
    const result = await ipcRenderer.invoke('addNewUser', args)

    return result
  } catch (error) {
    console.error('Errore in preload addNewUser:', error)
    throw error
  }
}

async function deleteThisManager(args) {
  try {
    const result = await ipcRenderer.invoke('deleteThisManager', args)

    return result
  } catch (error) {
    console.error('Errore in preload deleteThisManager:', error)
    throw error
  }
}

async function deleteThisNotify(args) {
  try {
    const result = await ipcRenderer.invoke('deleteThisNotify', args)

    return result
  } catch (error) {
    console.error('Errore in preload deleteThisNotify:', error)
    throw error
  }
}

async function getAllManagers(args) {
  console.log('sono i get all manager')
  try {
    const result = await ipcRenderer.invoke('getAllManagers', args)

    return result
  } catch (error) {
    console.error('Errore in preload getAllManagers:', error)
    throw error
  }
}

//EVENT ACTIONS
//get all events from events db
async function getAllEvents() {
  try {
    const result = await ipcRenderer.invoke('getEvents')
    return result
  } catch (error) {
    console.error('Errore in preload getAllEvents:', error)
    throw error
  }
}

//updatecolor all events from events db
async function updateEvents(colorMap) {
  console.log('coorMap in preload', colorMap)
  try {
    await ipcRenderer.invoke('updateEvents', colorMap)
  } catch (error) {
    console.error('Errore in preload updateEvents:', error)
    throw error
  }
}
//aggiungi evento e aggiorna notifica ai colleghi
async function addNewEvent(args) {
  try {
    const result = await ipcRenderer.invoke('addNewEvent', args)
    return result
  } catch (error) {
    console.error('Errore in preload addNewEvent:', error)
    throw error
  }
}

async function removeEvent(args) {
  try {
    const result = await ipcRenderer.invoke('removeEvent', args)
    return result
  } catch (error) {
    console.error('Errore in preload removeEvent:', error)
    throw error
  }
}

async function removeMultipleEvent(args) {
  /* console.log('da preload cancella multiple', args) */
  try {
    const result = await ipcRenderer.invoke('removeMultipleEvent', args)
    return result
  } catch (error) {
    console.error('Errore in preload removeEvent:', error)
    throw error
  }
}

//ACTION TASK
//aggiungi o modifica task
async function addNewTask(args) {
  try {
    return await ipcRenderer.invoke('addNewTask', args)
  } catch (error) {
    console.error('Errore in preload addNewTask:', error)
    throw error
  }
}
//estrai tutte le tasks
async function getAllTasks(managerName) {
  try {
    const result = await ipcRenderer.invoke('getAllTasks', managerName)
    console.log('preload: getAllTask: result', result)
    return result
  } catch (error) {
    console.error('Errore in preload getAllTasks:', error)
    throw error
  }
}

//estrai tutte le tasks
async function getSingleTask(id) {
  try {
    const result = await ipcRenderer.invoke('getSingleTask', id)
    console.log('preload: getSingleTask: result', result)
    return result
  } catch (error) {
    console.error('Errore in preload getSingleTask:', error)
    throw error
  }
}

//estrai rimuovi un task
async function removeTask(args) {
  try {
    const result = await ipcRenderer.invoke('removeTask', args)
    return result
  } catch (error) {
    console.error('Errore in preload removeTask:', error)
    throw error
  }
}

//TOPICS ACTION
//add new topic
async function insertTopic(args) {
  try {
    return await ipcRenderer.invoke('insertTopic', args)
  } catch (error) {
    console.error('Errore in preload insertTopic:', error)
    throw error
  }
}
//leggi tutti i topics
async function getAllTopics() {
  try {
    const returnTopics = await ipcRenderer.invoke('getAllTopics')

    return returnTopics
  } catch (error) {
    console.error('Errore in preload getAllTopics:', error)
    throw error
  }
}
//elimina un topic
async function deleteThisTopic(args) {
  try {
    const result = await ipcRenderer.invoke('deleteThisTopic', args)
    return result
  } catch (error) {
    console.error('Errore in preload deleteThisTopic:', error)
    throw error
  }
}

//ACTION OPTIONS
//carica le opzioni
async function getOptions() {
  try {
    const returnOptions = await ipcRenderer.invoke('getOptions')

    return returnOptions
  } catch (error) {
    console.error('Errore in preload getOptions:', error)
    throw error
  }
}
