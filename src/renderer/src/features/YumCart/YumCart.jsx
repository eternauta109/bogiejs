// src/components/YumCart.jsx
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import {
  Button,
  Container,
  Box,
  Typography,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Divider,
  TextField
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { addItem, removeItem, clearCart } from '../../store/reducers/cart'
import { addCashSale, addCardSale } from '../../store/reducers/sales'
import { addTransactionToDB } from '../../store/reducers/transactions'

const YumCart = () => {
  const [selectedShow, setSelectedShow] = useState('')
  const [attendance, setAttendance] = useState('')
  const dispatch = useDispatch()
  const shows = useSelector((state) => state.shows.selectedShows)
  const user = useSelector((state) => state.managers.user)
  const cart = useSelector((state) => state.cart.items)
  const total = useSelector((state) => state.cart.total)
  const supplies = useSelector((state) => state.supplies.supplies)

  // Gestisce la selezione dello spettacolo
  const handleShowSelection = (event) => {
    setSelectedShow(event.target.value)
  }

  // Aggiunge un prodotto al carrello
  const handleAddToCart = (supply) => {
    console.log(supply)
    if (!selectedShow || !attendance) return
    const showDetails = shows.find((show) => show.id === selectedShow)
    const newTransaction = {
      ...supply,
      user: user.userName,
      FEATURE: showDetails.PLAYLIST,
      FEATURE_TIME: showDetails.FEATURE_TIME,
      attendance: parseInt(attendance, 10),
      SHOW_TIME: showDetails.SHOW_TIME,
      salesId: 'sales-' + uuidv4(),
      transactionDate: format(new Date(), 'yyyy/MM/dd HH:mm:ss')
    }
    dispatch(addItem(newTransaction))
  }

  // Rimuove un prodotto dal carrello
  const handleRemoveFromCart = (id) => {
    console.log(id)
    dispatch(removeItem(id))
  }

  // Gestisce il pagamento
  const handlePayment = (paymentType) => {
    if (cart.length === 0) return
    const transactionId = 'trans-' + uuidv4()
    const newCart = cart.map((item) => ({
      ...item,
      transactionId,
      paymentType
    }))
    if (paymentType === 'cash') {
      dispatch(addCashSale(total))
    } else {
      dispatch(addCardSale(total))
    }
    dispatch(addTransactionToDB(newCart))
    dispatch(clearCart())
  }

  // Gestisce l'inserimento delle presenze
  const handleAttendanceChange = (event) => {
    const value = event.target.value
    if (/^\d{0,3}$/.test(value)) {
      setAttendance(value)
    }
  }

  // Controllo se i pulsanti devono essere abilitati o disabilitati
  const isSelectionComplete = selectedShow !== '' && attendance !== ''

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" height="80vh">
        {/* Parte Sinistra: Selezione e Prodotti */}
        <Box
          width="66%"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p={2}
          borderRight="1px solid #ddd"
        >
          {/* Menu a tendina per selezionare lo spettacolo */}
          <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
            <Box width="75%">
              <Typography variant="h5" mb={1}>
                Seleziona Spettacolo
              </Typography>
              <Select value={selectedShow} onChange={handleShowSelection} displayEmpty fullWidth>
                <MenuItem value="" disabled>
                  Seleziona uno Spettacolo
                </MenuItem>
                {shows.map((show) => (
                  <MenuItem key={show.id} value={show.id}>
                    {show.PLAYLIST} - {show.FEATURE_TIME}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Finestra per inserire le presenze */}
            <Box width="20%">
              <Typography variant="h6" mb={1}>
                Presenze
              </Typography>
              <TextField
                value={attendance}
                onChange={handleAttendanceChange}
                variant="outlined"
                size="small"
                type="number"
                inputProps={{ maxLength: 3, style: { textAlign: 'center' } }}
                fullWidth
              />
            </Box>
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
                    disabled={!isSelectionComplete}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: 2
                    }}
                  >
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
        <Box width="34%" display="flex" flexDirection="column" justifyContent="space-between" p={2}>
          {/* Pulsante per svuotare il carrello */}
          <Box mb={2}>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => dispatch(clearCart())}
              fullWidth
            >
              Azzera Scontrino
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
                {cart.map((item) => (
                  <Box key={item.salesId}>
                    <Box
                      display="flex"
                      sx={{ backgroundColor: '#52be80', p: 1, borderRadius: '10px' }}
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography>{item.supplyName}</Typography>
                      <Typography>€{item.prezzo}</Typography>
                      <IconButton onClick={() => handleRemoveFromCart(item.salesId)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Divider sx={{ mb: 1 }} />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography>Nessun prodotto selezionato</Typography>
            )}
          </Box>

          {/* Pulsanti per il pagamento */}
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <Button
              variant="contained"
              color="success"
              onClick={() => handlePayment('cash')}
              disabled={cart.length === 0}
              fullWidth
            >
              Pagamento Contanti
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handlePayment('card')}
              disabled={cart.length === 0}
              fullWidth
            >
              Pagamento Carta di Credito
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default YumCart
