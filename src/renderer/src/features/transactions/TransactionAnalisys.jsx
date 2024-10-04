import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Box, Typography, Switch, FormControlLabel } from '@mui/material'
import { fetchTransactions } from '../../store/reducers/transactions'
import CloseCashSummary from './CloseCashSummary' // Mostra il riepilogo della cassa
import FilteredTransactionsByDay from './FilteredTransactionsByDay' // Già esistente
import ExportTransactionsToExcel from './ExportTransactionsToExcel' // Nuovo componente
import HistoricalTransactionsLoader from './HistoricalTransactionsLoader' // Nuovo componente
import TransactionsDataGrid from './TransactionsDataGrid' // Griglia con i dati delle transazioni

const TransactionsList = () => {
  const dispatch = useDispatch()
  const transactions = useSelector((state) => state.transactions.transactions)
  const loading = useSelector((state) => state.transactions.loading)
  const error = useSelector((state) => state.transactions.error)
  const user = useSelector((state) => state.managers.user)
  const [groupedView, setGroupedView] = useState(false)

  useEffect(() => {
    dispatch(fetchTransactions()) // Fetch delle transazioni
  }, [dispatch])

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Riepilogo chiusura cassa */}
      <CloseCashSummary user={user} />

      {/* Filtra le transazioni per giorno */}
      <FilteredTransactionsByDay />

      {/* Caricamento transazioni storiche */}
      <HistoricalTransactionsLoader />

      {/* Esportazione transazioni */}
      <ExportTransactionsToExcel transactions={transactions} />

      {/* Griglia di transazioni */}
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

        <TransactionsDataGrid
          transactions={transactions}
          loading={loading}
          error={error}
          groupedView={groupedView}
        />
      </Box>
    </Container>
  )
}

export default TransactionsList
