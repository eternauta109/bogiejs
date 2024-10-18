// src/components/Landing.jsx

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
import MovieIcon from '@mui/icons-material/Movie'
import RollerShadesClosed from '@mui/icons-material/RollerShadesClosed'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Landing = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.managers.user)

  // Funzioni di navigazione per ogni opzione
  const handleStartCashRegister = () => {
    navigate('/yumcart')
  }

  const handleManageProducts = () => {
    navigate('/manage-products')
  }

  const handleLoadBogie = () => {
    navigate('/supplies')
  }

  const handleLoadMovie = () => {
    navigate('/loader')
  }

  const handleAnalisys = () => {
    navigate('/transactionAnalisys')
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
          Benvenuto nel Sistema YumTrek
        </Typography>
        <Typography variant="h6" color="textSecondary">
          cosa vuoi fare?
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
                inizia la fase di vendita dopo aver caricato lo yumtrek
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
        {(user.role === 'tm' || user.role === 'manager') && (
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
        )}

        {/* Card per "Caricare il YumTrek" */}
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
                Carica YumTrek
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Carica il tuo YumTrek con nuovi prodotti
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
                Carica YumTrek
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Card per "Caricare i shows" */}
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
              <MovieIcon
                sx={{
                  fontSize: 60,
                  color: '#c39bd3',
                  transition: 'color 0.3s',
                  '&:hover': { color: '#af7ac5' }
                }}
              />
              <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
                Carica i shows
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Carica i spettacoli di oggi in cui entrerà lo yumtrek
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                variant="contained"
                onClick={handleLoadMovie}
                sx={{
                  backgroundColor: '#c39bd3',
                  '&:hover': { backgroundColor: '#af7ac5', transform: 'scale(1.02)' }
                }}
              >
                Carica YumTrek
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Card per "analisys trans" */}
        {(user.role === 'tm' || user.role === 'manager') && (
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
                <RollerShadesClosed
                  sx={{
                    fontSize: 60,
                    color: '#bdc3c7',
                    transition: 'color 0.3s',
                    '&:hover': { color: '#a6acaf' }
                  }}
                />
                <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
                  Chiusura YumTrek
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Qui fai i conteggi di yum trek e scarichi le transazioni, frai gli storni etc
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleAnalisys}
                  sx={{
                    backgroundColor: '#bdc3c7',
                    '&:hover': { backgroundColor: '#a6acaf', transform: 'scale(1.02)' }
                  }}
                >
                  Chiudi Cassa
                </Button>
              </CardActions>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

export default Landing
