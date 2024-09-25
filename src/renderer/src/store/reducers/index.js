// src/store/reducers/index.js
import { combineReducers } from 'redux'
import managersReducer from './managers'
import productsReducer from './products'
import suppliesReducer from './supplies'
import cartReducer from './cart'

const rootReducer = combineReducers({
  managers: managersReducer,
  products: productsReducer,
  supplies: suppliesReducer,
  cart: cartReducer
})

export default rootReducer
