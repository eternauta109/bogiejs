import { useState } from 'react'
import { Button, Box, Switch, FormControlLabel, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransactions } from '../../store/reducers/transactions'
import TransactionsDataGrid from './TransactionsDataGrid' // Il DataGrid esistente
import ExportTransactionsToExcel from './ExportTransactionsToExcel'
import HistoricalTransactionsGrouped from './HistoricalTransactionsGrouped' // Il nuovo componente raggruppato

const HistoricalTransactionsLoader = () => {
  const transactions = useSelector((state) => state.transactions.transactions)
  const loading = useSelector((state) => state.transactions.loading)
  const error = useSelector((state) => state.transactions.error)
  const [groupedView, setGroupedView] = useState(false)
  const dispatch = useDispatch()

  const loadHistoricalTransactions = () => {
    dispatch(fetchTransactions())
  }

  return (
    <Box>
      <Button variant="contained" color="secondary" onClick={loadHistoricalTransactions}>
        Carica Transazioni Storiche
      </Button>

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
      </Box>

      <ExportTransactionsToExcel transactions={transactions} />
    </Box>
  )
}

export default HistoricalTransactionsLoader
