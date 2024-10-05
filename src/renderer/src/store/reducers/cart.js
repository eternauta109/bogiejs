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
      // Arrotonda a due decimali il prezzo del prodotto prima di aggiungerlo al totale
      const prezzoArrotondato = Math.round((action.payload.prezzo + Number.EPSILON) * 100) / 100
      // Aggiunge il prezzo arrotondato al totale
      state.total += prezzoArrotondato

      // Arrotonda anche il totale a due decimali dopo l'aggiornamento
      state.total = Math.round((state.total + Number.EPSILON) * 100) / 100

      console.log('total nello state e type', state.total, typeof state.total)
    },
    removeItem: (state, action) => {
      const index = state.items.findIndex((item) => item.salesId === action.payload)
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
