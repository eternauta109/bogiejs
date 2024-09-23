const { Level } = require('level')
const path = require('path')
const fs = require('fs').promises
const fsConstants = require('fs').constants

const { app } = require('electron')

const dbName = 'events'
const isBuild = process.env.NODE_ENV === 'production'
const dbPath = path.join(isBuild ? __dirname : app.getAppPath(), `../db/${dbName}`)
console.log('nuova path', dbPath)

let db

async function createDbEvents() {
  try {
    await fs.access(dbPath, fsConstants.F_OK)
    console.log(`db ${dbName} gia esistente`)
  } catch (err) {
    console.log(`db ${dbName} non esistente, lo creo:`)
    try {
      await populateDatabase()
    } catch (error) {
      console.error(`errore in fase di creazione db ${dbName}:`, error)
      throw error
    }
  }
  return dbPath
}

function convertDateToString(date) {
  return date.toISOString()
}

function convertStringToDate(dateString) {
  return new Date(dateString)
}

async function getAllEvents() {
  console.log('eventsDB: getAllEvents')
  await createDbEvents() // Ensure DB is created
  const allEvents = []
  await connect()
  let totEvents
  try {
    totEvents = await query('totalEvents')
  } catch (error) {
    if (error.notFound) {
      console.warn('totalEvents key not found, initializing to 0.')
      totEvents = 0
    } else {
      console.error('Error fetching totalEvents:', error)
      throw error
    }
  }

  try {
    for await (const [key, value] of db.iterator()) {
      if (key !== 'totalEvents') {
        const parsedEvent = JSON.parse(value)
        parsedEvent.start = convertStringToDate(parsedEvent.start)
        parsedEvent.end = convertStringToDate(parsedEvent.end)
        allEvents.push(parsedEvent)
      }
    }
    console.log('eventsDB: getAllEvents: ho finito di raccogliere gli events')
  } catch (error) {
    console.error('Error fetching all events:', error)
    throw error
  } finally {
    await close()
  }
  console.log('eventsDB: getAllEvents: invio obj events: allEvents, totalEvents: totEvents')
  return { events: allEvents, totalEvents: totEvents }
}

async function populateDatabase() {
  await connect()
  try {
    await db.put('totalEvents', 0)
    console.log('Database events popolato con successo!')
  } catch (error) {
    console.error('Error populating database:', error)
    throw error
  } finally {
    await close()
  }
}

async function readAllEvents() {
  await createDbEvents() // Ensure DB is created
  const results = []
  await connect()
  try {
    for await (const [key, value] of db.iterator()) {
      results.push({ key, value })
    }
    console.log('read', results)
  } catch (error) {
    console.error('Error reading all events:', error)
  } finally {
    await close()
  }
  return results
}

async function eventExists(key) {
  try {
    const value = await db.get(key)
    return value !== undefined
  } catch (error) {
    return false
  }
}

async function insertEvent(value) {
  await createDbEvents() // Ensure DB is created
  const serializeEvent = JSON.stringify({
    ...value.event,
    start: convertDateToString(value.event.start),
    end: convertDateToString(value.event.end)
  })
  await connect()
  try {
    if (await eventExists(value.event.id)) {
      await db.put(value.event.id, serializeEvent)
    } else {
      await db.put('totalEvents', value.totalEvents + 1)
      await db.put(value.event.id, serializeEvent)
    }
    console.log('Event inserted or updated successfully.')
  } catch (error) {
    console.error('Error inserting or updating event:', error)
    throw error
  } finally {
    await close()
  }
}

async function deleteThisEvent(eventId) {
  await createDbEvents() // Ensure DB is created
  await connect()
  try {
    await db.del(eventId)
    console.log('Event deleted successfully.')
  } catch (error) {
    console.error('Error deleting event:', error)
    throw error
  } finally {
    await close()
  }
}

async function deleteMultipleEvents(frequencyId) {
  /* console.log('rimuovi eventi multipli', frequencyId) */
  await createDbEvents() // Assicura che il DB sia creato
  await connect() // Connessione al DB

  try {
    // 1. Crea uno stream per leggere tutti gli eventi
    const eventsToDelete = []

    for await (const [key, value] of db.iterator()) {
      /* console.log('prima di convertire in json', value) */
      const event = JSON.parse(value) // Supponendo che i dati siano in JSON
      /* console.log('in json', event) */
      if (event.frequencyId === frequencyId) {
        eventsToDelete.push(key) // Aggiungi l'ID dell'evento da eliminare
      }
    }

    // 2. Elimina tutti gli eventi con il frequencyId
    for (const eventId of eventsToDelete) {
      await db.del(eventId)
      console.log(`Event with ID ${eventId} deleted successfully.`)
    }

    console.log(`All events with frequencyId ${frequencyId} have been deleted.`)
  } catch (error) {
    console.error('Error deleting events by frequencyId:', error)
    throw error
  } finally {
    await close() // Chiudi la connessione al DB
  }
}

async function UpDateEventsDB(colorMap) {
  console.log('UpDateEventsDB', colorMap)

  await connect() // Connessione al DB

  console.log('Inizio aggiornamento eventi nel DB')

  try {
    for await (const [key, value] of db.iterator()) {
      try {
        const event = JSON.parse(value) // Supponendo che i dati siano in JSON
        console.log('Evento originale:', event)

        if (event.eventType === 'ricorenza') {
          event.eventType = 'ricorrenza'
          console.log(`ricorrenza aggiornato con nuovo valore: ricorrenza`)
        }

        // Controlla se l'evento ha un eventType che corrisponde a una chiave in colorMap
        if (event.eventType && colorMap[event.eventType]) {
          // Aggiorna il campo colorEventType in base al tipo di evento
          event.colorEventType = colorMap[event.eventType]

          // Salva l'evento aggiornato nel DB
          await db.put(key, JSON.stringify(event)) // Sovrascrive l'evento nel DB
          console.log(`Evento aggiornato con nuovo colore: ${event.colorEventType}`)
        } else {
          console.log(`Tipo di evento non trovato o non mappato: ${event.eventType}`)
        }
      } catch (error) {
        console.error(`Errore nel processare l'evento con chiave ${key}:`, error)
      }
    }
  } catch (iteratorError) {
    console.error("Errore durante l'iterazione del database:", iteratorError)
  } finally {
    await close() // Chiudi la connessione al DB dopo l'iterazione completa
    console.log('Aggiornamento completato e database chiuso')
  }
}

async function query(key) {
  return new Promise((resolve, reject) => {
    db.get(key, (err, value) => {
      if (err) {
        reject(err)
      } else {
        resolve(value)
      }
    })
  })
}

function connect() {
  return new Promise((resolve, reject) => {
    db = new Level(dbPath, { valueEncoding: 'json' })
    db.open((err) => {
      if (err) {
        reject(err)
      } else {
        console.log('db event connesso')
        resolve()
      }
    })
  })
}

function close() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err)
      } else {
        console.log('db events chiuso')
        resolve()
      }
    })
  })
}

module.exports = {
  insertEvent,
  createDbEvents,
  getAllEvents,
  deleteThisEvent,
  UpDateEventsDB,
  readAllEvents,
  deleteMultipleEvents
}
