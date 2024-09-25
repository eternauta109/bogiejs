// src/store/reducers/managers.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { act } from 'react'

// Definizione di un'azione asincrona per effettuare il login
export const loginUser = createAsyncThunk('managers/loginUser', async (credentials, thunkAPI) => {
  try {
    const { managerFound, managersName } = await window.api.login(credentials)
    // Restituisce i dati che verranno aggiunti allo stato da extraReducers

    return { managerFound, managersName }
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
    addManager: (state, action) => {
      state.managers.push(action.payload)
    },
    setManagers: (state, action) => {
      state.managers = action.payload
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
        state.managers = action.payload.managersName
        state.user = action.payload.managerFound // Imposta user con managerFound dal payload
        console.log('connect to db successful:', action.payload)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.error
        console.error('Login failed:', action.payload.error)
      })
  }
})

// Esportiamo le azioni sincronizzate
export const { addManager, setManagers } = managersSlice.actions

// Esportiamo il reducer
export default managersSlice.reducer
