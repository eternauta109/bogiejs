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

async function getTransactionsByDate(selectedDate) {
  console.log('Recupero transazioni per la data:', selectedDate)

  // Calcola l'inizio della giornata in UTC alle 6:00 AM
  const startOfDay = new Date(`${selectedDate}T06:00:00.000Z`)

  // Calcola la fine della giornata successiva in UTC alle 3:00 AM
  const endOfNextDay = new Date(`${selectedDate}T03:00:00.000Z`)
  endOfNextDay.setUTCDate(endOfNextDay.getUTCDate() + 1) // Aggiungi un giorno

  console.log('Cerco transazioni tra:', startOfDay, 'e', endOfNextDay)

  const filteredTransactions = []
  await connect() // Connetti al DB

  try {
    for await (const [key, value] of db.iterator()) {
      const transaction = JSON.parse(value)

      if (key !== 'transactionCounter') {
        const transactionDate = new Date(transaction.transactionDate)

        // Filtra le transazioni che si trovano nel range temporale specificato in UTC
        if (transactionDate >= startOfDay && transactionDate <= endOfNextDay) {
          filteredTransactions.push(transaction)
        }
      }
    }
    console.log('Transazioni filtrate per la data:', filteredTransactions.length)
  } catch (error) {
    console.error('Errore durante il recupero delle transazioni per data:', error)
    throw error
  } finally {
    await close() // Chiudi la connessione al DB
  }

  return filteredTransactions
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
  await connect()
  try {
    // Itera su tutte le transazioni nel DB
    for await (const [key, value] of db.iterator()) {
      const transaction = JSON.parse(value)
      // Controlla se il transactionId corrisponde
      if (transaction.transactionId === transactionId) {
        // Elimina la transazione
        await db.del(key)
        console.log(`Transaction with ID ${key} deleted successfully.`)
      }
    }
    console.log(`All transactions with transactionId ${transactionId} deleted successfully.`)
  } catch (error) {
    console.error('Error deleting transactions:', error)
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
  getTransactionsByDate,
  createDbTransactions,
  getAllTransactions,
  deleteTransaction
}
