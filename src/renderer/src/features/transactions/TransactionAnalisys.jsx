/* eslint-disable react/prop-types */
import { useState } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Container, Box, Tab, Tabs } from '@mui/material'

import CloseCashSummary from './CloseCashSummary' // Mostra il riepilogo della cassa
import FilteredTransactionsByDay from './FilteredTransactionsByDay' // Già esistente

import HistoricalTransactionsLoader from './HistoricalTransactionsLoader' // Nuovo componente

const TransactionsList = () => {
  const user = useSelector((state) => state.managers.user)

  const [tab, setTab] = useState(0)

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
        {/* Riepilogo chiusura cassa */}
        <CloseCashSummary user={user} />
      </CustomTabPanel>

      <CustomTabPanel value={tab} index={1}>
        {/* Filtra le transazioni per giorno */}
        <FilteredTransactionsByDay />
      </CustomTabPanel>

      <CustomTabPanel value={tab} index={2}>
        {/* Caricamento transazioni storiche */}
        <HistoricalTransactionsLoader user={user} />
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
