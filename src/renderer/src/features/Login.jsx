import { useState, useEffect } from 'react'
import icoEye from '../assets/bigeye2.ico'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import useEventsStore from '../store/EventDataContext'
import { Container, Typography, Box, Link, TextField, Button, Avatar } from '@mui/material'

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="white"
      marginBottom="40px"
      borderRadius="5px"
      align="center"
      {...props}
      sx={{ bgcolor: 'white', opacity: 0.9, width: '300px', fontSize: '10px' }}
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

  const { user, setUser } = useEventsStore()
  const navigate = useNavigate()

  const theme = useTheme()

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log('invio pign')
    const { managerFound, managersName } = await window.api.login({ userName, password })

    console.log('ritorno di login in login component:', { managerFound, managersName })

    if (managerFound.isAuth) {
      console.log('manager autorizzato')
      setUser({ managerFound, managersName })
    } else {
      /* alert('credenziali non corrette') */
      console.log('credenziali non corrette')
    }
  }

  const getPath = async () => {
    const pathApp = await window.api.getPath()
    console.log('appPath in login', pathApp)
  }

  useEffect(() => {
    console.log('user in login useffect', user)
    getPath()
    if (user?.user.isAuth) {
      navigate('/calendar')
    }

    return () => {}
  }, [user])

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Typography component="h1" variant="h3" color="secondary" fontWeight="bold">
          Big
        </Typography>

        <Typography component="h1" variant="h3" color="secondary" fontWeight="bold">
          Eye
        </Typography>
      </Box>

      <Container component="main" maxWidth="xs" sx={theme.formStyle}>
        <Box
          sx={{
            mb: '100px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
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
              label="user"
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
              type="password" /* {showPassword ? "text" : "password"} */
              id="password"
              autoComplete="current-password"
            />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
          </Box>
        </Box>
        <Box borderRadius={100} width={254} height={254} marginX="auto">
          <img
            src={icoEye}
            alt="icoEye"
            style={{ width: '100%', height: '100%', borderRadius: '5%' }}
          />
        </Box>
      </Container>

      <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'center' }}>
        <Copyright />
      </Box>
    </Box>
  )
}
