// src/store/reducers/shows.js
import { createSlice } from '@reduxjs/toolkit'

const showsSlice = createSlice({
  name: 'shows',
  initialState: {
    selectedShows: []
  },
  reducers: {
    addSelectedShows: (state, action) => {
      state.selectedShows = action.payload
    }
  }
})

export const { addSelectedShows } = showsSlice.actions
export default showsSlice.reducer
