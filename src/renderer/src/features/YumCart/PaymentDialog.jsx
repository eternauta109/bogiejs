/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Paper
} from '@mui/material'
import { useState } from 'react'

const PaymentDialog = ({ open, handleClose, total, handlePayment }) => {
  const [cashReceived, setCashReceived] = useState('')

  const handleCashPayment = () => {
    const cash = parseFloat(cashReceived)
    if (cash >= total) {
      handlePayment('cash')
      setCashReceived('') // Azzera il valore inserito
      handleClose() // Chiude il dialog
    } else {
      alert('Importo insufficiente!')
    }
  }

  const handleKeyPress = (value) => {
    if (value === 'C') {
      setCashReceived('') // Cancella tutto
    } else if (value === '.') {
      if (!cashReceived.includes('.')) {
        setCashReceived(cashReceived + value) // Aggiunge il punto solo se non è già presente
      }
    } else {
      setCashReceived(cashReceived + value) // Aggiunge il numero
    }
  }

  const handleQuickAdd = (amount) => {
    setCashReceived((prev) => (parseFloat(prev) || 0) + amount + '') // Somma importo selezionato
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Pagamento Contanti</DialogTitle>
      <DialogContent>
        <Paper elevation={3} sx={{ padding: 2, backgroundColor: '#f4f4f4' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            Totale Scontrino
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 3, textAlign: 'center' }}
          >
            €{total.toFixed(2)}
          </Typography>
        </Paper>

        <Paper elevation={3} sx={{ padding: 2, mt: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            Importo Digitato
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#16a085',
              mb: 2,
              textAlign: 'center',
              borderBottom: '2px solid #ddd',
              paddingBottom: 1
            }}
          >
            {cashReceived || '0.00'}
          </Typography>

          {/* Pulsanti rapidi per aggiungere importi */}
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {[10, 20, 50, 100].map((amount) => (
              <Grid item xs={3} key={amount}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleQuickAdd(amount)}
                  sx={{
                    padding: 1,
                    fontSize: '1.2rem',
                    backgroundColor: '#2ecc71',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#27ae60'
                    }
                  }}
                >
                  +{amount}€
                </Button>
              </Grid>
            ))}
          </Grid>

          {/* Tastierino Numerico */}
          <Grid container spacing={1}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'C'].map((key) => (
              <Grid item xs={4} key={key}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleKeyPress(key)}
                  sx={{
                    padding: 3,
                    fontSize: '1.5rem',
                    backgroundColor: '#3498db',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#2980b9'
                    }
                  }}
                >
                  {key}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Mostra il resto se il denaro è sufficiente */}
        {parseFloat(cashReceived) >= total && (
          <Typography
            variant="h5"
            sx={{
              mt: 2,
              fontWeight: 'bold',
              color: '#27ae60',
              textAlign: 'center'
            }}
          >
            Resto da dare: €{(parseFloat(cashReceived) - total).toFixed(2)}
          </Typography>
        )}

        {/* Messaggio di errore se il denaro è insufficiente */}
        {parseFloat(cashReceived) < total && cashReceived && (
          <Typography
            variant="h5"
            sx={{
              mt: 2,
              fontWeight: 'bold',
              color: '#e74c3c',
              textAlign: 'center'
            }}
          >
            Importo insufficiente!
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Annulla
        </Button>
        <Button
          onClick={() => handleCashPayment()}
          color="primary"
          variant="contained"
          sx={{ padding: 1.5 }}
          disabled={parseFloat(cashReceived) < total}
        >
          Conferma Pagamento
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PaymentDialog
