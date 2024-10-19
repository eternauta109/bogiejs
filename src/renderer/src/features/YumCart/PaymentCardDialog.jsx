/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Paper
} from '@mui/material'

const PaymentDialog = ({ open, handleClose, total, handlePayment }) => {
  return (
    <Dialog open={open} onClose={handleClose} sx={{ height: '800px' }}>
      <DialogTitle>Pagamento Carta</DialogTitle>
      <DialogContent>
        <Paper elevation={3} sx={{ padding: 2, backgroundColor: '#f4f4f4' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            Totale Scontrino
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 3, textAlign: 'center' }}
          >
            €{total.toFixed(2)}
          </Typography>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Annulla
        </Button>
        <Button
          onClick={() => {
            handlePayment('card'), handleClose()
          }}
          color="primary"
          variant="contained"
          sx={{ padding: 1.5 }}
        >
          Conferma Pagamento
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PaymentDialog
