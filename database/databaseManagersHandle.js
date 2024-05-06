const { Level } = require('level')
const path = require('path')
const fs = require('fs')

const dbName = 'managers'

const { app } = require('electron')
const isBuild = process.env.NODE_ENV === 'production'
const dbPath = path.join(isBuild ? __dirname : app.getAppPath(), `../db/${dbName}`)

/* const dbPath = path.join(dbPathFolder, `${dbName}`) */

const db = new Level(dbPath, { valueEncoding: 'json' })

//funzione per cercare e restituire il manager con crede
//credenziali corrette
async function getManagerByCredentials(userName, password) {
  console.log('ricevo in db query user pass', userName, password, dbPath)
  await connect()
  let managerFound = null
  let managersName = null

  try {
    for await (const [, value] of db.iterator()) {
      const manager = value

      if (manager.userName === userName && manager.password === password) {
        //restituisco l'user senza password
        // eslint-disable-next-line no-unused-vars
        const { password, ...managerWithoutPassword } = manager
        managerFound = { ...managerWithoutPassword, isAuth: true }
        managersName = await getAllManagersName(managerFound)
        console.log('risultato accesso:', managerFound, managersName)
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
async function createDbUser() {
  fs.access(dbPath, fs.constants.F_OK, async (err) => {
    if (err) {
      console.log('db managers non esistente, lo creo')

      await connect()
      try {
        await populateDatabase()
        return dbPath
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('db managers esistente')
    }
  })
}

//funzione che restituisce tutto i manager che appartengono al determinato cinema
async function getAllManagers(user) {
  const allManagers = []
  console.log('prendo tutti i colleghi di :', user)
  try {
    await connect()
    for await (const [, value] of db.iterator()) {
      if (user.user.cinema === value.cinema) {
        allManagers.push(value)
      }
    }
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
    console.log('manager inserito correttamente ritorno questo:')
    return [...managersName]
  } catch (error) {
    throw new Error('addnew user:', error)
  } finally {
    await close()
  }
}

//funzione che itera il db e aggiunge una notifica differenziando
//tra area manager e altri ruoli
async function iteratorForAddNotify(obj, newNotify) {
  await connect()

  try {
    for await (const [key, value] of db.iterator()) {
      let shouldAddNotification = false

      switch (obj.role) {
        case 'areamanager':
          shouldAddNotification = obj.createdBy !== value.userName && obj.area === value.area
          break
        case 'tm':
          shouldAddNotification =
            (obj.createdBy !== value.userName &&
              obj.area === value.area &&
              value.role === 'areamanager') ||
            (obj.createdBy !== value.userName && obj.cinema === value.cinema)
          break
        default:
          shouldAddNotification = obj.createdBy !== value.userName && obj.cinema === value.cinema
          break
      }

      if (shouldAddNotification) {
        console.log('Inserisco nuova notifica per', value.userName)

        // Aggiungi la nuova notifica per il manager corrente
        value.notification.push(newNotify)

        // Aggiorna il manager nel database
        await db.put(key, value)
      }
    }
  } catch (error) {
    console.log("Errore nell'inserimento della nuova notifica:", error)
  } finally {
    await close()
  }
}

//funzione che aggiunge una notifica nel db managers
async function addNotifyManagers({ typeNotify, obj }) {
  console.log('sono nel db managers e sto inserendo una notifica')
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
  // Aggiungi la notifica in base al discriminatore
  console.log('managerdb: addNotify: oggetto new notify', newNotify)
  await iteratorForAddNotify(obj, newNotify, 'default')
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
      area: 'area4',
      password: '109',
      isAuth: false,
      cinema: 'guidonia',
      id: 'guiman1',
      notification: []
    },
    {
      userName: 'fabios',
      role: 'tm',
      area: 'area4',
      password: '109',
      isAuth: false,
      cinema: 'parco',
      id: 'magman1',
      notification: []
    },
    {
      userName: 'agostinol',
      role: 'tm',
      area: 'area4',
      password: '109',
      isAuth: false,
      cinema: 'catania',
      id: 'catman1',
      notification: []
    },
    {
      userName: 'marion',
      role: 'areamanager',
      area: 'area4',
      password: '1001',
      isAuth: false,
      cinema: 'area4',
      id: 'area4',
      notification: []
    },
    {
      userName: 'enricor',
      role: 'tm',
      area: 'area4',
      password: '0231',
      isAuth: false,
      cinema: 'moderno',
      id: 'modman1',
      notification: []
    },
    {
      userName: 'stefanias',
      role: 'tm',
      area: 'area4',
      password: '0105',
      isAuth: false,
      cinema: 'napoli',
      id: 'napman1',
      notification: []
    },
    {
      userName: 'donatov',
      role: 'tm',
      area: 'area4',
      password: '0106',
      isAuth: false,
      cinema: 'bari',
      id: 'barman1',
      notification: []
    }
  ]

  // Inserisci i manager nel database (assumendo che dbMan sia l'istanza del database creato)
  try {
    for (const manager of managers) {
      await db.put(manager.id, manager)
    }
    console.log('Database manager popolato con successo!')
  } catch (error) {
    throw new Error('databaseManager: populateDB: error:'.error)
  } finally {
    await close()
  }
}

//qui ricevo un notyfy e la eleimino dall'array notify del manager
async function deleteThisNotify(args) {
  console.log('managerDB Deleting notify id: ', args)
  const user = await query(args.userId)
  // Cerca la notifica nell'array di notifiche
  const index = user.notification.findIndex((notify) => notify.id === args.notifyId)

  try {
    await connect() // Connessione al database
    // Se trovi la notifica, rimuovila dall'array
    if (index !== -1) {
      user.notification.splice(index, 1)
    } else {
      console.log("Notifica non trovata per l'utente con ID:", args.userId)
      return null // Notifica non trovata
    }

    // Aggiorna l'utente nel database con l'array di notifiche modificato
    await db.put(args.userId, user)

    console.log("Notifica eliminata con successo per l'utente con ID:", args.userName)
    return user.notification // Restituisci l'utente aggiornato
  } catch (error) {
    console.error('Error deleting event:', error)
    throw error // Gestione dell'errore
  } finally {
    await close() // Chiusura della connessione al database
  }
}

//funzione per restituire i nomi dei colleghi in base al ruolo dell'utente loggato.
//discriminator puo essere areamanager o am,tm,ti, etc
async function iteratorForManagersName(manager) {
  let results = []
  console.log(`prendo i nomi dei colleghi di  ${manager.userName} `)
  await connect()

  try {
    for await (const [, value] of db.iterator()) {
      let shouldAddManagerName = false

      switch (manager.role) {
        case 'areamanager':
          shouldAddManagerName = manager.area === value.area
          break

        default:
          shouldAddManagerName = manager.cinema === value.cinema
          break
      }
      if (shouldAddManagerName) {
        results.push(value.userName)
      }
    }
    console.log("stampo l'array di nomi managers da getAllManagersName", results)
    return results
  } catch (error) {
    throw new Error(
      `errore in get all managers name in managerDB se l'user loggato è ${manager.role}`,
      error
    )
  }
}

//funzione che restituisce un array contenente
//tutti i nomi dei managers
async function getAllManagersName(manager) {
  /* console.log('get all manager user:', manager) */

  try {
    const nomiColleghi = await iteratorForManagersName(manager)
    return nomiColleghi
  } catch (error) {
    throw new Error('getAllManagersName:', error)
  } finally {
    await close()
  }
}

//funzione che legge e stampa tutto il db
// eslint-disable-next-line no-unused-vars
async function readAll() {
  try {
    await connect()
    console.log('Database manager letto!')
    const results = []
    for await (const [key, value] of db.iterator()) {
      results.push({ key, value })
    }
    return results
  } catch (error) {
    throw new Error('readAll:', error)
  } finally {
    await close()
  }
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
//funzione che connette al db
function connect() {
  return new Promise((resolve, reject) => {
    db.open((err) => {
      if (err) {
        reject(err)
      } else {
        console.log('db manager open')
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
        console.log('db manager close')
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
