import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  login,
  getAllEvents,
  addNewEvent
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
