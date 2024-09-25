const { Level } = require('level')
const path = require('path')
const fs = require('fs').promises
const { app } = require('electron')
const fsConstants = require('fs').constants

const dbName = 'options'
const isBuild = process.env.NODE_ENV === 'production'
const dbPath = path.join(isBuild ? __dirname : app.getAppPath(), `../db/${dbName}`)
let db

// Funzione per creare il database se non esiste
async function createDbOptions() {
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

async function populateDatabase() {
  const setOptions = {
    MAXTITLELENGTH: 40,
    MAXDESCRIPTIONLENGTH: 240,
    MAXNOTELENGTH: 140,
    divisions: [
      { nameDivision: 'marketing', color: '#F39C12' },
      { nameDivision: 'operations', color: '#7DCEA0' },
      { nameDivision: 'pricing', color: '#BB8FCE' },
      { nameDivision: 'facilities', color: '#AAB7B8' },
      { nameDivision: 'screencontent', color: '#448AFF' },
      { nameDivision: 'actionpoint', color: '#EF5350' },
      { nameDivision: 'brief', color: '#90A4AE' }
    ],
    eventType: [
      { type: 'evento', color: '#F39C12' },
      { type: 'matineè', color: '#7DCEA0' },
      { type: 'prevendite', color: '#BB8FCE' },
      { type: 'promo', color: '#AAB7B8' },
      { type: 'compleanni', color: '#448AFF' },
      { type: 'extra', color: '#EF5350' }
    ],
    topicType: [
      { value: 'none', label: 'none' },
      { value: 'cascading', label: 'cascading' },
      { value: 'suggest', label: 'abitudini' },
      { value: 'tutorial', label: 'Tutorial' },
      { value: 'procedur', label: 'procedura interna' },
      { value: 'brief', label: 'brief' },
      { value: 'file', label: 'file' },
      { value: 'module', label: 'modulo' },
      { value: 'internalComunication', label: 'comunicazione da sede' }
    ],
    docTypes: [
      { value: 'none', label: 'none' },
      { value: 'presentazione', label: 'presentazione' },
      { value: 'pdf', label: 'pdf' },
      { value: 'mail', label: 'mail' },
      { value: 'excel', label: 'excel' },
      { value: 'word', label: 'word' }
    ],
    officeTypes: [
      { value: 'none', label: 'none' },
      { value: 'marketing', label: 'marketing' },
      { value: 'hr', label: 'hr' },
      { value: 'operations', label: 'operations' },
      { value: 'pricing', label: 'pricing' },
      { value: 'filmcontent', label: 'Film Content' },
      { value: 'it', label: 'it' },
      { value: 'finance', label: 'finance' },
      { value: 'retail', label: 'retail' },
      { value: 'events', label: 'events' },
      { value: 'health', label: 'health and safety' }
    ]
  }

  await connect()
  try {
    await db.put('config', setOptions)
    console.log('Database options popolato con successo!')
  } catch (error) {
    console.error('Errore in fase di popolamento options:', error)
    throw error
  } finally {
    await close()
  }
}

async function getAllOptions() {
  console.log('leggo tutto il db options')
  await createDbOptions() // Ensure DB is created
  let value
  await connect()
  try {
    value = await query('config')
  } catch (err) {
    console.error('Errore in fase di estrazione options:', err)
    throw err
  } finally {
    await close()
  }
  console.log('leggo tutto il db options:', value)
  return value
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
        console.log('db option open')
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
        console.log('db option close')
        resolve()
      }
    })
  })
}

module.exports = {
  createDbOptions,
  getAllOptions
}
