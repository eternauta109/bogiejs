// ipcHandlers/options.js
const { getAllOptions } = require('../../database/optionsDB')

export function handleOptionIpc(ipcMain) {
  // eslint-disable-next-line no-unused-vars
  ipcMain.handle('getOptions', async (event, args) => {
    try {
      return await getAllOptions()
    } catch (error) {
      console.log('Main: getOptions: error:', error)
      throw error
    }
  })
}
