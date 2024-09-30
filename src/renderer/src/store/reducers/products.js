// src/store/reducers/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Thunk per caricare i prodotti da LevelDB
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, thunkAPI) => {
  try {
    const { allProducts, totalProduct } = await window.api.getProductsFromDB() // Assumiamo che window.api.getProductsFromDB() recuperi i prodotti da LevelDB
    console.log('prod in slice', allProducts, totalProduct)
    return { allProducts, totalProduct }
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
      await window.api.updateProductInDB(product) // Assumiamo che window.api.updateProductInDB(product) aggiorni il prodotto in LevelDB

      return product
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
    totalProduct: 0,
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
        state.products = action.payload.allProducts
        state.totalProduct = action.payload.totalProduct + 1
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
        state.totalProduct = +1
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
        console.log(state.products)
        state.loading = false
        const index = state.products.findIndex(
          (product) => product.idProduct === action.payload.idProduct
        )

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
        state.products = state.products.filter((product) => product.idProduct !== action.payload)
      })
      .addCase(deleteProductFromDB.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.error
      })
  }
})

export default productsSlice.reducer
