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
      state.totalCash += action.payload
      state.totalSales += action.payload
      console.log('sales slice contanti tot:', state.totalCash)
      console.log('sales slicetot:', state.totalSales)
    },
    addCardSale: (state, action) => {
      state.totalCard += action.payload
      state.totalSales += action.payload
      console.log('sales slice contanti tot:', state.totalCard)
      console.log('sales slicetot:', state.totalSales)
    }
  }
})

export const { addCashSale, addCardSale } = salesSlice.actions
export default salesSlice.reducer
