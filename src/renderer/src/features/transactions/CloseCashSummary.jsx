/* eslint-disable react/prop-types */
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Box
} from '@mui/material'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { resetSales } from '../../store/reducers/sales'

const CloseCashSummary = ({ user }) => {
  const { totalCash, totalSales, totalCard } = useSelector((state) => state.sales)
  const dispatch = useDispatch()

  const [open, setOpen] = useState(false)
  const [cashCount, setCashCount] = useState({
    '500€': 0,
    '200€': 0,
    '100€': 0,
    '50€': 0,
    '20€': 0,
    '10€': 0,
    '5€': 0,
    '2€': 0,
    '1€': 0,
    '0.50€': 0,
    '0.20€': 0,
    '0.10€': 0,
    '0.05€': 0,
    '0.02€': 0,
    '0.01€': 0
  })
  const [totalRealCash, setTotalRealCash] = useState(0)
  const [difference, setDifference] = useState(0)

  const calculateTotalRealCash = (newCashCount) => {
    const cashDenominations = {
      '500€': 500,
      '200€': 200,
      '100€': 100,
      '50€': 50,
      '20€': 20,
      '10€': 10,
      '5€': 5,
      '2€': 2,
      '1€': 1,
      '0.50€': 0.5,
      '0.20€': 0.2,
      '0.10€': 0.1,
      '0.05€': 0.05,
      '0.02€': 0.02,
      '0.01€': 0.01
    }

    let newTotal = 0
    Object.keys(newCashCount).forEach((denom) => {
      newTotal += newCashCount[denom] * cashDenominations[denom]
    })

    return newTotal
  }

  const handleCashCountChange = (value, denomination) => {
    const newCount = parseInt(value, 10) || 0
    const newCashCount = { ...cashCount, [denomination]: newCount }
    setCashCount(newCashCount)

    const newTotalRealCash = calculateTotalRealCash(newCashCount)
    setTotalRealCash(newTotalRealCash)
    setDifference(newTotalRealCash - totalCash)
  }

  const handleConfirm = () => {
    dispatch(resetSales())
    setOpen(false)
    setTotalRealCash(0)
    setCashCount({
      '500€': 0,
      '200€': 0,
      '100€': 0,
      '50€': 0,
      '20€': 0,
      '10€': 0,
      '5€': 0,
      '2€': 0,
      '1€': 0,
      '0.50€': 0,
      '0.20€': 0,
      '0.10€': 0,
      '0.05€': 0,
      '0.02€': 0,
      '0.01€': 0
    })
  }

  const handleFocus = (event) => {
    event.target.select()
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            Incasso di {user.userName}
          </Typography>
          <Typography variant="h6">Incasso totale: €{totalSales}</Typography>
          <Typography variant="h6">Incasso contanti: €{totalCash}</Typography>
          <Typography variant="h6">Incasso carta: €{totalCard}</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => setOpen(true)}>
            Chiudi cassa
          </Button>
        </CardContent>
      </Card>

      {/* Dialog per il conteggio dei soldi */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Conteggio Cassa</DialogTitle>
        <DialogContent>
          <Box display="flex" gap={2}>
            {/* Colonna per le banconote */}
            <Grid container spacing={2} sx={{ width: '50%', mt: 1 }}>
              {['500€', '200€', '100€', '50€', '20€', '10€', '5€'].map((denomination) => (
                <Grid item xs={6} key={denomination}>
                  <TextField
                    label={denomination}
                    type="number"
                    value={cashCount[denomination]}
                    onChange={(e) => handleCashCountChange(e.target.value, denomination)}
                    onFocus={handleFocus} // Seleziona tutto il testo quando si clicca
                    fullWidth
                  />
                </Grid>
              ))}
            </Grid>

            {/* Colonna per le monete */}
            <Grid container spacing={2} sx={{ width: '50%', mt: 1 }}>
              {['2€', '1€', '0.50€', '0.20€', '0.10€', '0.05€', '0.02€', '0.01€'].map(
                (denomination) => (
                  <Grid item xs={6} key={denomination}>
                    <TextField
                      label={denomination}
                      type="number"
                      value={cashCount[denomination]}
                      onChange={(e) => handleCashCountChange(e.target.value, denomination)}
                      onFocus={handleFocus} // Seleziona tutto il testo quando si clicca
                      fullWidth
                    />
                  </Grid>
                )
              )}
            </Grid>
          </Box>
          <Typography variant="h6" sx={{ mt: 2, color: 'green' }}>
            Totale aspettato: €{totalCash.toFixed(2)}
          </Typography>
          <Typography variant="h6">Totale inserito: €{totalRealCash.toFixed(2)}</Typography>
          <Typography variant="h6" color={difference >= 0 ? 'success' : 'error'}>
            Differenza: €{difference.toFixed(2)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Annulla
          </Button>
          <Button onClick={handleConfirm} color="primary" variant="contained">
            Conferma
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CloseCashSummary
