import { useState } from 'react'
import { Grid, Button, Typography, Paper, Box, Tabs, Tab } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { addItem } from '../../store/reducers/cart'

// eslint-disable-next-line react/prop-types
const ProductList = ({ selectedShow, attendance }) => {
  const supplies = useSelector((state) => state.supplies.supplies)
  const user = useSelector((state) => state.managers.user)
  const shows = useSelector((state) => state.shows.selectedShows)
  const dispatch = useDispatch()
  const [selectedTab, setSelectedTab] = useState(0)

  // Gestisci il cambio di tab
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
  }

  // Ottieni i valori unici di "tab" dai supplies
  const uniqueTabs = ['Tutti', ...new Set(supplies.map((supply) => supply.tab))].sort((a, b) =>
    a === 'Tutti' ? -1 : b === 'Tutti' ? 1 : a - b
  )

  // Filtra i supplies in base al tab selezionato
  const filteredSupplies =
    selectedTab === 0
      ? supplies // Tab "Tutti", mostra tutto
      : supplies.filter((supply) => supply.tab === uniqueTabs[selectedTab])

  // Aggiunge un prodotto al carrello
  const handleAddToCart = (supply) => {
    const showDetails = shows.find((show) => show.id === selectedShow)
    const dateTrans = new Date()
    dateTrans.setHours(dateTrans.getHours() + 2)

    const newTransaction = {
      ...supply,
      cinema: user.cinema,
      user: user.userName,
      FEATURE: showDetails.PLAYLIST,
      FEATURE_TIME: showDetails.FEATURE_TIME,
      attendance: parseInt(attendance, 10),
      SHOW_TIME: showDetails.SHOW_TIME,
      salesId: 'sales-' + uuidv4(),
      transactionDate: dateTrans.toISOString()
    }
    console.log('newTransaction', newTransaction)
    dispatch(addItem(newTransaction))
  }

  return (
    <Box>
      {/* Tabs per filtrare i supplies */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        {uniqueTabs.map((tab, index) => (
          <Tab key={index} label={tab} />
        ))}
      </Tabs>

      <Box
        sx={{
          height: '450px', // Altezza fissa per il contenitore
          overflowY: 'auto', // Scorrimento verticale
          border: '1px solid #ddd', // Bordo leggero
          borderRadius: '8px',
          padding: 2,
          backgroundColor: '#f4f4f4' // Sfondo neutro
        }}
      >
        <Grid container spacing={2}>
          {filteredSupplies.map((supply) => (
            <Grid item xs={6} sm={2} key={supply.codice}>
              <Paper elevation={3} sx={{ padding: 1, backgroundColor: '#f8f9fa', height: '100%' }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleAddToCart(supply)}
                  disabled={selectedShow == null || !attendance}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 1,
                    backgroundColor: '#3498db',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#2980b9'
                    },
                    height: '100%'
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      textAlign: 'center',
                      color: '#fff',
                      mb: 1
                    }}
                  >
                    {supply.supplyName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      textAlign: 'center',
                      color: '#fff'
                    }}
                  >
                    €{parseFloat(supply.prezzo).toFixed(2)}
                  </Typography>
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default ProductList
