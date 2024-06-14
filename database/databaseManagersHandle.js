/* eslint-disable no-unused-vars */
const { Level } = require('level')
const path = require('path')
const fs = require('fs').promises
const fsConstants = require('fs').constants
const { app } = require('electron')

const dbName = 'managers'
const isBuild = process.env.NODE_ENV === 'production'
const dbPath = path.join(isBuild ? __dirname : app.getAppPath(), `../db/${dbName}`)

let db

async function createDbUser() {
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

async function getManagerByCredentials(userName, password) {
  await createDbUser() // Ensure DB is created
  await connect()
  try {
    for await (const [, manager] of db.iterator()) {
      if (manager.userName === userName && manager.password === password) {
        const { password, ...managerWithoutPassword } = manager
        const managersName = await getAllManagersName(managerWithoutPassword)
        return { managerFound: { ...managerWithoutPassword, isAuth: true }, managersName }
      }
    }
    return { managerFound: { isAuth: false }, managersName: [] }
  } catch (error) {
    console.error('Error fetching manager by credentials:', error)
    throw error
  } finally {
    await close()
  }
}

async function getAllManagers(user) {
  await createDbUser() // Ensure DB is created
  const allManagers = []
  await connect()
  try {
    for await (const [, value] of db.iterator()) {
      if (user.user.cinema === value.cinema) {
        allManagers.push(value)
      }
    }
  } catch (error) {
    console.error('Error fetching all managers:', error)
  } finally {
    await close()
  }
  return allManagers
}

async function addNewUser(newUser) {
  await createDbUser() // Ensure DB is created
  await connect()
  try {
    await db.put(newUser.id, newUser)
    const managersName = await getAllManagersName(newUser)
    return [...managersName]
  } catch (error) {
    console.error('Error adding new user:', error)
    throw error
  } finally {
    await close()
  }
}

async function iteratorForAddNotify(obj, newNotify) {
  await createDbUser() // Ensure DB is created
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
        value.notification.push(newNotify)
        await db.put(key, value)
      }
    }
  } catch (error) {
    console.error('Error adding notification:', error)
  } finally {
    await close()
  }
}

async function addNotifyManagers({ typeNotify, obj }) {
  let newNotify
  if (typeNotify === 'topic' && obj.topicArgument !== '') {
    newNotify = {
      notify: `${obj.createdBy} ha creato un nuovo ${typeNotify} con titolo ${obj.topicArgument}`,
      see: true,
      id: obj.id
    }
  } else {
    newNotify = {
      notify: `${obj.createdBy} ha creato un nuovo ${typeNotify} con titolo ${obj.title}`,
      see: true,
      id: obj.id
    }
  }
  await iteratorForAddNotify(obj, newNotify)
}

async function deleteThisManager(user) {
  await createDbUser() // Ensure DB is created
  await connect()
  try {
    await db.del(user.id)
    const managersName = await getAllManagersName(user)
    return [...managersName]
  } catch (error) {
    console.error('Error deleting manager:', error)
    throw error
  } finally {
    await close()
  }
}

async function populateDatabase() {
  await connect()

  try {
    for (const manager of managers) {
      await db.put(manager.id, manager)
    }
    console.log('Database manager popolato con successo!')
  } catch (error) {
    console.error('Error populating database:', error)
    throw error
  } finally {
    await close()
  }
}

async function deleteThisNotify(args) {
  await createDbUser() // Ensure DB is created
  const user = await query(args.userId)
  const index = user.notification.findIndex((notify) => notify.id === args.notifyId)
  await connect()
  try {
    if (index !== -1) {
      user.notification.splice(index, 1)
      await db.put(args.userId, user)
      return user.notification
    } else {
      console.log('Notification not found for user ID:', args.userId)
      return null
    }
  } catch (error) {
    console.error('Error deleting notification:', error)
    throw error
  } finally {
    await close()
  }
}

async function iteratorForManagersName(manager) {
  await createDbUser() // Ensure DB is created
  const results = []

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
    return results
  } catch (error) {
    console.error('Error fetching manager names:', error)
    throw error
  } finally {
    await close()
  }
}

async function getAllManagersName(manager) {
  await createDbUser() // Ensure DB is created
  try {
    const nomiColleghi = await iteratorForManagersName(manager)
    return nomiColleghi
  } catch (error) {
    console.error('Error getting all manager names:', error)
    throw error
  }
}

async function insertNewManager(key, value) {
  await createDbUser() // Ensure DB is created
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
  await createDbUser() // Ensure DB is created
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

function connect() {
  return new Promise((resolve, reject) => {
    db = new Level(dbPath, { valueEncoding: 'json' })
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

const managers = [
  {
    userName: 'fabioc',
    role: 'tm',
    area: 'area4',
    password: '109',
    isAuth: false,
    cinema: 'guidonia',
    id: 'guiman1',
    notification: [],
    messages: []
  },
  {
    userName: 'fabios',
    role: 'tm',
    area: 'area4',
    password: '109',
    isAuth: false,
    cinema: 'parco',
    id: 'magman1',
    notification: [],
    messages: []
  },
  {
    userName: 'agostinol',
    role: 'tm',
    area: 'area4',
    password: '109',
    isAuth: false,
    cinema: 'catania',
    id: 'catman1',
    notification: [],
    messages: []
  },
  {
    userName: 'enricor',
    role: 'tm',
    area: 'area4',
    password: '0231',
    isAuth: false,
    cinema: 'moderno',
    id: 'modman1',
    notification: [],
    messages: []
  },
  {
    userName: 'stefanias',
    role: 'tm',
    area: 'area4',
    password: '0105',
    isAuth: false,
    cinema: 'napoli',
    id: 'napman1',
    notification: [],
    messages: []
  },
  {
    userName: 'donatov',
    role: 'tm',
    area: 'area4',
    password: '0106',
    isAuth: false,
    cinema: 'bari',
    id: 'barman1',
    notification: [],
    messages: []
  }
]
