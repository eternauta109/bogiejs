// src/store/reducers/supplies.js
import { createSlice } from '@reduxjs/toolkit'

const suppliesSlice = createSlice({
  name: 'supplies',
  initialState: [],
  reducers: {
    addSupply: (state, action) => {
      state.push(action.payload)
    },
    setSupplies: (state, action) => {
      return action.payload
    }
  }
})

export const { addSupply, setSupplies } = suppliesSlice.actions
export default suppliesSlice.reducer
