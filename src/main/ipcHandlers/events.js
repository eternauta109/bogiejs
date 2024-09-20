// ipcHandlers/events.js
const {
  insertEvent,
  getAllEvents,
  deleteThisEvent,
  deleteMultipleEvents,
  UpDateEventsDB
} = require('../../database/eventsDB')
const { addNotifyManagers } = require('../../database/databaseManagersHandle')

export function handleEventIpc(ipcMain) {
  ipcMain.handle('addNewEvent', async (event, args) => {
    console.log('MAIN: evento da inserire in db', args)
    try {
      await insertEvent(args)
      await addNotifyManagers({ typeNotify: 'event', obj: args.event })
    } catch (error) {
      console.error('Errore nel main process addNewEvent:', error)
      throw error // Rilancia l'errore per essere gestito nel preload
    }
  })

  ipcMain.handle('getEvents', async () => {
    try {
      return await getAllEvents()
    } catch (error) {
      console.error('Errore nel main process getAllEvents:', error)
      throw error // Rilancia l'errore per essere gestito nel preload
    }
  })

  ipcMain.handle('removeEvent', async (event, eventId) => {
    try {
      await deleteThisEvent(eventId)
    } catch (error) {
      console.error('Errore nel main process getAllEvents:', error)
      throw error // Rilancia l'errore per essere gestito nel preload
    }
  })

  ipcMain.handle('removeMultipleEvent', async (event, eventId) => {
    console.log('da main cancella multipla', eventId)
    try {
      await deleteMultipleEvents(eventId)
    } catch (error) {
      console.error('Errore nel main process getAllEvents:', error)
      throw error // Rilancia l'errore per essere gestito nel preload
    }
  })

  ipcMain.handle('updateEvents', async (event, colorMap) => {
    console.log('update event nel main', colorMap)
    try {
      await UpDateEventsDB(colorMap)
    } catch (error) {
      console.error('Errore nel main process UpDateEventsDB,:', error)
      throw error // Rilancia l'errore per essere gestito nel preload
    }
  })
}
