const { Level } = require('level')
const path = require('path')
const fs = require('fs').promises
const fsConstants = require('fs').constants

const { app } = require('electron')

const dbName = 'supplies'
const isBuild = process.env.NODE_ENV === 'supplieion'
const dbPath = path.join(isBuild ? __dirname : app.getAppPath(), `../db/${dbName}`)
console.log('nuova path', dbPath)

let db

async function createDbSupplies() {
  try {
    await fs.access(dbPath, fsConstants.F_OK)
    console.log(`db ${dbName} gia esistente`)
  } catch (err) {
    console.log(`db ${dbName} non esistente, lo creo:`)
    try {
      /* await populateDatabase() */
      await connect()
      await close()
      console.log('supplies db creato con successo')
    } catch (error) {
      console.error(`errore in fase di creazione db ${dbName}:`, error)
      throw error
    }
  }
  return dbPath
}

async function getAllSupplies() {
  console.log('suppliesDB: getAllSupplies')
  await createDbSupplies() // Ensure DB is created
  const allSupplies = []
  await connect()

  try {
    for await (const [key, value] of db.iterator()) {
      const parsedEvent = JSON.parse(value)
      console.log('qui', key)
      if (key !== 'supplyCounter') {
        allSupplies.push(parsedEvent)
      }
    }
    console.log('suppliesDB: getAllSupplies: ho finito di raccogliere gli supplies')
  } catch (error) {
    console.error('Error fetching all supplies:', error)
    throw error
  } finally {
    await close()
  }
  return allSupplies
}

async function eventExists(key) {
  try {
    const value = await db.get(key)
    return value !== undefined
  } catch (error) {
    return false
  }
}

async function insertSupply(value) {
  console.log('Supply arrivato nel db:', value)

  const serializeProd = JSON.stringify({
    ...value
  })
  console.log('supply serialized', serializeProd)
  await connect()
  try {
    if (await eventExists(value.supplyId)) {
      console.log('Il prodotto esiste già', value)
    } else {
      console.log('Il prodotto non esiste, lo aggiungo')
    }
    await db.put(value.supplyId, serializeProd)
    console.log('Supply inserito o aggiornato con successo.')
  } catch (error) {
    console.error('Errore durante l’inserimento o l’aggiornamento del supply:', error)
    throw error
  } finally {
    await close()
  }
}

async function deleteSupply(supplyId) {
  await createDbSupplies() // Ensure DB is created
  await connect()
  try {
    await db.del(supplyId)
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
        console.log('db supplies connesso')
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
        console.log('db supplies chiuso')
        resolve()
      }
    })
  })
}

module.exports = {
  insertSupply,
  createDbSupplies,
  getAllSupplies,
  deleteSupply
}
