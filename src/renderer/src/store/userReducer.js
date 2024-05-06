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

const userReducer = (state, action) => {
  console.log('userReducer action.paylod', action.payload)
  switch (action.type) {
    case 'SET_USER':
      return {
        user: { ...action.payload.managerFound },
        managersName: [...action.payload.managersName]
      }
    case 'LOG_OUT':
      return {
        ...initialUser
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
