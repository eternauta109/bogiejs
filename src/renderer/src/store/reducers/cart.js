// src/store/reducers/cartSlice.js
import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0
  },
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload)
      state.total += action.payload.prezzo
    },
    removeItem: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload)
      if (index !== -1) {
        state.total -= state.items[index].prezzo
        state.items.splice(index, 1)
      }
    },
    clearCart: (state) => {
      state.items = []
      state.total = 0
    }
  }
})

export const { addItem, removeItem, clearCart } = cartSlice.actions
export default cartSlice.reducer
