// src/store/actions/managers.js
import { ADD_MANAGER, SET_MANAGERS } from '../types'

export const addManager = (manager) => ({
  type: ADD_MANAGER,
  payload: manager
})

export const setManagers = (managers) => ({
  type: SET_MANAGERS,
  payload: managers
})
