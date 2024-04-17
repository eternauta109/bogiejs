export const initialUser = {
  managersName: [],
  user: {
    userName: null,
    role: null,
    notification: [],
    password: null,
    isAuth: false,
    id: null,
    cinema: null
  }
}

//aggiunge un manager al db managers
export const addNewUser = async (newUser) => {
  console.log('sono in addNewUser in userReducer e sto mandando quensto nuovo user', newUser)
  if (process.env.NODE_ENV !== 'production') {
    const newArrayNames = ['marap', 'carlos', 'robertod', 'valentinao']
    return newArrayNames
  } else {
    return new Promise((resolve, reject) => {
      const { ipcRenderer } = window.require('electron')
      try {
        ipcRenderer.send('send:newUser', newUser)
        ipcRenderer.on('return:newUser', (e, args) => {
          console.log('userReducer add new user', args)
          resolve(args)
        })
      } catch (error) {
        reject(err)
      }
    })
  }
}

//aggiunge un manager al db managers
export const getAllManagers = async (user) => {
  console.log('sono in getAllManager in userReducer', user)
  if (process.env.NODE_ENV !== 'production') {
    return [
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
        userName: 'robertod',
        role: 'am',
        password: '110',
        isAuth: false,
        cinema: 'guidonia',
        id: 'guiman2',
        notification: []
      },
      {
        userName: 'carlos',
        role: 'am',
        password: '111',
        isAuth: false,
        cinema: 'guidonia',
        id: 'guiman3',
        notification: []
      },
      {
        userName: 'marap',
        role: 'am',
        password: '113',
        isAuth: false,
        cinema: 'guidonia',
        id: 'guiman4',
        notification: []
      },
      {
        userName: 'valentinad',
        role: 'am',
        password: '114',
        isAuth: false,
        cinema: 'guidonia',
        id: 'guiman5',
        notification: []
      },
      {
        userName: 'marap',
        role: 'am',
        password: '113',
        isAuth: false,
        cinema: 'guidonia',
        id: 'guiman4',
        notification: []
      },
      {
        userName: 'valentinad',
        role: 'am',
        password: '114',
        isAuth: false,
        cinema: 'guidonia',
        id: 'guiman5',
        notification: []
      }
    ]
  } else {
    return new Promise((resolve, reject) => {
      const { ipcRenderer } = window.require('electron')
      try {
        ipcRenderer.send('send:getAllManagers', user)
        ipcRenderer.on('return:getAllManagers', (e, args) => {
          console.log('userReducer get all manager', args)
          resolve(args)
        })
      } catch (err) {
        reject(err)
      }
    })
  }
}

//eleimina un manager al db managers
export const deleteManager = async (manager) => {
  console.log('sono in deleteManager in userReducer e sto cancellando', manager)

  if (process.env.NODE_ENV !== 'production') {
    const newArrayNames = ['marap', 'carlos', 'robertod', 'cancellato']
    return newArrayNames
  } else {
    return new Promise((resolve, reject) => {
      const { ipcRenderer } = window.require('electron')
      try {
        ipcRenderer.send('send:deleteManager', manager)
        ipcRenderer.on('return:deleteManager', (e, args) => {
          console.log('userReducer delete  user', args)
          resolve(args)
        })
      } catch (err) {
        reject(err)
      }
    })
  }
}

//funzione che va gestire la cancellazione di una notifica dall array notify
// nel db managers
export const deleteNotifyFromDb = async (notifyId, userName) => {
  console.log('sono in userReducer e sto cancelladno una notifica', notifyId, userName)
  if (process.env.NODE_ENV === 'development') {
    return [{ notify: 'ritorno', see: true, id: 'id di ritorno' }]
  } else {
    return new Promise((resolve, reject) => {
      const { ipcRenderer } = window.require('electron')
      try {
        ipcRenderer.send('send:notifyToDelete', { notifyId, userName })
        ipcRenderer.on('return:notifyToDelete', (e, args) => {
          console.log('return:notifyToDelete da user reducers', args)
          resolve(args)
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}

//funzione che restiruisce un oggetto manager/user con tutti i nomi dei colleghi
// se si è in produzione eseguo icp per restituire i valori da db managers.
//Altrimenti restituisco oggetto di default
export const loginUser = async (userName, password) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('login user function mod dev', userName, password)
    // Simulazione autenticazione in modalità di sviluppo
    const eventoFittizio = {
      user: {
        userName: 'fabioc',
        password: '109',
        isAuth: true,
        role: 'tm',
        cinema: 'guidonia',
        notification: [
          {
            notify: `uno ha creato un nuovo un coso con titolo stocazzo `,
            see: false,
            id: 'obj1'
          },
          {
            notify: `uno ha creato un nuovo un coso con titolo stocazzo `,
            see: false,
            id: 'obj2'
          },
          {
            notify: `uno ha creato un nuovo un coso con titolo stocazzo `,
            see: false,
            id: 'obj1'
          },
          {
            notify: `uno ha creato un nuovo un coso con titolo stocazzo `,
            see: false,
            id: 'obj2'
          },
          {
            notify: `uno ha creato un nuovo un coso con titolo stocazzo `,
            see: false,
            id: 'obj1'
          },
          {
            notify: `uno ha creato un nuovo un coso con titolo stocazzo `,
            see: false,
            id: 'obj2'
          },
          {
            notify: `uno ha creato un nuovo un coso con titolo stocazzo `,
            see: false,
            id: 'obj1'
          },
          {
            notify: `uno ha creato un nuovo un coso con titolo stocazzo `,
            see: false,
            id: 'obj2'
          },
          {
            notify: `uno ha creato un nuovo un coso con titolo stocazzo `,
            see: false,
            id: 'obj1'
          },
          {
            notify: `uno ha creato un nuovo un coso con titolo stocazzo `,
            see: false,
            id: 'obj2'
          },
          {
            notify: `uno ha creato un nuovo un coso con titolo stocazzo `,
            see: false,
            id: 'obj1'
          },
          {
            notify: `uno ha creato un nuovo un coso con titolo stocazzo `,
            see: false,
            id: 'obj2'
          }
        ],
        id: 'guiman1'
      },
      managersName: ['fabioc', 'robertodTest', 'carlosTest', 'marapTest', 'valentinaoTest']
    }
    console.log('fake user from userLogin in dev mode...', eventoFittizio)
    return eventoFittizio
  } else if (window.require) {
    // Autenticazione tramite ipcRenderer in modalità di produzione
    const { ipcRenderer } = window.require('electron')
    return new Promise((resolve, reject) => {
      try {
        console.log('User nam e e pawss:', userName, password)
        ipcRenderer.send('login', { userName, password })
        ipcRenderer.on('returnManager', (event, args) => {
          if (args) {
            const manager = { ...args.managerFound, isAuth: true }
            console.log('ipc userReducer ritorna..', manager)

            resolve({ user: manager, managersName: args.managersName })
          } else {
            console.log('Credenziali non corrette')
            reject(new Error('Credenziali non corrette'))
          }
        })
      } catch (error) {
        console.error('Errore durante il login:', error)
        reject(error)
      }
    })
  }
}

const userReducer = (state, action) => {
  const { userName, password } = action.payload
  console.log('userReducer action.paylod', action.payload)
  switch (action.type) {
    case 'SET_USER':
      return {
        user: { ...action.payload.managerFound },
        managersName: [...action.payload.managersName]
      }
    case 'SET_NAMES':
      return {
        ...state,
        managersName: action.payload
      }
    case 'SET_NOTIFICATION':
      console.log('SET_NOTIFICATION', action.payload)

      return {
        ...state,
        user: { ...state.user, notification: [...action.payload] }
      }
    default:
      throw new Error(`Azione non gestita: ${action.type}`)
  }
}

export default userReducer
