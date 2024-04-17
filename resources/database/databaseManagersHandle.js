const { Level } = require('level')
/* const path = require('path') */
const fs = require('fs')

const dbName = 'managers'

/* const { app } = require('electron') */
/* const userPath = app.getAppPath() */
/* const dbPath = path.join(__dirname, `./dbxbigeye/${dbName}`) */
const dbPath = `c:\\dbBigEye\\${dbName}` //funziona con percorso assoluto
console.log('dbPath', dbPath)
const db = new Level(dbPath, { valueEncoding: 'json' })

//funzione per cercare e restituire il manager con crede
//credenziali corrette
async function getManagerByCredentials(userName, password) {
  console.log('ricevo in db query user pass', userName, password, dbPath)
  await connect()
  let managerFound = null
  let managersName = null

  try {
    for await (const [key, value] of db.iterator()) {
      const manager = value
      console.log('manager iterati', manager)
      if (manager.userName === userName && manager.password === password) {
        console.log('Credenziali corrette', key, manager)
        managerFound = { ...manager, isAuth: true }
        managersName = await getAllManagersName(managerFound.cinema)
        await close()
        return { managerFound, managersName } // Esci dal loop quando trovi il manager corrispondente
      }
    }
    if (!managerFound) {
      return {
        managerFound: { isAuth: false },
        managersName: []
      }
    }
  } catch (error) {
    console.error('Errore durante la ricerca del manager:', error)
    throw error
  } finally {
    // Chiudi il database solo dopo aver completato le iterazioni

    await close()
  }
}

// Funzione per creare il database se non esiste
function createDbUser() {
  fs.access(dbPath, fs.constants.F_OK, async (err) => {
    if (err) {
      console.log('db managers non esistente, lo creo')

      await connect()
      try {
        await populateDatabase()
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('db managers esistente')
      try {
        await connect()
        await readAll()
      } catch (error) {
        console.log('try catch', error)
      }
    }
  })
}

//funzione che restituisce tutto i manager che appartengono al determinato cinema
async function getAllManagers(user) {
  const allManagers = []
  console.log('prendo tutti i colleghi di :', user)
  try {
    await connect()
    for await (const [key, value] of db.iterator()) {
      console.log('value??', key, value)
      if (user.user.cinema === value.cinema) {
        allManagers.push(value)
      }
    }
    console.log('db colleghi di ritorno', allManagers)
  } catch (error) {
    console.log('errore durante il recupero dei dai dal db mangers', error)
  } finally {
    await close()
  }
  return allManagers
}

//funzione che inserisce un nuovo manager
async function addNewUser(newUser) {
  console.log('sono nel db manager e devo inserire questo nuovo user:', newUser)
  try {
    await connect()
    await db.put(newUser.id, newUser)
    const managersName = await getAllManagersName(newUser.cinema)

    return [...managersName]
  } catch (error) {
    throw new Error('addnew user:', error)
  } finally {
    await close()
  }
}

//funzione che aggiunge una notifica nel db managers
async function addNotifyManagers({ typeNotify, obj }) {
  console.log('NOTIFY', typeNotify, obj)
  let newNotify
  if (typeNotify === 'topic') {
    if (obj.topicArgument !== '') {
      newNotify = {
        notify: `${obj.createdBy} ha creato un nuovo ${typeNotify} con titolo ${obj.topicArgument} `,
        see: true,
        id: obj.id
      }
    } else {
      return null
    }
  } else {
    newNotify = {
      notify: `${obj.createdBy} ha creato un nuovo ${typeNotify} con titolo ${obj.title} `,
      see: true,
      id: obj.id
    }
  }

  console.log('oggetto new notify', newNotify)
  try {
    await connect()
    for await (const [key, value] of db.iterator()) {
      if (obj.createdBy !== value.userName) {
        console.log('inserisco nuova notifica a ', value.userName)

        // Aggiungi la nuova notifica per il manager corrente
        value.notification.push(newNotify)

        // Aggiorna il manager nel database
        await db.put(key, value)
      }
    }
  } catch (error) {
    console.log("errore nell'inserimento nuova notifica", error)
  } finally {
    await close()
  }
}

async function deleteThisManager(user) {
  console.log('in db manger devo cancellre questo user:', user)
  try {
    await connect()
    // Rimuovi l'elemento dal database usando il metodo del
    await db.del(user.id)
    const managersName = await getAllManagersName(user.cinema)

    return [...managersName]
  } catch (error) {
    throw new Error('db delete user:', error)
  } finally {
    await close()
  }
}

// Funzione per popolare il database
async function populateDatabase() {
  await connect()
  const managers = [
    {
      userName: 'fabioc',
      role: 'tm',
      password: '109',
      isAuth: false,
      cinema: 'guidonia',
      id: 'guiman1',
      notification: []
    },
    {
      userName: 'enricor',
      role: 'tm',
      password: '0231',
      isAuth: false,
      cinema: 'moderno',
      id: 'modman1',
      notification: []
    },
    {
      userName: 'stefanias',
      role: 'tm',
      password: '0105',
      isAuth: false,
      cinema: 'napoli',
      id: 'napman1',
      notification: []
    },
    {
      userName: 'donatov',
      role: 'tm',
      password: '0106',
      isAuth: false,
      cinema: 'bari',
      id: 'barman1',
      notification: []
    }
  ]

  // Inserisci i manager nel database (assumendo che dbMan sia l'istanza del database creato)
  for (const manager of managers) {
    await db.put(manager.id, manager)
  }
  await close()
  console.log('Database manager popolato con successo!')
}

//qui ricevo un notyfy e la eleimino dall'arrayt notify del manager
async function deleteThisNotify(args) {
  console.log('managerDB Deleting notify id: ', args)
  const user = await query(args.userName)
  // Cerca la notifica nell'array di notifiche
  const index = user.notification.findIndex((notify) => notify.id === args.notifyId)

  try {
    await connect() // Connessione al database
    // Se trovi la notifica, rimuovila dall'array
    if (index !== -1) {
      user.notification.splice(index, 1)
    } else {
      console.log("Notifica non trovata per l'utente con ID:", args.userName)
      return null // Notifica non trovata
    }

    // Aggiorna l'utente nel database con l'array di notifiche modificato
    await db.put(args.userName, user)

    console.log("Notifica eliminata con successo per l'utente con ID:", args.userName)
    return user.notification // Restituisci l'utente aggiornato
  } catch (error) {
    console.error('Error deleting event:', error)
    throw error // Gestione dell'errore
  } finally {
    await close() // Chiusura della connessione al database
  }
}

//funzione che restituisce un array contenente
//tutti i nomi dei managers
async function getAllManagersName(cinemaValue) {
  console.log('nomi managers')
  await connect()
  const results = []
  // eslint-disable-next-line no-unused-vars
  for await (const [key, value] of db.iterator()) {
    if (value.cinema === cinemaValue) {
      results.push(value.userName)
    }
  }
  console.log("stampo l'array di nomi managers dal gestore del db", results)
  await close()
  return results
}

//funzione che legge e stampa tutto il db
async function readAll() {
  console.log('Database manager letto!')
  await connect()
  const results = []
  for await (const [key, value] of db.iterator()) {
    results.push({ key, value })
  }
  console.log(results)
  await close()
  return results
}

function connect() {
  console.log('Connect with managers')
  return new Promise((resolve, reject) => {
    db.open((err) => {
      if (err) {
        reject(err)
      } else {
        resolve(db)
      }
    })
  })
}

async function insertNewManager(key, value) {
  await connect()
  return new Promise((resolve, reject) => {
    db.put(key, value, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

async function query(key) {
  await connect()
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

function close() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err)
      } else {
        console.log('db managers close')
        resolve()
      }
    })
  })
}

module.exports = {
  createDbUser,
  addNewUser,
  populateDatabase,
  getManagerByCredentials,
  getAllManagersName,
  addNotifyManagers,
  insertNewManager,
  deleteThisNotify,
  getAllManagers,
  deleteThisManager
}
