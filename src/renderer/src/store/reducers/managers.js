// src/store/reducers/managers.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Definizione di un'azione asincrona per effettuare il login
export const loginUser = createAsyncThunk('managers/loginUser', async (credentials, thunkAPI) => {
  try {
    const { managerFound, managersName } = await window.api.login(credentials)
    // Restituisce i dati che verranno aggiunti allo stato da extraReducers

    return { managerFound, managersName }
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.message, code: error.code })
  }
})

// Definizione di un'azione asincrona per registrare un nuovo user
export const registerUser = createAsyncThunk('managers/registerUser', async (user, thunkAPI) => {
  console.log('register user reducer:', user)
  try {
    await window.api.addNewUser(user)
    return user
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.message })
  }
})

// Definizione di un'azione asincrona per cancellare un user
export const deleteUser = createAsyncThunk('managers/deleteUser', async (userId, thunkAPI) => {
  console.log('register user reducer:', userId)
  try {
    await window.api.deleteThisManager(userId)
    return userId
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.message })
  }
})

// Thunk per caricare gli users da LevelDB
export const fetchUsers = createAsyncThunk('managers/fetchUsers', async (user, thunkAPI) => {
  try {
    const usersList = await window.api.getUsersFromDB(user) // Assumiamo che window.api.getProductsFromDB() recuperi i prodotti da LevelDB
    if (!Array.isArray(usersList)) {
      return [] // Assicura che sia sempre un array
    }
    console.log('manager list', usersList)
    return usersList
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.message })
  }
})

const managersSlice = createSlice({
  name: 'managers',
  initialState: {
    managers: [],
    user: null,
    loading: false,
    error: null
  },
  reducers: {
    logOut: (state) => {
      state.user = null
      state.managers = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        // Inserisci i dati restituiti da loginUser

        state.user = action.payload.managerFound // Imposta user con managerFound dal payload
        console.log('connect to db successful:', action.payload)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.error
        console.error('Login failed:', action.payload.error)
      })
      //register user
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.managers.push(action.payload)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.error
        console.error('register user fail:', action.payload.error)
      })

      //fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.managers = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.error
      })

      //delete users
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false
        state.managers = state.managers.filter((manager) => manager.id !== action.payload)
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.error
      })
  }
})

// Esportiamo le azioni sincronizzate
export const { logOut } = managersSlice.actions
// Esportiamo il reducer
export default managersSlice.reducer
