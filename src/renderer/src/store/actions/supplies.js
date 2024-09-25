// src/store/actions/supplies.js
import { ADD_SUPPLY, SET_SUPPLIES } from '../types'

export const addSupply = (supply) => ({
  type: ADD_SUPPLY,
  payload: supply
})

export const setSupplies = (supplies) => ({
  type: SET_SUPPLIES,
  payload: supplies
})
