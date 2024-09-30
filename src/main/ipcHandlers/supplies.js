// ipcHandlers/events.js
const { insertSupply, getAllSupplies, deleteSupply } = require('../../database/suppliesDB')

export function handleSuppliesIpc(ipcMain) {
  ipcMain.handle('addSupplyToDB', async (event, args) => {
    console.log('MAIN: supplie da inserire in db', args)
    try {
      await insertSupply(args)
    } catch (error) {
      console.error('Errore nel main process insertSupplie:', error)
      throw error // Rilancia l'errore per essere gestito nel preload
    }
  })

  ipcMain.handle('getSuppliesFromDB', async () => {
    try {
      return await getAllSupplies()
    } catch (error) {
      console.error('Errore nel main process getAllSupplies:', error)
      throw error // Rilancia l'errore per essere gestito nel preload
    }
  })

  ipcMain.handle('deleteSupplyFromDB', async (_, args) => {
    console.log('id supplie da cancellare in main', args)
    try {
      return await deleteSupply(args)
    } catch (error) {
      console.error('Errore nel main process getAllSupplies:', error)
      throw error // Rilancia l'errore per essere gestito nel preload
    }
  })
}
