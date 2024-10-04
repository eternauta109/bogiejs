import { contextBridge, ipcRenderer, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  addProductToDB,
  getProductsFromDB,
  deleteProductFromDB,
  updateProductInDB,

  addSupplyToDB,
  getSuppliesFromDB,
  deleteSupplyFromDB,
  updateSupplyInDB,

  addTransactionToDB,
  getTransactionsFromDB,
  deleteTransactionFromDB,
  updateTransactionInDB,

  login,
  addNewUser,
  getUsersFromDB,
  deleteThisManager,

  getPath,
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
  console.log('preload add products', args)
  try {
    const result = await ipcRenderer.invoke('addProductToDB', args)
    return result
  } catch (error) {
    console.error('Errore in preload addNewEvent:', error)
    throw error
  }
}

async function updateProductInDB(args) {
  console.log('preload products update', args)
  try {
    const result = await ipcRenderer.invoke('addProductToDB', args)
    return result
  } catch (error) {
    console.error('Errore in preload addNewEvent:', error)
    throw error
  }
}

async function deleteProductFromDB(args) {
  console.log('preload delete products in preload', args)
  try {
    const result = await ipcRenderer.invoke('deleteProductFromDB', args)
    return result
  } catch (error) {
    console.error('Errore in preload delete product:', error)
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

//SUPPLIES
//aggiungi supplie
async function addSupplyToDB(args) {
  console.log('preload add supplie', args)
  try {
    const result = await ipcRenderer.invoke('addSupplyToDB', args)
    return result
  } catch (error) {
    console.error('Errore in preload addNewEvent:', error)
    throw error
  }
}

async function updateSupplyInDB(args) {
  console.log('preload products update', args)
  try {
    const result = await ipcRenderer.invoke('addSupplyToDB', args)
    return result
  } catch (error) {
    console.error('Errore in preload addNewEvent:', error)
    throw error
  }
}

async function deleteSupplyFromDB(args) {
  console.log('preload delete supplie in preload', args)
  try {
    const result = await ipcRenderer.invoke('deleteSupplyFromDB', args)
    return result
  } catch (error) {
    console.error('Errore in preload delete product:', error)
    throw error
  }
}

async function getSuppliesFromDB() {
  try {
    const result = await ipcRenderer.invoke('getSuppliesFromDB')
    return result
  } catch (error) {
    console.error('Errore in preload getSuppliesFromDB:', error)
    throw error
  }
}

//TRANSACTIONS
//aggiungi supplie
async function addTransactionToDB(args) {
  console.log('preload add supplie', args)
  try {
    const result = await ipcRenderer.invoke('addTransactionToDB', args)
    return result
  } catch (error) {
    console.error('Errore in preload addTransactionToDB:', error)
    throw error
  }
}

async function updateTransactionInDB(args) {
  console.log('preload products update', args)
  try {
    const result = await ipcRenderer.invoke('addTransactionToDB', args)
    return result
  } catch (error) {
    console.error('Errore in preload addTransactionToDB:', error)
    throw error
  }
}

async function deleteTransactionFromDB(args) {
  console.log('preload delete supplie in preload', args)
  try {
    const result = await ipcRenderer.invoke('deleteTransactionFromDB', args)
    return result
  } catch (error) {
    console.error('Errore in preload deleteTransactionFromDB:', error)
    throw error
  }
}

async function getTransactionsFromDB() {
  try {
    const result = await ipcRenderer.invoke('getTransactionsFromDB')
    return result
  } catch (error) {
    console.error('Errore in preload getTransactionsFromDB:', error)
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

async function addNewUser(user) {
  try {
    await ipcRenderer.invoke('addNewUser', user)
    return
  } catch (error) {
    console.error('Errore in preload registerUser:', error)
    throw error
  }
}

async function getUsersFromDB(user) {
  try {
    const users = await ipcRenderer.invoke('getUsersFromDB', user)
    console.log('retunr users from preload', users)
    return users
  } catch (error) {
    console.error('Errore in preload getUsersFromDB:', error)
    throw error
  }
}

async function deleteThisManager(userId) {
  try {
    await ipcRenderer.invoke('deleteThisManager', userId)
  } catch (error) {
    console.error('Errore in preload deleteThisManager:', error)
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
