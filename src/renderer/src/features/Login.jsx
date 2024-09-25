// Importazioni necessarie
import { useState, useEffect } from 'react'
import foodIco from '../assets/street-food-vendorpopcorn-kiosk-retro-600nw-2380868623.webp'
import { useNavigate } from 'react-router-dom'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

import { useSelector, useDispatch } from 'react-redux'
import { loginUser } from '../store/reducers/managers' // Importa l'azione per impostare l'utente
import {
  Container,
  Typography,
  Box,
  Link,
  TextField,
  Button,
  Avatar,
  Snackbar,
  Alert
} from '@mui/material'

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="#ba4a00 "
      marginBottom="40px"
      borderRadius="5px"
      align="center"
      {...props}
      sx={{ bgcolor: '#ba4a00 ', opacity: 0.9, width: '300px', fontSize: '10px' }}
    >
      {'Dev By  '}
      <Link color="inherit" href="#">
        Fabio Conti
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

export default function Login() {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [openSnackBar, setOpenSnackBar] = useState(false)

  // Ottieni lo stato e dispatch dallo store Redux
  const user = useSelector((state) => state.managers.user) // Assume che managerFound sia nello stato dei manager
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const openSnack = () => {
    setOpenSnackBar(true)
  }

  const closeSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackBar(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    // Chiama dispatch e attendi il completamento dell'azione asincrona
    const resultAction = await dispatch(loginUser({ userName, password }))
    console.log(resultAction)
    /* if (loginUser.fulfilled.match(resultAction)) {
      console.log('Utente autenticato con successo', resultAction.payload)
    } else {
      console.error('Errore durante l’autenticazione', resultAction.error)
      openSnack()
    } */
    /* try {
      // Chiamata IPC all'handler di Electron per autenticare l'utente
      const { managerFound, managersName } = await window.api.login({ userName, password })

      // Se l'autenticazione è riuscita, aggiorna lo store con l'utente autenticato
      if (managerFound.isAuth) {
        dispatch(setUser({ managerFound, managersName })) // Usa l'azione setUser dal managerSlice
        navigate('/calendar') // Naviga alla schermata del calendario
      } else {
        openSnack() // Mostra lo Snackbar per errore
      }
    } catch (error) {
      console.error('Errore durante l’autenticazione:', error)
      openSnack() // Mostra lo Snackbar in caso di errore
    } */
  }

  useEffect(() => {
    console.log('User nel useEffect del Login', user)

    // Redirige l'utente autenticato al calendario
    if (user?.isAuth) {
      console.log('qui autenticato', user)
      navigate('/landing')
    } else {
      openSnack()
    }
  }, [user, navigate])

  return (
    <Box
      sx={{
        width: '1200px',
        height: '750px',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f39c12 0%, #ba4a00 100%)',
        color: 'white'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Typography
          component="h1"
          variant="h3"
          fontWeight="bold"
          sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
        >
          Bogie
        </Typography>
      </Box>

      <Container
        component="main"
        maxWidth="md"
        sx={{
          mt: 4,
          mb: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderRadius: 3,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
          padding: 4,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box>
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: '#3498DB' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" color="primary">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                sx={{ input: { backgroundColor: 'white' } }}
                id="userName"
                onChange={(e) => setUserName(e.target.value)}
                label="Username"
                name="userName"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                sx={{ input: { backgroundColor: 'white' } }}
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: '#3498DB',
                  '&:hover': {
                    backgroundColor: '#2575fc'
                  },
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)'
                }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Box>
        <Box>
          <Box
            borderRadius={100}
            width={254}
            height={254}
            marginX="auto"
            mb={4}
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
          >
            <Avatar
              src={foodIco}
              alt="icoEye"
              style={{ width: '100%', height: '100%', borderRadius: '50%' }}
            />
          </Box>
        </Box>
      </Container>
      <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={closeSnack}>
        <Alert onClose={closeSnack} severity="warning" variant="filled" sx={{ width: '100%' }}>
          Errore! Ricontrolla username e password.
        </Alert>
      </Snackbar>

      <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'center' }}>
        <Copyright />
      </Box>
    </Box>
  )
}
