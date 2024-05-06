const { Level } = require('level')
const path = require('path')
const fs = require('fs')

const dbName = 'events'

const { app } = require('electron')
const isBuild = process.env.NODE_ENV === 'production'
const dbPath = path.join(isBuild ? __dirname : app.getAppPath(), `../db/${dbName}`)
console.log('nuova path', dbPath)

const db = new Level(dbPath, { valueEncoding: 'json' })

// Funzione per creare il database se non esiste
function createDbEvents() {
  fs.access(dbPath, fs.constants.F_OK, async (err) => {
    if (err) {
      console.log('db events non esistente, lo creo')

      try {
        await connect()
        await populateDatabase()
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('eventsDB: createDbEvents: db events esiste gia')
    }
  })
}

// Funzione per convertire le date in formato stringa ISO
function convertDateToString(date) {
  return date.toISOString()
}

// Funzione per convertire le stringhe ISO in oggetti Date
function convertStringToDate(dateString) {
  return new Date(dateString)
}

//funzione che restituisce tutto il db
async function getAllEvents() {
  const allEvents = []
  const totEvents = await query('totalEvents')
  try {
    await connect()
    for await (const [key, value] of db.iterator()) {
      if (key !== 'totalEvents') {
        const parsedEvent = JSON.parse(value)
        parsedEvent.start = convertStringToDate(parsedEvent.start)
        parsedEvent.end = convertStringToDate(parsedEvent.end)
        allEvents.push(parsedEvent)
      }
    }
  } catch (error) {
    console.log('errore durante il recupero dei dai dal db events', error)
  } finally {
    await close()
  }
  return { events: allEvents, totalEvents: totEvents }
}

// Funzione per popolare il database
async function populateDatabase() {
  await connect()
  // Inserisci i manager nel database
  try {
    await db.put('totalEvents', 0)
  } catch (error) {
    throw new Error('eventsDB: populateDatabase: error: ' + error)
  } finally {
    console.log('Database events popolato con successo!')
    await close()
  }
}

// funzione che legge tutto il database
// eslint-disable-next-line no-unused-vars
async function readAllEvents() {
  console.log('Database events letto!')
  await connect()
  const results = []
  for await (const [key, value] of db.iterator()) {
    results.push({ key, value })
  }
  console.log('read', results)
  await close()
  return results
}

//funzione che connette al db
function connect() {
  return new Promise((resolve, reject) => {
    db.open((err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

// Funzione per controllare se un evento esiste nel database
// mi servirà quando aggiungo un nuovo event per capire
// se aumentare o no totalEvents
async function eventExists(key) {
  console.log('eventExists', key)
  try {
    const value = await db.get(key) // Recupero il valore dell'evento
    return value !== undefined // Ritorno true se l'evento esiste, altrimenti false
  } catch (error) {
    // Se si verifica un errore, l'evento non esiste
    return false
  }
}

// Funzione per inserire o aggiornare un  evento nel database
//in questa funzione controllo se un event esiste gia, per capire
// se devo aggiungere l'event e aumentare totalEvents in caso non esista,
// o aggiornare un event e non aumentare totalEvents in caso esista.
async function insertEvent(value) {
  console.log('Event in insertOrUpdateEvent in db:', value)
  const serializeEvent = JSON.stringify({
    ...value.event,
    start: convertDateToString(value.event.start),
    end: convertDateToString(value.event.end)
  })
  try {
    await connect() // Connessione al database
    if (await eventExists(value.event.id)) {
      // Se l'evento esiste già, non aggiorno totalEvents
      await db.put(value.event.id, serializeEvent) // Aggiornamento dell'evento nel database
    } else {
      // Se l'evento non esiste, incremento totalEvents
      await db.put('totalEvents', value.totalEvents + 1) // Aggiornamento di totalEvents
      await db.put(value.event.id, serializeEvent) // Inserimento dell'evento nel database
      /*  return { totalEvents: value.totalEvents + 1 } */
    }
    console.log('Event inserted or updated successfully.')
  } catch (error) {
    console.error('Error inserting or updating event:', error)
    throw error // Gestione dell'errore
  } finally {
    await close() // Chiusura della connessione al database
  }
}

//qui ricevo un eventId e lo elimino
async function deleteThisEvent(eventId) {
  console.log('Deleting event id: ', eventId)
  try {
    await connect() // Connessione al database
    await db.del(eventId) // Elimina l'evento utilizzando l'ID come chiave
    console.log('Event deleted successfully.')
  } catch (error) {
    console.error('Error deleting event:', error)
    throw error // Gestione dell'errore
  } finally {
    await close() // Chiusura della connessione al database
  }
}

//non so
function query(key) {
  connect()
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
//funzione che chiude il db e fa un log di conferma chiusura
function close() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err)
      } else {
        console.log('db events close')
        resolve()
      }
    })
  })
}

module.exports = {
  insertEvent,
  createDbEvents,
  getAllEvents,
  deleteThisEvent
}
