import { useState } from 'react'
import { Button, Box, Switch, FormControlLabel, Typography, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransactionsByDate, fetchTransactions } from '../../store/reducers/transactions' // Modificato per supportare il fetch per data
import TransactionsDataGrid from './TransactionsDataGrid' // Il DataGrid esistente
import ExportTransactionsToExcel from './ExportTransactionsToExcel'
import HistoricalTransactionsGrouped from './HistoricalTransactionsGrouped' // Il nuovo componente raggruppato

const HistoricalTransactionsLoader = (user) => {
  const loading = useSelector((state) => state.transactions.loading)
  const error = useSelector((state) => state.transactions.error)
  const transactions = useSelector((state) => state.transactions.transactions)
  const [allTrans, setAllTrans] = useState(false)
  const [groupedView, setGroupedView] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null) // Stato per la data selezionata
  const dispatch = useDispatch()

  // Funzione per caricare le transazioni storiche in base alla data
  const loadHistoricalTransactions = () => {
    if (!selectedDate) return

    // Dispatch per caricare le transazioni per il range di date
    dispatch(fetchTransactionsByDate(selectedDate))
  }

  //funzione per caricare tutte le transazioni
  const loadAllTransactions = () => {
    setAllTrans(true)
    dispatch(fetchTransactions())
  }

  // Funzione per aggiornare la data selezionata
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value)
  }

  return (
    <Box>
      {/* Campo di selezione della data */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          label="Seleziona una data"
          type="date"
          value={selectedDate || ''}
          onChange={handleDateChange}
          InputLabelProps={{
            shrink: true
          }}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={loadHistoricalTransactions}
          disabled={!selectedDate} // Disabilitato finché non viene selezionata una data
          sx={{ ml: 2 }}
        >
          Carica Transazioni Per la giornata selezionata
        </Button>

        <ExportTransactionsToExcel
          transactions={transactions}
          allTrans={allTrans}
          selectedDate={selectedDate}
          setAllTrans={setAllTrans}
          user={user}
        />
      </Box>

      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" fontWeight="bold">
            Lista delle Transazioni
          </Typography>
          <FormControlLabel
            control={
              <Switch checked={groupedView} onChange={(e) => setGroupedView(e.target.checked)} />
            }
            label="Raggruppa per Transazione"
          />
        </Box>

        {/* Condizionale per la vista raggruppata o il DataGrid */}
        {groupedView ? (
          <HistoricalTransactionsGrouped transactions={transactions} />
        ) : (
          <TransactionsDataGrid transactions={transactions} loading={loading} error={error} />
        )}

        <Button variant="contained" color="secondary" onClick={loadAllTransactions} sx={{ mt: 2 }}>
          Carica Tutte le transazioni
        </Button>
      </Box>
    </Box>
  )
}

export default HistoricalTransactionsLoader
