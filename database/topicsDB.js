const { Level } = require('level')
const path = require('path')
const fs = require('fs')

const dbName = 'topics'

const { app } = require('electron')
const isBuild = process.env.NODE_ENV === 'production'
const dbPath = path.join(isBuild ? __dirname : app.getAppPath(), `../db/${dbName}`)

const db = new Level(dbPath, { valueEncoding: 'json' })

// Funzione per creare il database se non esiste
function createDbTopics() {
  fs.access(dbPath, fs.constants.F_OK, async (err) => {
    if (err) {
      console.log('db topics non esistente, lo creo')
      try {
        await populateDatabase()
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('topicsDB: createDbTopics: db topics esiste gia')
    }
  })
}

// Funzione per popolare il database
async function populateDatabase() {
  console.log('Populating topics database...')
  await connect()
  try {
    await db.put('totalTopics', 0)
    await readAllTopics()
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

//funzione che restituisce tutto il db
async function getAllTopics() {
  console.log('Reading all topics from database...')
  await connect()
  const alltopics = []

  try {
    const tottopics = await query('totalTopics')
    console.log('dopo query')
    for await (const [key, value] of db.iterator()) {
      if (key !== 'totalTopics') {
        console.log('parsedtopic', value)
        const parsedtopic = await JSON.parse(value)
        parsedtopic.dateStart = convertStringToDate(parsedtopic.dateStart)

        alltopics.push(parsedtopic)
      }
    }
    console.log('cosa sto manadando da getAllTopics', alltopics, tottopics)
    return { topics: alltopics, totalTopics: tottopics }
  } catch (error) {
    console.log('errore durante il recupero dei dai dal db topics', error)
  } finally {
    await close()
  }
}

// funzione che legge tutto il database
async function readAllTopics() {
  console.log('Database topics letto!')
  await connect()
  const results = []
  for await (const [key, value] of db.iterator()) {
    results.push({ key, value })
  }
  console.log('satmapa di tutto il db topics', results)
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

// Funzione per controllare se un topico esiste nel database
// mi servirà quando aggiungo un nuovo topic per capire
// se aumentare o no totaltopics
async function topicExists(key) {
  console.log('topicExists', key)
  try {
    const value = await db.get(key) // Recupero il valore dell'topico
    return value !== undefined // Ritorno true se l'topico esiste, altrimenti false
  } catch (error) {
    // Se si verifica un errore, l'topico non esiste
    return false
  }
}

// Funzione per inserire o aggiornare un  topico nel database
//in questa funzione controllo se un topic esiste gia, per capire
// se devo aggiungere l'topic e aumentare totaltopics in caso non esista,
// o aggiornare un topic e non aumentare totaltopics in caso esista.
async function insertTopic(value) {
  console.log('topic in insertOrUpdatetopic in db:', value)
  const serializetopic = JSON.stringify({
    ...value.topic,
    dateStart: convertDateToString(value.topic.dateStart)
  })
  try {
    await connect() // Connessione al database
    if (await topicExists(value.topic.id)) {
      console.log('topic already exists', value.topic)
      // Se l'topico esiste già, non aggiorno totaltopics
      await db.put(value.topic.id, serializetopic) // Aggiornamento dell'topico nel database
    } else {
      console.log('topic not exists')
      // Se l'topico non esiste, incremento totaltopics
      await db.put('totalTopics', value.totalTopics + 1) // Aggiornamento di totaltopics
      await db.put(value.topic.id, serializetopic) // Inserimento dell'topico nel database
    }
    console.log('topic inserted or updated successfully.')
  } catch (error) {
    console.error('Error inserting or updating topic:', error)
    throw error // Gestione dell'errore
  }
}

//qui ricevo un topicId e lo elimino
async function deleteThisTopic(topicId) {
  console.log('Deleting topic id: ', topicId)
  try {
    await connect() // Connessione al database
    await db.del(topicId.id) // Elimina l'topico utilizzando l'ID come chiave
    console.log('topic deleted successfully.')
  } catch (error) {
    console.error('Error deleting topic:', error)
    throw error // Gestione dell'errore
  } finally {
    await close() // Chiusura della connessione al database
  }
}

//non so
async function query(key) {
  await connect()
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
//funzione che chiude il db e fa un log di conferma chiusura
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
