/* eslint-disable react/prop-types */
import { Box, Typography, IconButton, Divider } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useDispatch } from 'react-redux'
import { removeItem } from '../../store/reducers/cart'

const CartItem = ({ item }) => {
  const dispatch = useDispatch()

  // Rimuove un prodotto dal carrello
  const handleRemoveFromCart = () => {
    dispatch(removeItem(item.salesId))
  }

  return (
    <>
      <Box
        display="flex"
        sx={{ backgroundColor: '#52be80', p: 1, borderRadius: '10px' }}
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography>{item.supplyName}</Typography>
        <Typography>€{parseFloat(item.prezzo).toFixed(2)}</Typography>
        <IconButton onClick={handleRemoveFromCart} size="small">
          <DeleteIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 1 }} />
    </>
  )
}

export default CartItem
