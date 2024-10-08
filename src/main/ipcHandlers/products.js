// ipcHandlers/events.js
const { insertProduct, getAllProducts, deleteProduct } = require('../../database/productsDB')

export function handleProductsIpc(ipcMain) {
  ipcMain.handle('addProductToDB', async (event, args) => {
    console.log('MAIN: prodotto da inserire in db', args)
    try {
      await insertProduct(args)
    } catch (error) {
      console.error('Errore nel main process insertProduct:', error)
      throw error // Rilancia l'errore per essere gestito nel preload
    }
  })

  ipcMain.handle('getProductsFromDB', async () => {
    try {
      return await getAllProducts()
    } catch (error) {
      console.error('Errore nel main process getAllProducts:', error)
      throw error // Rilancia l'errore per essere gestito nel preload
    }
  })

  ipcMain.handle('deleteProductFromDB', async (_, args) => {
    console.log('id da cancellare in main', args)
    try {
      return await deleteProduct(args)
    } catch (error) {
      console.error('Errore nel main process getAllProducts:', error)
      throw error // Rilancia l'errore per essere gestito nel preload
    }
  })
}
