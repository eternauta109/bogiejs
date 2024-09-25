// ipcHandlers/index.js
import { handleManagerIpc } from './managers'
import { handleEventIpc } from './events'
import { handleTaskIpc } from './tasks'
import { handleTopicIpc } from './topics'
import { handleOptionIpc } from './options'

export function initializeIpcHandlers(ipcMain) {
  handleManagerIpc(ipcMain)
  handleEventIpc(ipcMain)
  handleTaskIpc(ipcMain)
  handleTopicIpc(ipcMain)
  handleOptionIpc(ipcMain)
}
