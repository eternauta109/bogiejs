// ipcHandlers/events.js
const {
  insertTransaction,
  getAllTransactions,
  deleteTransaction
} = require('../../database/transactionsDB')

export function handleTransactionsIpc(ipcMain) {
  ipcMain.handle('addTransactionToDB', async (event, args) => {
    console.log('MAIN: transaction da inserire in db', args)
    try {
      await insertTransaction(args)
    } catch (error) {
      console.error('Errore nel main process insertTransaction:', error)
      throw error // Rilancia l'errore per essere gestito nel preload
    }
  })

  ipcMain.handle('getTransactionsFromDB', async () => {
    try {
      return await getAllTransactions()
    } catch (error) {
      console.error('Errore nel main process getAllTransactions:', error)
      throw error // Rilancia l'errore per essere gestito nel preload
    }
  })

  ipcMain.handle('deleteTransactionFromDB', async (_, args) => {
    console.log('id transactions da cancellare in main', args)
    try {
      return await deleteTransaction(args)
    } catch (error) {
      console.error('Errore nel main process getAllTransactionss:', error)
      throw error // Rilancia l'errore per essere gestito nel preload
    }
  })
}
