// src/components/Landing.jsx
import React from 'react'
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import EditIcon from '@mui/icons-material/Edit'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const navigate = useNavigate()

  // Funzioni di navigazione per ogni opzione
  const handleStartCashRegister = () => {
    navigate('/cash-register')
  }

  const handleManageProducts = () => {
    navigate('/manage-products')
  }

  const handleLoadBogie = () => {
    navigate('/load-bogie')
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          sx={{ color: '#ba4a00', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
        >
          Benvenuto nel Sistema Bogie
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Seleziona un'azione da eseguire
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Card per "Avviare la cassa" */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              boxShadow: 5,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)'
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <PointOfSaleIcon
                sx={{
                  fontSize: 60,
                  color: '#3498DB',
                  transition: 'color 0.3s',
                  '&:hover': { color: '#2575fc' }
                }}
              />
              <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
                Avvia la Cassa
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Gestisci le vendite e le transazioni
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                variant="contained"
                onClick={handleStartCashRegister}
                sx={{
                  backgroundColor: '#3498DB',
                  '&:hover': { backgroundColor: '#2575fc', transform: 'scale(1.02)' }
                }}
              >
                Avvia Cassa
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Card per "Aggiungere/modificare prodotti" */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              boxShadow: 5,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)'
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <EditIcon
                sx={{
                  fontSize: 60,
                  color: '#e67e22',
                  transition: 'color 0.3s',
                  '&:hover': { color: '#d35400' }
                }}
              />
              <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
                Gestisci Prodotti
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Aggiungi o modifica i prodotti disponibili
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                variant="contained"
                onClick={handleManageProducts}
                sx={{
                  backgroundColor: '#e67e22',
                  '&:hover': { backgroundColor: '#d35400', transform: 'scale(1.02)' }
                }}
              >
                Gestisci Prodotti
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Card per "Caricare il Bogie" */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              boxShadow: 5,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)'
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <LocalShippingIcon
                sx={{
                  fontSize: 60,
                  color: '#16a085',
                  transition: 'color 0.3s',
                  '&:hover': { color: '#1abc9c' }
                }}
              />
              <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
                Carica il Bogie
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Carica il tuo Bogie con nuovi prodotti
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                variant="contained"
                onClick={handleLoadBogie}
                sx={{
                  backgroundColor: '#16a085',
                  '&:hover': { backgroundColor: '#1abc9c', transform: 'scale(1.02)' }
                }}
              >
                Carica Bogie
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Landing
