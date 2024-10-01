// ipcHandlers/index.js
import { handleManagerIpc } from './managers'
import { handleSuppliesIpc } from './supplies'
import { handleTransactionsIpc } from './transactions'
import { handleOptionIpc } from './options'
import { handleProductsIpc } from './products'

export function initializeIpcHandlers(ipcMain) {
  handleManagerIpc(ipcMain)
  handleSuppliesIpc(ipcMain)
  handleTransactionsIpc(ipcMain)
  handleOptionIpc(ipcMain)
  handleProductsIpc(ipcMain)
}
