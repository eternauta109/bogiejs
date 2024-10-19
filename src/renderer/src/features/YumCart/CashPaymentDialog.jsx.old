/* eslint-disable react/prop-types */
import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { addCashSale, clearCart } from '../../store/reducers/cart'
import { v4 as uuidv4 } from 'uuid'
import { addTransactionToDB } from '../../store/reducers/transactions'

const CashPaymentDialog = ({ isOpen, onClose, total }) => {
  const [cashReceived, setCashReceived] = useState('')
  const cart = useSelector((state) => state.cart.items)
  const dispatch = useDispatch()

  const handleCashPayment = () => {
    const cash = parseFloat(cashReceived)
    if (cash >= total) {
      const transactionId = 'trans-' + uuidv4()
      const newCart = cart.map((item) => ({
        ...item,
        transactionId,
        paymentType: 'cash'
      }))
      dispatch(addCashSale(total))
      dispatch(addTransactionToDB(newCart))
      dispatch(clearCart())
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Calcola Resto</DialogTitle>
      <DialogContent>
        <Typography>Totale Scontrino: €{total.toFixed(2)}</Typography>
        <TextField
          label="Importo ricevuto"
          variant="outlined"
          type="number"
          fullWidth
          value={cashReceived}
          onChange={(e) => setCashReceived(e.target.value)}
          sx={{ mt: 2 }}
        />
        {parseFloat(cashReceived) >= total && (
          <Typography sx={{ mt: 2 }}>
            Resto da dare: €{(parseFloat(cashReceived) - total).toFixed(2)}
          </Typography>
        )}
        {parseFloat(cashReceived) < total && cashReceived && (
          <Typography sx={{ mt: 2 }} color="error">
            Importo insufficiente!
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annulla
        </Button>
        <Button
          onClick={handleCashPayment}
          color="primary"
          disabled={parseFloat(cashReceived) < total}
        >
          Conferma Pagamento
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CashPaymentDialog
