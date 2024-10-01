const { Level } = require('level')
const path = require('path')
const fs = require('fs').promises
const fsConstants = require('fs').constants

const { app } = require('electron')

const dbName = 'transactions'
const isBuild = process.env.NODE_ENV === 'transactionsion'
const dbPath = path.join(isBuild ? __dirname : app.getAppPath(), `../db/${dbName}`)
console.log('nuova path', dbPath)

let db

async function createDbTransactions() {
  try {
    await fs.access(dbPath, fsConstants.F_OK)
    console.log(`db ${dbName} gia esistente`)
  } catch (err) {
    console.log(`db ${dbName} non esistente, lo creo:`)
    try {
      /* await populateDatabase() */
      await connect()
      await close()
      console.log('transactions db creato con successo')
    } catch (error) {
      console.error(`errore in fase di creazione db ${dbName}:`, error)
      throw error
    }
  }
  return dbPath
}

async function getAllTransactions() {
  console.log('transactionsDB: getAllTransactions')

  const allTransactions = []
  await connect()

  try {
    for await (const [key, value] of db.iterator()) {
      const parsedEvent = JSON.parse(value)

      if (key !== 'transactionCounter') {
        allTransactions.push(parsedEvent)
      }
    }
    console.log('transactionsDB: getAllTransactions: ho finito di raccogliere gli transactions')
  } catch (error) {
    console.error('Error fetching all transactions:', error)
    throw error
  } finally {
    await close()
  }
  return allTransactions
}

async function eventExists(key) {
  try {
    const value = await db.get(key)
    return value !== undefined
  } catch (error) {
    return false
  }
}

async function insertTransaction(transactions) {
  console.log('Transactions arrivati nel db:', transactions)

  await connect() // Apri la connessione al DB una sola volta per ottimizzare
  try {
    for (const transaction of transactions) {
      const serializeTransaction = JSON.stringify(transaction)
      console.log('Transaction serialized', serializeTransaction)

      if (await eventExists(transaction.salesId)) {
        console.log('La transazione esiste già', transaction.salesId)
      } else {
        console.log('La transazione non esiste, la aggiungo')
        await db.put(transaction.salesId, serializeTransaction)
        console.log('Transazione inserita con successo.')
      }
    }
  } catch (error) {
    console.error('Errore durante l’inserimento o l’aggiornamento delle transazioni:', error)
    throw error
  } finally {
    await close() // Chiudi la connessione al DB alla fine
  }
}

async function deleteTransaction(transactionId) {
  await createDbTransactions() // Ensure DB is created
  await connect()
  try {
    await db.del(transactionId)
    console.log('Event deleted successfully.')
  } catch (error) {
    console.error('Error deleting event:', error)
    throw error
  } finally {
    await close()
  }
}

/* async function query(key) {
  return new Promise((resolve, reject) => {
    db.get(key, (err, value) => {
      if (err) {
        reject(err)
      } else {
        resolve(value)
      }
    })
  })
} */

function connect() {
  return new Promise((resolve, reject) => {
    db = new Level(dbPath, { valueEncoding: 'json' })
    db.open((err) => {
      if (err) {
        reject(err)
      } else {
        console.log('db transactions connesso')
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
        console.log('db transactions chiuso')
        resolve()
      }
    })
  })
}

module.exports = {
  insertTransaction,
  createDbTransactions,
  getAllTransactions,
  deleteTransaction
}
