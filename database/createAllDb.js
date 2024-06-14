// database/createAllDb.js
const { createDbUser } = require('./databaseManagersHandle')
const { createDbEvents } = require('./eventsDB')
const { createDbTasks } = require('./taskDB')
const { createDbTopics } = require('./topicsDB')
const { createDbOptions } = require('./optionsDB')
const logger = require('../utils/logger')

export async function createAllDb() {
  console.log('creo tutti i db')
  try {
    await createDbUser()

    logger.info('Tutti i database sono stati creati con successo.')
  } catch (error) {
    logger.error('Si è verificato un errore durante la creazione dei database:', error)
    throw error
  }
}
