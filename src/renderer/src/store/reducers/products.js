// src/store/reducers/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Thunk per caricare i prodotti da LevelDB
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, thunkAPI) => {
  try {
    const products = await window.api.getProductsFromDB() // Assumiamo che window.api.getProductsFromDB() recuperi i prodotti da LevelDB
    console.log('prod in slice', products)
    return products
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.message })
  }
})

// Thunk per aggiungere un prodotto a LevelDB
export const addProductToDB = createAsyncThunk(
  'products/addProductToDB',
  async (product, thunkAPI) => {
    console.log('addProductsToDb:', product)
    try {
      await window.api.addProductToDB(product) // Assumiamo che window.api.addProductToDB(product) aggiunga il prodotto a LevelDB
      return product
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message })
    }
  }
)

// Thunk per aggiornare un prodotto in LevelDB
export const updateProductInDB = createAsyncThunk(
  'products/updateProductInDB',
  async (product, thunkAPI) => {
    try {
      const updatedProduct = await window.api.updateProductInDB(product) // Assumiamo che window.api.updateProductInDB(product) aggiorni il prodotto in LevelDB
      return updatedProduct
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message })
    }
  }
)

// Thunk per eliminare un prodotto da LevelDB
export const deleteProductFromDB = createAsyncThunk(
  'products/deleteProductFromDB',
  async (productId, thunkAPI) => {
    try {
      await window.api.deleteProductFromDB(productId) // Assumiamo che window.api.deleteProductFromDB(productId) elimini il prodotto da LevelDB
      return productId
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message })
    }
  }
)

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.error
      })

      // Add product
      .addCase(addProductToDB.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addProductToDB.fulfilled, (state, action) => {
        state.loading = false
        state.products.push(action.payload)
      })
      .addCase(addProductToDB.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.error
      })

      // Update product
      .addCase(updateProductInDB.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProductInDB.fulfilled, (state, action) => {
        state.loading = false
        const index = state.products.findIndex((product) => product.id === action.payload.id)
        if (index !== -1) {
          state.products[index] = action.payload
        }
      })
      .addCase(updateProductInDB.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.error
      })

      // Delete product
      .addCase(deleteProductFromDB.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteProductFromDB.fulfilled, (state, action) => {
        state.loading = false
        state.products = state.products.filter((product) => product.id !== action.payload)
      })
      .addCase(deleteProductFromDB.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.error
      })
  }
})

export default productsSlice.reducer
