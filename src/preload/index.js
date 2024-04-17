import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  login,
  getAllEvents,
  addNewEvent,
  removeEvent,
  addNewTask,
  getAllTasks,
  removeTask,
  addNewUser,
  getAllManagers
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

//MANAGERS ACTIONS
//login actions
async function login({ userName, password }) {
  console.log('login in preload', userName, password)
  try {
    const result = await ipcRenderer.invoke('login', { userName, password })
    return result
  } catch (error) {
    throw new Error('errore in preload login:', error)
  }
}

async function addNewUser(args) {
  console.log('addNewUser args', args)
  try {
    const result = await ipcRenderer.invoke('addNewUser', args)
    console.log('addNewUser preload', result)
    return result
  } catch (error) {
    throw new Error('errore in preload addNewUser:', error)
  }
}

async function getAllManagers(args) {
  console.log('sono i get all manager')
  try {
    const result = await ipcRenderer.invoke('getAllManagers', args)
    console.log('ecco tutti i manager', result)
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
  console.log('addNewEvent', args)
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
    await ipcRenderer.invoke('addNewTask', args)
  } catch (error) {
    throw new Error('errore in preload addNewTask:', error)
  }
}
//estrai tutte le tasks
async function getAllTasks() {
  try {
    const result = await ipcRenderer.invoke('getAllTasks')
    return result
  } catch (error) {
    throw new Error('errore in preload addNewTask:', error)
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
