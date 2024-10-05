/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Container, Box, Typography, Switch, FormControlLabel, Tab, Tabs } from '@mui/material'
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
  const [tab, setTab] = useState(0)

  useEffect(() => {
    dispatch(fetchTransactions()) // Fetch delle transazioni
  }, [dispatch])

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          aria-label="basic tabs example"
        >
          <Tab label="chiusura e conteggi" {...a11yProps(0)} />
          <Tab label="prepara scontrino vista" {...a11yProps(1)} />
          <Tab label="storico transazioni" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={tab} index={0}>
        Item One
        {/* Riepilogo chiusura cassa */}
        <CloseCashSummary user={user} />
      </CustomTabPanel>

      <CustomTabPanel value={tab} index={1}>
        {/* Filtra le transazioni per giorno */}
        <FilteredTransactionsByDay />
      </CustomTabPanel>

      <CustomTabPanel value={tab} index={2}>
        {/* Caricamento transazioni storiche */}
        <HistoricalTransactionsLoader />
        {/* Esportazione transazioni */}
        <ExportTransactionsToExcel transactions={transactions} />

        {/* Griglia di transazioni */}
        <Box sx={{ mt: 4 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
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
      </CustomTabPanel>
    </Container>
  )
}

export default TransactionsList

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}
