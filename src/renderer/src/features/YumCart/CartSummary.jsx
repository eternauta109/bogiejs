/* eslint-disable react/prop-types */
import { Box, Typography, IconButton, Divider } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

const CartSummary = ({ cart, handleRemoveFromCart }) => {
  return (
    <Box
      flexGrow={1}
      sx={{ border: '1px solid #ddd', borderRadius: '8px', p: 2, overflowY: 'auto' }}
    >
      <Typography variant="h5" mb={1}>
        Scontrino
      </Typography>
      <Divider sx={{ mb: 1 }} />
      {cart.length > 0 ? (
        <Box>
          {cart.map((item) => (
            <Box key={item.salesId}>
              <Box
                display="flex"
                sx={{ backgroundColor: '#52be80', p: 1, borderRadius: '10px' }}
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography>{item.supplyName}</Typography>
                <Typography>€{item.prezzo}</Typography>
                <IconButton onClick={() => handleRemoveFromCart(item.salesId)} size="small">
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 1 }} />
            </Box>
          ))}
        </Box>
      ) : (
        <Typography>Nessun prodotto selezionato</Typography>
      )}
    </Box>
  )
}

export default CartSummary
