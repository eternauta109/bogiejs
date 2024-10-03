/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Grid
} from '@mui/material'
import { resetSales } from '../../store/reducers/sales'

const billDenominations = [
  { label: '500€', value: 500 },
  { label: '200€', value: 200 },
  { label: '100€', value: 100 },
  { label: '50€', value: 50 },
  { label: '20€', value: 20 },
  { label: '10€', value: 10 },
  { label: '5€', value: 5 }
]

const coinDenominations = [
  { label: '2€', value: 2 },
  { label: '1€', value: 1 },
  { label: '0.50€', value: 0.5 },
  { label: '0.20€', value: 0.2 },
  { label: '0.10€', value: 0.1 },
  { label: '0.05€', value: 0.05 },
  { label: '0.02€', value: 0.02 },
  { label: '0.01€', value: 0.01 }
]

const CloseCashDialog = ({ open, handleClose, totalCash, dispatch }) => {
  const [realCashTotal, setRealCashTotal] = useState(0)
  const [counts, setCounts] = useState({})
  const [hasDifference, setHasDifference] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false) // Stato per mostrare conferma con differenza

  const handleCountChange = (value, denomination) => {
    const count = parseInt(value, 10) || 0
    setCounts((prevCounts) => ({
      ...prevCounts,
      [denomination]: count
    }))
  }

  useEffect(() => {
    const total = [...billDenominations, ...coinDenominations].reduce((sum, denom) => {
      const count = counts[denom.value] || 0
      return sum + count * denom.value
    }, 0)
    setRealCashTotal(total)
    setHasDifference(total !== totalCash)
  }, [counts, totalCash])

  const handleConfirm = () => {
    if (hasDifference) {
      // Mostra un dialogo di conferma se c'è una differenza
      setShowConfirmDialog(true)
    } else {
      // Se non c'è differenza, conferma direttamente
      dispatch(resetSales())
      resetForm()
      handleClose()
      alert('Incasso confermato correttamente!')
    }
  }

  // Conferma anche se c'è differenza (procedere comunque)
  const handleProceedAnyway = () => {
    dispatch(resetSales())
    resetForm()
    handleClose()
    setShowConfirmDialog(false)
    alert('Incasso confermato con differenza!')
  }

  // Funzione per resettare il form e azzerare i valori
  const resetForm = () => {
    setRealCashTotal(0) // Resetta il totale reale
    setCounts({}) // Resetta il conteggio delle monete
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        resetForm() // Azzera i campi quando si chiude il dialog
        handleClose()
      }}
    >
      <DialogTitle>Chiudi Cassa </DialogTitle>
      <DialogContent>
        {/* Layout a due colonne: banconote a sinistra, monete a destra */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6">Banconote</Typography>
            {billDenominations.map((denom) => (
              <Box key={denom.value} sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                <TextField
                  label={denom.label}
                  type="number"
                  value={counts[denom.value] || ''}
                  onChange={(e) => handleCountChange(e.target.value, denom.value)}
                  fullWidth
                />
              </Box>
            ))}
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h6">Monete</Typography>
            {coinDenominations.map((denom) => (
              <Box key={denom.value} sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                <TextField
                  label={denom.label}
                  type="number"
                  value={counts[denom.value] || ''}
                  onChange={(e) => handleCountChange(e.target.value, denom.value)}
                  fullWidth
                />
              </Box>
            ))}
          </Grid>
        </Grid>

        {/* Differenza e totale */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Totale Reale: €{realCashTotal.toFixed(2)}</Typography>
          <Typography variant="h6" color={hasDifference ? 'error' : 'success'}>
            Differenza: €{(realCashTotal - totalCash).toFixed(2)}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleConfirm} variant="contained" color="success">
          Conferma
        </Button>
        <Button
          onClick={() => {
            resetForm() // Azzera i campi quando si chiude
            handleClose()
          }}
          variant="outlined"
          color="secondary"
        >
          Annulla
        </Button>
      </DialogActions>

      {/* Dialogo di conferma in caso di differenza */}
      {showConfirmDialog && (
        <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
          <DialogTitle>Attenzione:</DialogTitle>
          <DialogContent>
            <Typography>
              Incasso dichiarato: €{totalCash.toFixed(2)}, Incasso reale: €
              {realCashTotal.toFixed(2)}.
            </Typography>
            <Typography>Vuoi procedere comunque?</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="error"
              onClick={() => setShowConfirmDialog(false)} // Ritorna al conteggio
            >
              Correggi
            </Button>
            <Button variant="contained" color="primary" onClick={handleProceedAnyway}>
              Procedi comunque
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Dialog>
  )
}

export default CloseCashDialog
