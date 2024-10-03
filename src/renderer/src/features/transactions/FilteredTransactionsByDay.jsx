// src/components/FilteredTransactionsByDay.jsx
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Box, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material'
import { format, isAfter, isBefore, addHours, startOfDay } from 'date-fns'

const FilteredTransactionsByDay = () => {
  const transactions = useSelector((state) => state.transactions.transactions)
  const [selectedDate, setSelectedDate] = useState('')

  // Funzione per ottenere la data corretta per ogni transazione, spostando transazioni dopo mezzanotte al giorno precedente
  const getTransactionDate = (transactionDate) => {
    const date = new Date(transactionDate)
    const startOfTransactionDay = startOfDay(date) // Inizia il giorno alle 00:00
    const threeAM = addHours(startOfTransactionDay, 3) // Aggiunge 3 ore (03:00)

    if (isAfter(date, startOfTransactionDay) && isBefore(date, threeAM)) {
      // Se è tra 00:00 e 03:00, la transazione è considerata del giorno precedente
      return format(addHours(startOfTransactionDay, -24), 'yyyy-MM-dd')
    }

    // Altrimenti, restituisci la data normale del giorno
    return format(startOfTransactionDay, 'yyyy-MM-dd')
  }

  // Ottieni tutte le date uniche in cui ci sono transazioni (escludendo duplicati)
  const uniqueDates = Array.from(
    new Set(transactions.map((transaction) => getTransactionDate(transaction.transactionDate)))
  )

  // Gestisce il cambio di data
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value)
  }

  // Filtra le transazioni in base alla data selezionata (considerando le vendite fino alle 3 del giorno successivo)
  const filteredTransactions = transactions.filter((transaction) => {
    if (!selectedDate) return false
    return getTransactionDate(transaction.transactionDate) === selectedDate
  })

  // Raggruppa le transazioni per utente e tipo di pagamento
  const groupedByUserAndPaymentType = filteredTransactions.reduce((acc, transaction) => {
    const { user, paymentType, supplyName, prezzo } = transaction

    // Inizializza l'oggetto per l'utente
    if (!acc[user]) {
      acc[user] = { cash: {}, card: {} }
    }

    // Aggiungi la transazione al tipo di pagamento corretto (cash o card)
    const paymentGroup = paymentType === 'cash' ? acc[user].cash : acc[user].card

    // Raggruppa per prodotto (supplyName)
    if (!paymentGroup[supplyName]) {
      paymentGroup[supplyName] = { count: 0, total: 0 }
    }

    paymentGroup[supplyName].count += 1
    paymentGroup[supplyName].total += prezzo

    return acc
  }, {})

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight="bold">
        Scontrino per giorno e utente
      </Typography>

      {/* Seleziona la data */}
      <FormControl fullWidth sx={{ my: 2 }}>
        <InputLabel>Data</InputLabel>
        <Select value={selectedDate} onChange={handleDateChange}>
          {uniqueDates.map((date, key) => (
            <MenuItem key={key} value={date}>
              {date}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {Object.entries(groupedByUserAndPaymentType).length > 0 ? (
        <Box>
          {/* Cicla su ciascun utente */}
          {Object.entries(groupedByUserAndPaymentType).map(([user, paymentTypes]) => (
            <Box key={user} sx={{ mb: 4 }}>
              <Typography variant="h6">Utente: {user}</Typography>

              {/* Pagamenti in contanti */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" color="primary">
                  Pagamenti in contanti
                </Typography>
                {Object.keys(paymentTypes.cash).length > 0 ? (
                  <Box sx={{ pl: 2 }}>
                    {Object.entries(paymentTypes.cash).map(([productName, details]) => (
                      <Box key={productName} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Prodotto: {productName}</Typography>
                        <Typography>Quantità vendute: {details.count}</Typography>
                        <Typography>Totale incasso: €{details.total.toFixed(2)}</Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography>Nessun pagamento in contanti</Typography>
                )}
              </Box>

              {/* Pagamenti con carta */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" color="secondary">
                  Pagamenti con carta
                </Typography>
                {Object.keys(paymentTypes.card).length > 0 ? (
                  <Box sx={{ pl: 2 }}>
                    {Object.entries(paymentTypes.card).map(([productName, details]) => (
                      <Box key={productName} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Prodotto: {productName}</Typography>
                        <Typography>Quantità vendute: {details.count}</Typography>
                        <Typography>Totale incasso: €{details.total.toFixed(2)}</Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography>Nessun pagamento con carta</Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography>Nessuna transazione trovata per la data selezionata.</Typography>
      )}
    </Box>
  )
}

export default FilteredTransactionsByDay
