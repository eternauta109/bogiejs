// src/store/actions/products.js
import { ADD_PRODUCT, SET_PRODUCTS } from '../types'

export const addProduct = (product) => ({
  type: ADD_PRODUCT,
  payload: product
})

export const setProducts = (products) => ({
  type: SET_PRODUCTS,
  payload: products
})
