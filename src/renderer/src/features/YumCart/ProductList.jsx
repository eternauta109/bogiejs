import { Grid, Button, Typography, Paper, Box } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { addItem } from '../../store/reducers/cart'

// eslint-disable-next-line react/prop-types
const ProductList = ({ selectedShow, attendance }) => {
  const supplies = useSelector((state) => state.supplies.supplies)
  const user = useSelector((state) => state.managers.user)
  const shows = useSelector((state) => state.shows.selectedShows)
  const dispatch = useDispatch()

  // Aggiunge un prodotto al carrello
  const handleAddToCart = (supply) => {
    const showDetails = shows.find((show) => show.id === selectedShow)
    const newTransaction = {
      ...supply,
      user: user.userName,
      FEATURE: showDetails.PLAYLIST,
      FEATURE_TIME: showDetails.FEATURE_TIME,
      attendance: parseInt(attendance, 10),
      SHOW_TIME: showDetails.SHOW_TIME,
      salesId: 'sales-' + uuidv4(),
      transactionDate: new Date().toISOString()
    }
    console.log('newTransaction', newTransaction)
    dispatch(addItem(newTransaction))
  }

  return (
    <Box
      sx={{
        height: '600px', // Altezza fissa per il contenitore
        overflowY: 'auto', // Scorrimento verticale
        border: '1px solid #ddd', // Bordo leggero
        borderRadius: '8px',
        padding: 2,
        backgroundColor: '#f4f4f4' // Sfondo neutro
      }}
    >
      <Grid container spacing={3}>
        {supplies.map((supply) => (
          <Grid item xs={6} sm={4} key={supply.codice}>
            <Paper elevation={3} sx={{ padding: 2, backgroundColor: '#f8f9fa', height: '100%' }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => handleAddToCart(supply)}
                disabled={!selectedShow || !attendance}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: 2,
                  backgroundColor: '#3498db',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#2980b9'
                  },
                  height: '100%'
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
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
  )
}

export default ProductList
