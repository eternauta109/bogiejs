import { useState, useEffect } from 'react'
import icoEye from '../assets/bigeye2.ico'
import { useNavigate } from 'react-router-dom'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import useEventsStore from '../store/EventDataContext'
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
      color="#3498DB"
      marginBottom="40px"
      borderRadius="5px"
      align="center"
      {...props}
      sx={{ bgcolor: '#3498DB', opacity: 0.9, width: '300px', fontSize: '10px' }}
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
  const { user, setUser } = useEventsStore()
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
    console.log('invio pign')
    const { managerFound, managersName } = await window.api.login({ userName, password })
    console.log('ritorno di login in login component:', { managerFound, managersName })
    if (managerFound.isAuth) {
      console.log('manager autorizzato')
      setUser({ managerFound, managersName })
    } else {
      openSnack()
      console.log('credenziali non corrette')
    }
  }

  const getPath = async () => {
    const pathApp = await window.api.getPath()
    console.log('appPath in login', pathApp)
  }

  useEffect(() => {
    console.log('user in login useeffect', user)
    getPath()
    if (user?.user.isAuth) {
      navigate('/calendar')
    }

    return () => {}
  }, [user])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #58D68D 0%, #3498DB  100%)',
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
          Big
        </Typography>

        <Typography
          component="h1"
          variant="h3"
          fontWeight="bold"
          sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
        >
          Eye
        </Typography>
      </Box>

      <Container
        component="main"
        maxWidth="xs"
        sx={{
          mt: 4,
          mb: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderRadius: 3,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
          padding: 4
        }}
      >
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
        <Box
          borderRadius={100}
          width={254}
          height={254}
          marginX="auto"
          mb={4}
          boxShadow="0px 4px 10px rgba(0, 0, 0, 0.25)"
        >
          <img
            src={icoEye}
            alt="icoEye"
            style={{ width: '100%', height: '100%', borderRadius: '50%' }}
          />
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
