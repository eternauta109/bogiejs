const { Level } = require('level')
const path = require('path')
const fs = require('fs')

const dbName = 'options'

const { app } = require('electron')
const isBuild = process.env.NODE_ENV === 'production'
const dbPath = path.join(isBuild ? __dirname : app.getAppPath(), `../db/${dbName}`)

const db = new Level(dbPath, { valueEncoding: 'json' })

// Funzione per creare il database se non esiste
function createDbOptions() {
  fs.access(dbPath, fs.constants.F_OK, async (err) => {
    if (err) {
      console.log('db options non esistente, lo creo')

      try {
        await connect()
        await populateDatabase()
      } catch (error) {
        console.log(error)
      } finally {
        await close()
      }
    } else {
      console.log('db option esistente')
    }
  })
}

// Funzione per popolare il database
async function populateDatabase() {
  // Inserisci i manager nel database (assumendo che dbMan sia l'istanza del database creato)
  const setOptions = {
    divisions: [
      {
        nameDivision: 'marketing',
        color: '#F39C12'
      },
      {
        nameDivision: 'operations',
        color: '#7DCEA0'
      },
      {
        nameDivision: 'pricing',
        color: '#BB8FCE'
      },
      {
        nameDivision: 'facilities',
        color: '#AAB7B8'
      },
      {
        nameDivision: 'screencontent',
        color: '#448AFF'
      },
      {
        nameDivision: 'actionpoint',
        color: '#EF5350'
      },
      {
        nameDivision: 'brief',
        color: '#90A4AE'
      }
    ],
    eventType: [
      {
        type: 'evento',
        color: '#F39C12'
      },
      {
        type: 'matineè',
        color: '#7DCEA0'
      },
      {
        type: 'prevendite',
        color: '#BB8FCE'
      },
      {
        type: 'promo',
        color: '#AAB7B8'
      },
      {
        type: 'compleanni',
        color: '#448AFF'
      },
      {
        type: 'extra',
        color: '#EF5350'
      }
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
    throw new Error('populate database  options', error)
  } finally {
    await close()
  }
}

//funzione che restituisce tutto il db
async function getAllOptions() {
  console.log('leggo tutto il db options')
  await connect()
  try {
    const value = await db.get('config')

    return value
  } catch (err) {
    throw new Error('errore in fase di estraggo options', err)
  } finally {
    await close()
  }
}

//non so
// eslint-disable-next-line no-unused-vars
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

//funzione che connette al db
function connect() {
  return new Promise((resolve, reject) => {
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

//funzione che chiude il db e fa un log di conferma chiusura
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
