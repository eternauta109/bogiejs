import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { Container, Box, Typography, Button, Divider } from '@mui/material'
import { clearCart } from '../../store/reducers/cart'
import { addCardSale, addCashSale } from '../../store/reducers/sales'
import { addTransactionToDB } from '../../store/reducers/transactions'
import ProductList from './ProductList'
import CartItem from './CartItem'
import PaymentDialog from './PaymentDialog'
import ShowSelection from './ShowSelection'

const YumCart = () => {
  const [selectedShow, setSelectedShow] = useState()
  const [attendance, setAttendance] = useState('')
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)

  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart.items)
  const total = useSelector((state) => state.cart.total)

  const handleOpenPaymentDialog = () => setIsPaymentDialogOpen(true)
  const handleClosePaymentDialog = () => setIsPaymentDialogOpen(false)

  const handlePayment = (payment) => {
    console.log(payment)
    if (cart.length === 0) return
    const transactionId = 'trans-' + uuidv4()
    const newCart = cart.map((item) => ({
      ...item,
      transactionId,
      paymentType: payment
    }))

    switch (payment) {
      case 'card':
        dispatch(addCardSale(total))
        break
      case 'cash':
        dispatch(addCashSale(total))
        break

      default:
        return
    }

    dispatch(addTransactionToDB(newCart))
    dispatch(clearCart())
  }

  useEffect(() => {
    return () => {
      dispatch(clearCart()) // Cancella il carrello quando il componente viene smontato
    }
  }, [dispatch])

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" height="80vh">
        {/* Parte Sinistra: Selezione dello spettacolo e Prodotti */}
        <Box
          width="66%"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p={2}
          borderRight="1px solid #ddd"
        >
          {/* Selezione dello Spettacolo */}
          <ShowSelection
            selectedShow={selectedShow}
            setSelectedShow={setSelectedShow}
            attendance={attendance}
            setAttendance={setAttendance}
          />

          {/* Lista dei prodotti */}
          <ProductList selectedShow={selectedShow} attendance={attendance} />

          {/* Totale */}
          <Box mt={2}>
            <Typography variant="h6">Totale: €{parseFloat(total).toFixed(2)}</Typography>
          </Box>
        </Box>

        {/* Parte Destra: Carrello e pulsanti di pagamento */}
        <Box width="34%" display="flex" flexDirection="column" justifyContent="space-between" p={2}>
          {/* Pulsante per svuotare il carrello */}
          <Box mb={2}>
            <Button
              variant="contained"
              color="error"
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
              cart.map((item) => <CartItem key={item.salesId} item={item} />)
            ) : (
              <Typography>Nessun prodotto selezionato</Typography>
            )}
          </Box>

          {/* Pulsanti per il pagamento */}
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <Button
              variant="contained"
              color="success"
              onClick={handleOpenPaymentDialog}
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

      {/* Dialog per il pagamento in contanti */}
      <PaymentDialog
        open={isPaymentDialogOpen}
        handleClose={handleClosePaymentDialog}
        total={total}
        handlePayment={handlePayment}
      />
    </Container>
  )
}

export default YumCart
