// ipcHandlers/tasks.js
const { insertTask, getAllTasks, deleteThisTask, getSingleTask } = require('../../database/taskDB')
const { addNotifyManagers } = require('../../database/databaseManagersHandle')

export function handleTaskIpc(ipcMain) {
  ipcMain.handle('addNewTask', async (event, args) => {
    console.log('MAIN: task da inserire in db', args)
    try {
      await insertTask(args)
    } catch (error) {
      console.error('Errore nel main process addNewTask:', error)
      throw error
    }

    if (!args.upDate) {
      try {
        await addNotifyManagers({ typeNotify: 'task', obj: args.task })
      } catch (error) {
        console.error('Errore nel main process addNotifyManagers:', error)
        throw error
      }
    }
  })

  ipcMain.handle('getAllTasks', async (event, managerName) => {
    try {
      return await getAllTasks(managerName)
    } catch (error) {
      console.error('Errore nel main process getAllEvents:', error)
      throw error // Rilancia l'errore per essere gestito nel preload
    }
  })

  ipcMain.handle('removeTask', async (event, taskId) => {
    try {
      await deleteThisTask(taskId)
    } catch (error) {
      console.error('Errore nel main process removeTask:', error)
      throw error // Rilancia l'errore per essere gestito nel preload
    }
  })

  ipcMain.handle('getSingleTask', async (event, taskId) => {
    try {
      const result = await getSingleTask(taskId)
      return result
    } catch (error) {
      console.error('Errore nel main process getSingleTask:', error)
      throw error // Rilancia l'errore per essere gestito nel preload
    }
  })
}
