// src/store/reducers/transactionssSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// AsyncThunk per recuperare le transactions dal database (supponiamo che tu abbia già fetchTransactions configurato correttamente)
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (_, thunkAPI) => {
    try {
      const transactions = await window.api.getTransactionsFromDB() // Assumi che questa chiamata recuperi le transactionss da LevelDB

      return transactions
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message })
    }
  }
)

// Thunk per aggiornare un prodotto in LevelDB
export const updateTransactionInDB = createAsyncThunk(
  'transactions/updateTransactionInDB',
  async (transaction, thunkAPI) => {
    try {
      await window.api.updateTransactionInDB(transaction) // Assumiamo che window.api.updateProductInDB(product) aggiorni il prodotto in LevelDB

      return transaction
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message })
    }
  }
)

// Thunk per eliminare un prodotto da LevelDB
export const deleteTransactionFromDB = createAsyncThunk(
  'transactions/deleteTransactionFromDB',
  async (idTransaction, thunkAPI) => {
    try {
      await window.api.deleteTransactionFromDB(idTransaction) // Assumiamo che window.api.deleteProductFromDB(productId) elimini il prodotto da LevelDB
      return idTransaction
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message })
    }
  }
)
// AsyncThunk per aggiungere una transaction al database
export const addTransactionToDB = createAsyncThunk(
  'transactions/addTransactionToDB',
  async (transaction, thunkAPI) => {
    console.log('transaction in transactions slices:', transaction)
    try {
      await window.api.addTransactionToDB(transaction) // Assumi che questa chiamata salvi la transaction su LevelDB
      return transaction
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message })
    }
  }
)

// AsyncThunk per raccoglio le transazioni by date
export const fetchTransactionsByDate = createAsyncThunk(
  'transactions/fetchTransactionsByDate',
  async (date, thunkAPI) => {
    console.log('date in store', date)
    try {
      const transactions = await window.api.getTransactionsByDate(date)
      console.log('return transa in store', transactions)
      return transactions
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message })
    }
  }
)

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactions: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false

        state.transactions = action.payload
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.error
      })

      // Fetch Transactions by date
      .addCase(fetchTransactionsByDate.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactionsByDate.fulfilled, (state, action) => {
        state.loading = false

        state.transactions = action.payload
      })
      .addCase(fetchTransactionsByDate.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.error
      })

      // Add Transaction
      .addCase(addTransactionToDB.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addTransactionToDB.fulfilled, (state, action) => {
        state.loading = false
        state.transactions = [...state.transactions, ...action.payload] // Aggiungi la nuova transaction allo stato
      })
      .addCase(addTransactionToDB.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.error
      })

      //upDatetransaction
      .addCase(updateTransactionInDB.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(
          (transaction) => transaction.transactionId === action.payload.transactionId
        )
        if (index !== -1) {
          state.transactions[index] = action.payload
        }
      })

      //delete transaction
      .addCase(deleteTransactionFromDB.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (transaction) => transaction.transactionId !== action.payload
        )
      })
  }
})

// Non esportiamo più le azioni sincronizzate di addTransaction poiché ora gestiamo `addTransactionToDB` come async
export default transactionsSlice.reducer
