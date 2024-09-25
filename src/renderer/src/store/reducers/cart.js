// src/store/reducers/cart.js
import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const existingProduct = state.find((item) => item.id === action.payload.id)
      if (existingProduct) {
        existingProduct.quantity += 1
      } else {
        state.push({ ...action.payload, quantity: 1 })
      }
    },
    removeFromCart: (state, action) => {
      return state.filter((item) => item.id !== action.payload)
    },
    updateQuantity: (state, action) => {
      const product = state.find((item) => item.id === action.payload.productId)
      if (product) {
        product.quantity = action.payload.quantity
      }
    },
    clearCart: () => {
      return []
    }
  }
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
