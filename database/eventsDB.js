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
  readAllEvents
}
