import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Typography, TextField } from '@mui/material'
import { fetchTransactionsByDate } from '../../store/reducers/transactions' // Assicurati che il thunk fetchTransactionsByDate sia importato correttamente

const FilteredTransactionsByDay = () => {
  const dispatch = useDispatch()
  const transactions = useSelector((state) => state.transactions.transactions)
  const [selectedDate, setSelectedDate] = useState('')

  // Funzione per gestire il cambio di data
  const handleDateChange = (e) => {
    const selected = e.target.value
    console.log(selected)
    setSelectedDate(selected)

    if (selected) {
      // Dispatch per caricare le transazioni della data selezionata
      dispatch(fetchTransactionsByDate(selected))
    }
  }

  // Raggruppa le transazioni per utente e tipo di pagamento
  const groupedByUserAndPaymentType = transactions.reduce((acc, transaction) => {
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

  // Calcola il riepilogo totale per cash e card separatamente
  const totalSummary = transactions.reduce(
    (acc, transaction) => {
      const { supplyName, prezzo, paymentType } = transaction

      // Raggruppa per prodotto (supplyName) separando cash e card
      const group = paymentType === 'cash' ? acc.cash : acc.card

      if (!group[supplyName]) {
        group[supplyName] = { count: 0, total: 0 }
      }

      group[supplyName].count += 1
      group[supplyName].total += prezzo

      return acc
    },
    { cash: {}, card: {} }
  )

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight="bold">
        Scontrino per giorno e utente
      </Typography>

      {/* Campo di selezione della data */}
      <TextField
        label="Seleziona una data"
        type="date"
        value={selectedDate || ''}
        onChange={handleDateChange}
        InputLabelProps={{
          shrink: true
        }}
        sx={{ my: 2 }}
      />

      {/* Visualizzazione dei risultati o del messaggio di errore */}
      {selectedDate ? (
        transactions.length > 0 ? (
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
                        <Box
                          key={productName}
                          sx={{ mb: 2 }}
                          display="flex"
                          flexDirection="row"
                          gap={2}
                        >
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
                        <Box
                          key={productName}
                          sx={{ mb: 2 }}
                          display="flex"
                          flexDirection="row"
                          gap={2}
                        >
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

            {/* Riepilogo totale per cash e card */}
            <Box sx={{ mt: 4, borderTop: '1px solid gray', pt: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Riepilogo Vendite Totali (Pagamenti in Contanti):
              </Typography>
              {Object.entries(totalSummary.cash).map(([productName, details]) => (
                <Box key={productName} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>
                    {details.count}x {productName} venduti
                  </Typography>
                  <Typography>Totale incasso: €{details.total.toFixed(2)}</Typography>
                </Box>
              ))}
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                Totale contanti: €
                {Object.values(totalSummary.cash)
                  .reduce((acc, { total }) => acc + total, 0)
                  .toFixed(2)}
              </Typography>

              <Typography variant="h6" fontWeight="bold" sx={{ mt: 4 }}>
                Riepilogo Vendite Totali (Pagamenti con Carta):
              </Typography>
              {Object.entries(totalSummary.card).map(([productName, details]) => (
                <Box key={productName} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>
                    {details.count}x {productName} venduti
                  </Typography>
                  <Typography>Totale incasso: €{details.total.toFixed(2)}</Typography>
                </Box>
              ))}
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                Totale carta: €
                {Object.values(totalSummary.card)
                  .reduce((acc, { total }) => acc + total, 0)
                  .toFixed(2)}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography>Nessuna transazione trovata per la data selezionata.</Typography>
        )
      ) : (
        <Typography>Seleziona una data per visualizzare le transazioni.</Typography>
      )}
    </Box>
  )
}

export default FilteredTransactionsByDay
