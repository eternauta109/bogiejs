// src/store/reducers/salesSlice.js
import { createSlice } from '@reduxjs/toolkit'

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    totalSales: 0,
    totalCash: 0,
    totalCard: 0
  },
  reducers: {
    addCashSale: (state, action) => {
      // Arrotonda a due decimali il prezzo del prodotto prima di aggiungerlo al totale
      console.log('accc', action.payload)
      const prezzoArrotondato = Math.round((action.payload + Number.EPSILON) * 100) / 100
      // Aggiunge il prezzo arrotondato al totale

      state.totalCash += prezzoArrotondato
      state.totalSales += prezzoArrotondato
      // Arrotonda anche il totale a due decimali dopo l'aggiornamento
      state.totalCash = Math.round((state.totalCash + Number.EPSILON) * 100) / 100
      state.totalSales = Math.round((state.totalSales + Number.EPSILON) * 100) / 100
      // Stampa i risultati arrotondati
      console.log('totalCash nello state:', state.totalCash, typeof state.totalCash)
      console.log('totalSales nello state:', state.totalSales, typeof state.totalSales)
    },
    addCardSale: (state, action) => {
      // Arrotonda a due decimali il prezzo del prodotto prima di aggiungerlo al totale
      const prezzoArrotondato = Math.round((action.payload + Number.EPSILON) * 100) / 100
      // Aggiunge il prezzo arrotondato al totale

      state.totalCard += prezzoArrotondato
      state.totalSales += prezzoArrotondato
      // Arrotonda anche il totale a due decimali dopo l'aggiornamento
      state.totalCard = Math.round((state.totalCard + Number.EPSILON) * 100) / 100
      state.totalSales = Math.round((state.totalSales + Number.EPSILON) * 100) / 100
      // Stampa i risultati arrotondati
      console.log('totalCash nello state:', state.totalCard, typeof state.totalCash)
      console.log('totalSales nello state:', state.totalSales, typeof state.totalSales)
    },
    resetSales: (state) => {
      state.totalCash = 0
      state.totalCard = 0
      state.totalSales = 0
    }
  }
})

export const { addCashSale, addCardSale, resetSales } = salesSlice.actions
export default salesSlice.reducer
