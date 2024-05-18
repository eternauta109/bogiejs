import { contextBridge, ipcRenderer, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  login,
  getPath,
  getAllEvents,
  getSingleTask,
  deleteThisNotify,
  addNewEvent,
  removeEvent,
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
    throw new Error('errore in preload login:', error)
  }
}

async function addNewUser(args) {
  try {
    const result = await ipcRenderer.invoke('addNewUser', args)

    return result
  } catch (error) {
    throw new Error('errore in preload addNewUser:', error)
  }
}

async function deleteThisManager(args) {
  try {
    const result = await ipcRenderer.invoke('deleteThisManager', args)

    return result
  } catch (error) {
    throw new Error('errore in preload deleteThisManager:', error)
  }
}

async function deleteThisNotify(args) {
  try {
    const result = await ipcRenderer.invoke('deleteThisNotify', args)

    return result
  } catch (error) {
    throw new Error('errore in preload deleteThisNotify:', error)
  }
}

async function getAllManagers(args) {
  console.log('sono i get all manager')
  try {
    const result = await ipcRenderer.invoke('getAllManagers', args)

    return result
  } catch (error) {
    throw new Error('errore in preload addNewUser:', error)
  }
}

//EVENT ACTIONS
//get all events from events db
async function getAllEvents() {
  try {
    const result = await ipcRenderer.invoke('getEvents')
    return result
  } catch (error) {
    throw new Error('errore in preload getAllEvents:', error)
  }
}
//aggiungi evento e aggiorna notifica ai colleghi
async function addNewEvent(args) {
  try {
    const result = await ipcRenderer.invoke('addNewEvent', args)
    return result
  } catch (error) {
    throw new Error('errore in preload addNewEvent:', error)
  }
}

async function removeEvent(args) {
  try {
    const result = await ipcRenderer.invoke('removeEvent', args)
    return result
  } catch (error) {
    throw new Error('errore in preload removeEvent:', error)
  }
}

//ACTION TASK
//aggiungi o modifica task
async function addNewTask(args) {
  try {
    return await ipcRenderer.invoke('addNewTask', args)
  } catch (error) {
    throw new Error('errore in preload addNewTask:', error)
  }
}
//estrai tutte le tasks
async function getAllTasks() {
  try {
    const result = await ipcRenderer.invoke('getAllTasks')
    console.log('preload: getAllTask: result', result)
    return result
  } catch (error) {
    throw new Error('errore in preload addNewTask:', error)
  }
}

//estrai tutte le tasks
async function getSingleTask(id) {
  try {
    const result = await ipcRenderer.invoke('getSingleTask', id)
    console.log('preload: getSingleTask: result', result)
    return result
  } catch (error) {
    throw new Error('errore in preload getSingleTask:', error)
  }
}

//estrai rimuovi un task
async function removeTask(args) {
  try {
    const result = await ipcRenderer.invoke('removeTask', args)
    return result
  } catch (error) {
    throw new Error('errore in preload addNewTask:', error)
  }
}

//TOPICS ACTION
//add new topic
async function insertTopic(args) {
  try {
    return await ipcRenderer.invoke('insertTopic', args)
  } catch (error) {
    throw new Error('errore in preload insertTopic:', error)
  }
}
//leggi tutti i topics
async function getAllTopics() {
  try {
    const returnTopics = await ipcRenderer.invoke('getAllTopics')

    return returnTopics
  } catch (error) {
    throw new Error('errore in preload getAllTopics:', error)
  }
}
//elimina un topic
async function deleteThisTopic(args) {
  try {
    const result = await ipcRenderer.invoke('deleteThisTopic', args)
    return result
  } catch (error) {
    throw new Error('errore in preload deleteThisTopic:', error)
  }
}

//ACTION OPTIONS
//carica le opzioni
async function getOptions() {
  try {
    const returnOptions = await ipcRenderer.invoke('getOptions')
    console.log('preload options', returnOptions)
    return returnOptions
  } catch (error) {
    throw new Error('errore in preload getOptions:', error)
  }
}
