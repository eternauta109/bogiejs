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
  Box,
  Alert
} from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetSales } from '../../store/reducers/sales'
import { fetchTransactionsByDate } from '../../store/reducers/transactions'

const CloseCashSummary = () => {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const transactions = useSelector((state) => state.transactions.transactions)
  const [groupedTransactions, setGroupedTransactions] = useState([])
  const [cashCount, setCashCount] = useState({})
  const [aspettato, setAspettato] = useState(0)
  const [difference, setDifference] = useState(0)
  const [showDiscrepancyAlert, setShowDiscrepancyAlert] = useState(false)

  // Funzione per calcolare il totale inserito
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

  // Funzione per fare il fetch delle transazioni in base alla data
  const loadTransactionsByDate = async () => {
    const response = await dispatch(fetchTransactionsByDate(selectedDate))

    const newTrans = response.payload
    // Raggruppa le transazioni per utente
    const groupedByUser = newTrans.reduce((acc, transaction) => {
      const { user, paymentType, prezzo } = transaction

      if (!acc[user]) {
        acc[user] = { totalCash: 0, totalCard: 0, totalSales: 0 }
      }

      if (paymentType === 'cash') {
        acc[user].totalCash += prezzo
      } else if (paymentType === 'card') {
        acc[user].totalCard += prezzo
      }

      acc[user].totalSales += prezzo
      return acc
    }, {})

    setGroupedTransactions(groupedByUser)
  }

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value)
  }

  const handleCashCountChange = (value, denomination, user) => {
    const newCount = parseInt(value, 10) || 0
    const newCashCount = { ...cashCount, [denomination]: newCount }
    setCashCount(newCashCount)

    const newTotalRealCash = calculateTotalRealCash(newCashCount)

    const diff = newTotalRealCash - groupedTransactions[user].totalCash
    console.log()
    setAspettato(groupedTransactions[user].totalCash)
    setDifference(diff)

    // Mostra un avviso se c'è una differenza significativa (> 0.01)
    setShowDiscrepancyAlert(Math.abs(diff) > 0.01)
  }

  const handleOpenCashDialog = (user) => {
    setSelectedUser(user)
    setOpen(true)
  }

  const handleConfirmClose = () => {
    if (showDiscrepancyAlert) {
      alert(
        "Attenzione! C'è una discrepanza significativa tra il contante aspettato e quello inserito."
      )
    } else {
      dispatch(resetSales())
      setCashCount({})
      setOpen(false)
    }
  }

  const handleFocus = (event) => {
    event.target.select()
  }

  return (
    <>
      {/* Seleziona la data */}
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          label="Seleziona una data"
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" sx={{ ml: 2 }} onClick={loadTransactionsByDate}>
          Chiudi una giornata
        </Button>
      </Box>

      {/* Mostra le card per ogni utente */}
      {transactions && transactions.length > 0 ? (
        <Box>
          {Object.entries(groupedTransactions).map(([user, totals]) => (
            <Card key={user} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Utente: {user}</Typography>
                <Typography variant="body1">Totale cash: €{totals.totalCash.toFixed(2)}</Typography>
                <Typography variant="body1">Totale card: €{totals.totalCard.toFixed(2)}</Typography>
                <Typography variant="body1">
                  Totale vendite: €{totals.totalSales.toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenCashDialog(user)}
                >
                  Chiudi Cassa
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography variant="h6" color="textSecondary">
          il carreto questo giorno non passò
        </Typography>
      )}

      {/* Dialog per chiudere la cassa per un utente */}
      <Dialog open={!!open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Conteggio Cassa per {selectedUser}</DialogTitle>
        <DialogContent>
          {showDiscrepancyAlert && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Attenzione! esiste una discrepanza significativa tra il contante aspettato e quello
              inserito.
            </Alert>
          )}
          <Grid container spacing={1} sx={{ mt: 2 }}>
            {[
              '500€',
              '200€',
              '100€',
              '50€',
              '20€',
              '10€',
              '5€',
              '2€',
              '1€',
              '0.50€',
              '0.20€',
              '0.10€',
              '0.05€',
              '0.02€',
              '0.01€'
            ].map((denomination) => (
              <Grid item xs={3} key={denomination}>
                <TextField
                  label={denomination}
                  type="number"
                  value={cashCount[denomination] || 0}
                  onChange={(e) =>
                    handleCashCountChange(e.target.value, denomination, selectedUser)
                  }
                  onFocus={handleFocus}
                  fullWidth
                />
              </Grid>
            ))}
          </Grid>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Aspettato: €{aspettato.toFixed(2)}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Differenza: €{difference.toFixed(2)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Annulla
          </Button>
          <Button
            onClick={() => handleConfirmClose(selectedUser)}
            color="primary"
            variant="contained"
          >
            Conferma
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CloseCashSummary
