// ipcHandlers/managers.js
const {
  addNewUser,
  deleteThisManager,
  getAllManagers,
  getManagerByCredentials,
  deleteThisNotify
} = require('../../database/databaseManagersHandle')

export function handleManagerIpc(ipcMain) {
  ipcMain.handle('addNewUser', async (event, args) => {
    try {
      console.log('main addNewUser args ', args)
      return await addNewUser({ ...args })
    } catch (error) {
      console.error('main: addNewUser: error: ', error)
      throw error
    }
  })

  ipcMain.handle('deleteThisManager', async (event, args) => {
    try {
      console.log('main deleteThisManager args ', args)
      return await deleteThisManager(args)
    } catch (error) {
      console.error('main: deleteThisManager: error: ', error)
      throw error
    }
  })

  ipcMain.handle('getUsersFromDB', async (event, args) => {
    try {
      console.log('main getUsersFromDB', args)
      return await getAllManagers(args)
    } catch (error) {
      console.error('main: getUsersFromDB: error: ', error)
      throw error
    }
  })

  ipcMain.handle('login', async (event, args) => {
    try {
      const returnManager = await getManagerByCredentials(args.userName, args.password)
      console.log('main: manager login: ipcMain del main', returnManager)
      return returnManager
    } catch (error) {
      console.error('main: login: error: ', error)
      throw error
    }
  })

  ipcMain.handle('deleteThisNotify', async (event, args) => {
    try {
      console.log(
        'sono in main e mando questa notifica da cancellare al lla funzione che gestisce il db manager',
        args
      )
      return await deleteThisNotify(args)
    } catch (error) {
      console.error('main: deleteThisNotify: error: ', error)
      throw error
    }
  })
}
