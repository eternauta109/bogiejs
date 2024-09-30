// src/store/index.js
// src/store/index.js
import { configureStore } from '@reduxjs/toolkit'
import managersReducer from './reducers/managers'
import productsReducer from './reducers/products'
import suppliesReducer from './reducers/supplies'
import cartReducer from './reducers/cart'
import showsReducer from './reducers/shows'
import salesReducer from './reducers/sales'

// Configura lo store utilizzando configureStore
const store = configureStore({
  reducer: {
    managers: managersReducer,
    products: productsReducer,
    supplies: suppliesReducer,
    cart: cartReducer,
    shows: showsReducer,
    sales: salesReducer
  }
})

export default store
