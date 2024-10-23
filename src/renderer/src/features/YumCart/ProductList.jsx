import { useState } from 'react'
import { Grid, Box, Tabs, Tab, Typography } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { addItem } from '../../store/reducers/cart'
import ProductSubList from './ProductSubList'

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

  // Filtra e ordina i supplies in base al tab selezionato
  const filteredSupplies = (
    selectedTab === 0
      ? [...supplies] // Usa lo spread operator per creare una copia
      : supplies.filter((supply) => supply.tab === uniqueTabs[selectedTab])
  ).sort((a, b) => a.supplyName.localeCompare(b.supplyName, 'it-IT'))

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

  const filterByFood = filteredSupplies.filter((supply) => supply.category === 'food')
  const filterByDrink = filteredSupplies.filter((supply) => supply.category === 'drink')
  const filterByConfectionery = filteredSupplies.filter(
    (supply) => supply.category === 'confectionery'
  )
  const filterByAltro = filteredSupplies.filter((supply) => supply.category === 'altro')
  const filterByMenu = filteredSupplies.filter((supply) => supply.category === 'menu')

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
        {filterByFood.length > 0 && <Typography sx={{ mb: 1 }}>Food</Typography>}
        <Grid container spacing={2}>
          {
            // Filtra i supplies per categoria "food"

            filterByFood.map((supply) => (
              <ProductSubList
                color="#F39C12"
                key={supply.codice}
                supply={supply}
                handleAddToCart={handleAddToCart}
                selectedShow={selectedShow}
                attendance={attendance}
              />
            ))
          }
        </Grid>
        {filterByDrink.length > 0 && <Typography sx={{ mb: 1, mt: 1 }}>Drink</Typography>}
        <Grid container spacing={2}>
          {filterByDrink.map((supply) => (
            <ProductSubList
              color="#48C9B0"
              key={supply.codice}
              supply={supply}
              handleAddToCart={handleAddToCart}
              selectedShow={selectedShow}
              attendance={attendance}
            />
          ))}
        </Grid>

        {filterByConfectionery.length > 0 && (
          <Typography sx={{ mb: 1, mt: 1 }}>confectionery</Typography>
        )}
        <Grid container spacing={2}>
          {filterByConfectionery.map((supply) => (
            <ProductSubList
              color="#A569BD"
              key={supply.codice}
              supply={supply}
              handleAddToCart={handleAddToCart}
              selectedShow={selectedShow}
              attendance={attendance}
            />
          ))}
        </Grid>
        {filterByAltro.length > 0 && <Typography sx={{ mb: 1, mt: 1 }}>altro</Typography>}
        <Grid container spacing={2}>
          {filterByAltro.map((supply) => (
            <ProductSubList
              color="#B2BABB"
              key={supply.codice}
              supply={supply}
              handleAddToCart={handleAddToCart}
              selectedShow={selectedShow}
              attendance={attendance}
            />
          ))}
        </Grid>
        {filterByMenu.length > 0 && <Typography sx={{ mb: 1, mt: 2 }}>menu</Typography>}
        <Grid container spacing={2}>
          {filterByMenu.map((supply) => (
            <ProductSubList
              color="#CD6155"
              key={supply.codice}
              supply={supply}
              handleAddToCart={handleAddToCart}
              selectedShow={selectedShow}
              attendance={attendance}
            />
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default ProductList
