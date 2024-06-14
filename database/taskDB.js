const { Level } = require('level')
const path = require('path')
const fs = require('fs').promises
const fsConstants = require('fs').constants
const { app } = require('electron')

const dbName = 'tasks'
const isBuild = process.env.NODE_ENV === 'production'
const dbPath = path.join(isBuild ? __dirname : app.getAppPath(), `../db/${dbName}`)

let db

// Funzione per creare il database se non esiste
async function createDbTasks() {
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
  await connect()
  try {
    await db.put('totalTasks', 0)
    console.log('Database task inizializzato con successo!')
  } catch (error) {
    console.error('Error populating database:', error)
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

// Funzione che restituisce un task del db
async function getSingleTask(idTask) {
  await createDbTasks() // Ensure DB is created
  await connect()
  try {
    console.log('taskDB: getSingleTask: siamo nel try per leggere il task.id:', idTask)
    const result = await query(idTask)
    const parsedTask = JSON.parse(result)
    parsedTask.start = convertStringToDate(parsedTask.start)
    console.log('tasksDb: getSingleTask; result della query:', parsedTask)
    return parsedTask
  } catch (error) {
    console.error('taskDB: getSingleTask: Error fetching getSingleTask:', error)
    throw error
  } finally {
    await close()
  }
}

// Funzione che restituisce tutto il db
async function getAllTasks(managerName) {
  await createDbTasks() // Ensure DB is created
  console.log('tasksDb: getAllTasks')
  const allTasks = []
  await connect()
  let totTasks
  try {
    totTasks = await query('totalTasks')
  } catch (error) {
    if (error.notFound) {
      console.warn('totalTasks key not found, initializing to 0.')
      totTasks = 0
    } else {
      console.error('Error fetching totalTasks:', error)
      throw error
    }
  }

  try {
    if (managerName === 'all') {
      // Recupera tutti i task
      for await (const [key, value] of db.iterator()) {
        if (key !== 'totalTasks') {
          const parsedTask = JSON.parse(value)
          parsedTask.start = convertStringToDate(parsedTask.start)
          allTasks.push(parsedTask)
        }
      }
    } else {
      // Recupera solo i task del manager specificato
      for await (const [key, value] of db.iterator()) {
        const parsedTask = JSON.parse(value)
        if (key !== 'totalTasks' && parsedTask.manager === managerName) {
          parsedTask.start = convertStringToDate(parsedTask.start)
          allTasks.push(parsedTask)
        }
      }
      console.log('tasksDB: getAllTasks: ho caricato array tasks')
    }
  } catch (error) {
    console.error('tasksDB: getAllTasks: Error fetching getAllTask:', error)
    throw error
  } finally {
    await close()
  }
  console.log('tasksDB: getAllTasks: rimando oggetto tasks, totalTasks')
  return { tasks: allTasks, totalTasks: totTasks }
}

// Funzione per controllare se un task esiste nel database
async function taskExists(key) {
  console.log('taskExists', key)
  try {
    const value = await db.get(key) // Recupero il valore del task
    return value !== undefined // Ritorno true se il task esiste, altrimenti false
  } catch (error) {
    // Se si verifica un errore, il task non esiste
    return false
  }
}

// Funzione per inserire o aggiornare un task nel database
async function insertTask(value) {
  console.log('task in insertOrUpdatetask in db:', value.task.subAction)
  const serializedTask = JSON.stringify({
    ...value.task,
    start: convertDateToString(value.task.start)
  })

  await createDbTasks() // Ensure DB is created
  await connect()
  try {
    if (await taskExists(value.task.id)) {
      // Se il task esiste già, non aggiorno totalTasks
      console.log('task updated successfully in db task.')
      await db.put(value.task.id, serializedTask) // Aggiornamento del task nel database
    } else {
      // Se il task non esiste, incremento totalTasks
      await db.put('totalTasks', value.totalTasks + 1) // Aggiornamento di totalTasks
      await db.put(value.task.id, serializedTask) // Inserimento del task nel database
      console.log('task inserted successfully in db task.')
    }
  } catch (error) {
    console.error('Error inserting or updating task:', error)
    throw error // Gestione dell'errore
  } finally {
    await close() // Chiusura della connessione al database
  }
}

// Funzione per eliminare un task
async function deleteThisTask(taskId) {
  await createDbTasks() // Ensure DB is created
  console.log('Deleting task id: ', taskId)
  await connect()
  try {
    await db.del(taskId) // Elimina il task utilizzando l'ID come chiave
    console.log('task deleted successfully.')
  } catch (error) {
    console.error('Error deleting task:', error)
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
        resolve(value)
      }
    })
  })
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

// Funzione che chiude il db e fa un log di conferma chiusura
function close() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err)
      } else {
        console.log('db tasks close')
        resolve()
      }
    })
  })
}

module.exports = {
  insertTask,
  createDbTasks,
  getSingleTask,
  getAllTasks,
  deleteThisTask
}
