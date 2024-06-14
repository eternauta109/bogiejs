const { Level } = require('level')
const path = require('path')
const fs = require('fs').promises
const fsConstants = require('fs').constants
const { app } = require('electron')

const dbName = 'topics'
const isBuild = process.env.NODE_ENV === 'production'
const dbPath = path.join(isBuild ? __dirname : app.getAppPath(), `../db/${dbName}`)
let db

// Funzione per creare il database se non esiste
async function createDbTopics() {
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

// Funzione per popolare il database
async function populateDatabase() {
  console.log('Populating topics database...')
  await connect()
  try {
    await db.put('totalTopics', 0)
    console.log('Database topics popolato con successo!')
  } catch (error) {
    console.error('Error populating topics database:', error)
    throw error
  } finally {
    await close()
  }
}

// Funzione per convertire le date in formato stringa ISO
function convertDateToString(date) {
  return date.toISOString()
}

// Funzione per convertire le stringhe ISO in oggetti Date
function convertStringToDate(dateString) {
  return new Date(dateString)
}

// Funzione che restituisce tutto il db
async function getAllTopics() {
  await createDbTopics() // Ensure DB is created
  console.log('topicsDb: getAllTopics: Reading all topics from database...')
  const allTopics = []
  await connect()
  let totalTopics
  try {
    totalTopics = await query('totalTopics')
  } catch (error) {
    if (error.notFound) {
      console.warn('totalTopics key not found, initializing to 0.')
      totalTopics = 0
    } else {
      console.error('Error fetching totalTopics:', error)
      throw error
    }
  }

  try {
    for await (const [key, value] of db.iterator()) {
      if (key !== 'totalTopics') {
        const parsedTopic = await JSON.parse(value)
        parsedTopic.dateStart = convertStringToDate(parsedTopic.dateStart)
        allTopics.push(parsedTopic)
      }
    }
    console.log('topicsDB: getAllTopics: ho caricato array topics')
  } catch (error) {
    console.error('topicsDB: getAllTopics: Error fetching topics', error)
    throw error
  } finally {
    await close()
  }
  console.log('topicsDB: getAllTopics: rimando oggetto topics, totalTopics')
  return { topics: allTopics, totalTopics: totalTopics }
}

// Funzione che legge tutto il database
async function readAllTopics() {
  await createDbTopics() // Ensure DB is created
  console.log('Database topics letto!')
  await connect()
  const results = []
  try {
    for await (const [key, value] of db.iterator()) {
      results.push({ key, value })
    }
    console.log('satmapa di tutto il db topics', results)
  } catch (error) {
    console.error('topicsDB: readAllTopics: Error readAllTopics', error)
    throw error
  } finally {
    await close()
  }
  return results
}

// Funzione che connette al db
function connect() {
  return new Promise((resolve, reject) => {
    db = new Level(dbPath, { valueEncoding: 'json' })
    db.open((err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

// Funzione per controllare se un topic esiste nel database
async function topicExists(key) {
  console.log('topicExists', key)
  try {
    const value = await db.get(key) // Recupero il valore del topic
    return value !== undefined // Ritorno true se il topic esiste, altrimenti false
  } catch (error) {
    // Se si verifica un errore, il topic non esiste
    return false
  }
}

// Funzione per inserire o aggiornare un topic nel database
async function insertTopic(value) {
  console.log('topic in insertOrUpdatetopic in db:', value)
  const serializedTopic = JSON.stringify({
    ...value.topic,
    dateStart: convertDateToString(value.topic.dateStart)
  })
  await createDbTopics() // Ensure DB is created
  await connect()
  try {
    if (await topicExists(value.topic.id)) {
      console.log('topic already exists', value.topic)
      // Se il topic esiste già, non aggiorno totalTopics
      await db.put(value.topic.id, serializedTopic) // Aggiornamento del topic nel database
    } else {
      console.log('topic not exists')
      // Se il topic non esiste, incremento totalTopics
      await db.put('totalTopics', value.totalTopics + 1) // Aggiornamento di totalTopics
      await db.put(value.topic.id, serializedTopic) // Inserimento del topic nel database
    }
    console.log('topic inserted or updated successfully.')
  } catch (error) {
    console.error('Error inserting or updating topic:', error)
    throw error // Gestione dell'errore
  } finally {
    await close()
  }
}

// Funzione per eliminare un topic
async function deleteThisTopic(topicId) {
  await createDbTopics() // Ensure DB is created
  console.log('Deleting topic id: ', topicId)
  await connect()
  try {
    await db.del(topicId.id) // Elimina il topic utilizzando l'ID come chiave
    console.log('topic deleted successfully.')
  } catch (error) {
    console.error('Error deleting topic:', error)
    throw error // Gestione dell'errore
  } finally {
    await close() // Chiusura della connessione al database
  }
}

// Funzione per eseguire una query sul database
async function query(key) {
  return new Promise((resolve, reject) => {
    db.get(key, (err, value) => {
      if (err) {
        reject(err)
      } else {
        console.log('db topics open')
        resolve(value)
      }
    })
  })
}

// Funzione che chiude il db e fa un log di conferma chiusura
function close() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err)
      } else {
        console.log('db topics close')
        resolve()
      }
    })
  })
}

module.exports = {
  insertTopic,
  createDbTopics,
  readAllTopics,
  getAllTopics,
  deleteThisTopic
}
