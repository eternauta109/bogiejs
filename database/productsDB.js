const { Level } = require('level')
const path = require('path')
const fs = require('fs').promises
const fsConstants = require('fs').constants

const { app } = require('electron')

const dbName = 'products'
const isBuild = process.env.NODE_ENV === 'production'
const dbPath = path.join(isBuild ? __dirname : app.getAppPath(), `../db/${dbName}`)
console.log('nuova path', dbPath)

let db

async function createDbProducts() {
  try {
    await fs.access(dbPath, fsConstants.F_OK)
    console.log(`db ${dbName} gia esistente`)
  } catch (err) {
    console.log(`db ${dbName} non esistente, lo creo:`)
    try {
      /* await populateDatabase() */
      await connect()
      await close()
      console.log('products db creato con successo')
    } catch (error) {
      console.error(`errore in fase di creazione db ${dbName}:`, error)
      throw error
    }
  }
  return dbPath
}

async function getAllProducts() {
  console.log('productsDB: getAllProducts')
  await createDbProducts() // Ensure DB is created
  const allProducts = []
  let totalProduct = 0
  await connect()

  try {
    for await (const [key, value] of db.iterator()) {
      const parsedEvent = JSON.parse(value)
      if (key !== 'productCounter') {
        allProducts.push(parsedEvent)
      } else {
        totalProduct = parseInt(value, 10)
      }
    }
    console.log('productsDB: getAllProducts: ho finito di raccogliere gli products')
  } catch (error) {
    console.error('Error fetching all products:', error)
    throw error
  } finally {
    await close()
  }

  return { allProducts, totalProduct }
}

async function eventExists(key) {
  try {
    const value = await db.get(key)
    return value !== undefined
  } catch (error) {
    return false
  }
}

async function getNextId() {
  try {
    // Prova a recuperare l'attuale valore del contatore
    let currentId = 0
    try {
      currentId = await db.get('productCounter')
      currentId = parseInt(currentId, 10) // Converti l'ID in un numero intero
      console.log('prima volta productCounter', currentId)
    } catch (error) {
      if (error.notFound) {
        currentId = 0 // Inizia da 0 se il contatore non è stato ancora creato
      } else {
        console.error('Errore durante il recupero del supplyCounter:', error)
        throw error
      }
    }

    // Incrementa il contatore di uno
    const nextId = currentId + 1
    console.log('id prodotto aumentato:', nextId)
    await db.put('productCounter', nextId.toString()) // Salva il nuovo valore del contatore

    return nextId
  } catch (error) {
    console.error('Errore durante la generazione del prossimo ID:', error)
    throw error
  }
}

async function insertProduct(value) {
  console.log('prodotto arrivato nel db:', value)
  const serializeProd = JSON.stringify({
    ...value
  })
  await connect()
  try {
    if (await eventExists(value.idProduct)) {
      console.log('il prodotto esiste')
    } else {
      console.log('il prodotto non  esiste')
      await getNextId() // Ottieni il prossimo ID
    }
    await db.put(value.idProduct, serializeProd)
    console.log('Event inserted or updated successfully.')
  } catch (error) {
    console.error('Error inserting or updating event:', error)
    throw error
  } finally {
    await close()
  }
}

async function deleteProduct(productId) {
  await createDbProducts() // Ensure DB is created
  await connect()
  try {
    await db.del(productId)
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
  insertProduct,
  createDbProducts,
  getAllProducts,
  deleteProduct
}
