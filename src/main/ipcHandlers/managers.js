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
    console.log('main addNewUSer args ', args)
    return await addNewUser({ ...args })
  })

  ipcMain.handle('deleteThisManager', async (event, args) => {
    console.log('main deleteThisManager args ', args)
    return await deleteThisManager(args)
  })

  ipcMain.handle('getAllManagers', async (event, args) => {
    console.log('main getAllManagers', args)
    return await getAllManagers(args)
  })

  ipcMain.handle('login', async (event, args) => {
    const returnManager = await getManagerByCredentials(args.userName, args.password)
    console.log('manager ipcMain del main', returnManager)
    return returnManager
  })

  ipcMain.handle('deleteThisNotify', async (event, args) => {
    console.log(
      'sono in main e mando questa notifica da cancellare al lla funzione che gestisce il db manager',
      args
    )
    return await deleteThisNotify(args)
  })
}
