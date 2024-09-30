// src/components/YumCart.jsx
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button,
  Container,
  Box,
  Typography,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Divider
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { addItem, removeItem, clearCart } from '../../store/reducers/cart'
import { addCashSale, addCardSale } from '../../store/reducers/sales'

const YumCart = () => {
  const [selectedShow, setSelectedShow] = useState('')
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart.items)
  const total = useSelector((state) => state.cart.total)
  const supplies = useSelector((state) => state.supplies.supplies)

  const shows = [
    {
      id: 1,
      FEATURE: 'Indiana Jones',
      FEATURE_TIME: '14:00'
    },
    {
      id: 2,
      FEATURE: 'Ghostbuster',
      FEATURE_TIME: '15:00'
    },
    {
      id: 3,
      FEATURE: 'Star Wars',
      FEATURE_TIME: '16:30'
    }
  ]

  // Gestisce la selezione dello spettacolo
  const handleShowSelection = (event) => {
    setSelectedShow(event.target.value)
  }

  // Aggiunge un prodotto al carrello
  const handleAddToCart = (supply) => {
    dispatch(addItem(supply))
  }

  // Rimuove un prodotto dal carrello
  const handleRemoveFromCart = (id) => {
    dispatch(removeItem(id))
  }

  // Gestisce il pagamento in contanti
  const handleCashPayment = () => {
    dispatch(addCashSale(total))
    dispatch(clearCart())
  }
  // Gestisce il pagamento con carta
  const handleCardPayment = () => {
    dispatch(addCardSale(total))
    dispatch(clearCart())
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" height="80vh">
        {/* Parte Sinistra: Selezione e Prodotti */}
        <Box
          width="66%" // Equivale a 8/12 dello schermo
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p={2}
          borderRight="1px solid #ddd"
        >
          {/* Menu a tendina per selezionare lo spettacolo */}
          <Box mb={2}>
            <Typography variant="h5" mb={1}>
              Seleziona Spettacolo
            </Typography>
            <Select value={selectedShow} onChange={handleShowSelection} displayEmpty fullWidth>
              <MenuItem value="" disabled>
                Seleziona uno Spettacolo
              </MenuItem>
              {shows.map((show) => (
                <MenuItem key={show.id} value={show.id}>
                  {show.FEATURE} - {show.FEATURE_TIME}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Area scrollabile dei prodotti */}
          <Box
            flexGrow={1}
            overflow="auto"
            sx={{ border: '1px solid #ddd', borderRadius: '8px', p: 2 }}
          >
            <Grid container spacing={2}>
              {supplies.map((supply) => (
                <Grid item xs={6} sm={4} key={supply.codice}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleAddToCart(supply)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: 2
                    }}
                  >
                    {/* <img
                      src={supply.image || '/placeholder.png'}
                      alt={supply.supplyName}
                      style={{ maxWidth: '50px', marginBottom: '5px' }}
                    /> */}
                    {supply.supplyName}
                    <Typography variant="caption">€{supply.prezzo}</Typography>
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Totale */}
          <Box mt={2}>
            <Typography variant="h6">Totale: €{total.toFixed(2)}</Typography>
          </Box>
        </Box>

        {/* Parte Destra: Carrello e pulsanti di pagamento */}
        <Box
          width="34%" // Equivale a 4/12 dello schermo
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p={2}
        >
          {/* Pulsante per svuotare il carrello */}
          <Box mb={2}>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => dispatch(clearCart())}
              fullWidth
            >
              azzera scontrino
            </Button>
          </Box>

          {/* Area del carrello */}
          <Box
            flexGrow={1}
            sx={{ border: '1px solid #ddd', borderRadius: '8px', p: 2, overflowY: 'auto' }}
          >
            <Typography variant="h5" mb={1}>
              Scontrino
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {cart.length > 0 ? (
              <Box>
                {cart.map((item, index) => (
                  <>
                    <Box
                      key={index}
                      display="flex"
                      sx={{ backgroundColor: '#52be80', p: 1, borderRadius: '10px' }}
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography>{item.supplyName}</Typography>
                      <Typography>€{item.prezzo}</Typography>
                      <IconButton onClick={() => handleRemoveFromCart(item.codice)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Divider sx={{ mb: 1 }} />
                  </>
                ))}
              </Box>
            ) : (
              <Typography>nessun prodotto selezionato</Typography>
            )}
          </Box>

          {/* Pulsanti per il pagamento */}
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <Button variant="contained" color="success" onClick={handleCashPayment} fullWidth>
              Pagamento Contanti
            </Button>
            <Button variant="contained" onClick={handleCardPayment} color="secondary" fullWidth>
              Pagamento Carta di Credito
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default YumCart
