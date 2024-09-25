// src/store/actions/cart.js
import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_QUANTITY, CLEAR_CART } from '../types'

export const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product
})

export const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: productId
})

export const updateQuantity = (productId, quantity) => ({
  type: UPDATE_QUANTITY,
  payload: { productId, quantity }
})

export const clearCart = () => ({
  type: CLEAR_CART
})
