// src/store/reducers/suppliesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// AsyncThunk per recuperare le supplies dal database (supponiamo che tu abbia già fetchSupplies configurato correttamente)
export const fetchSupplies = createAsyncThunk('supplies/fetchSupplies', async (_, thunkAPI) => {
  try {
    const supplies = await window.api.getSuppliesFromDB() // Assumi che questa chiamata recuperi le supplies da LevelDB

    return supplies
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.message })
  }
})

// Thunk per aggiornare un prodotto in LevelDB
export const updateSupplyInDB = createAsyncThunk(
  'products/updateSupplyInDB',
  async (supply, thunkAPI) => {
    try {
      await window.api.updateSupplyInDB(supply) // Assumiamo che window.api.updateProductInDB(product) aggiorni il prodotto in LevelDB

      return supply
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message })
    }
  }
)

// Thunk per eliminare un prodotto da LevelDB
export const deleteSupplyFromDB = createAsyncThunk(
  'products/deleteSupplyFromDB',
  async (idSupply, thunkAPI) => {
    try {
      await window.api.deleteSupplyFromDB(idSupply) // Assumiamo che window.api.deleteProductFromDB(productId) elimini il prodotto da LevelDB
      return idSupply
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message })
    }
  }
)
// AsyncThunk per aggiungere una supply al database
export const addSupplyToDB = createAsyncThunk(
  'supplies/addSupplyToDB',
  async (supply, thunkAPI) => {
    console.log('supply in supplies slices:', supply)
    try {
      await window.api.addSupplyToDB(supply) // Assumi che questa chiamata salvi la supply su LevelDB
      return supply
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message })
    }
  }
)

const suppliesSlice = createSlice({
  name: 'supplies',
  initialState: {
    supplies: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Supplies
      .addCase(fetchSupplies.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSupplies.fulfilled, (state, action) => {
        state.loading = false
        state.supplies = action.payload
        console.log('fetchSupplies', Array.from(state.supplies))
      })
      .addCase(fetchSupplies.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.error
      })

      // Add Supply
      .addCase(addSupplyToDB.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addSupplyToDB.fulfilled, (state, action) => {
        state.loading = false
        state.supplies.push(action.payload) // Aggiungi la nuova supply allo stato
      })
      .addCase(addSupplyToDB.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.error
      })

      //upDatesupply
      .addCase(updateSupplyInDB.fulfilled, (state, action) => {
        const index = state.supplies.findIndex(
          (supply) => (
            console.log('supplyyyy', supply), supply.supplyId === action.payload.supplyId
          )
        )
        if (index !== -1) {
          console.log('aggiorno singolo index di supplies', index)
          state.supplies[index] = action.payload
        }
      })

      //delete supply
      .addCase(deleteSupplyFromDB.fulfilled, (state, action) => {
        state.supplies = state.supplies.filter((supply) => supply.supplyId !== action.payload)
      })
  }
})

// Non esportiamo più le azioni sincronizzate di addSupply poiché ora gestiamo `addSupplyToDB` come async
export default suppliesSlice.reducer
