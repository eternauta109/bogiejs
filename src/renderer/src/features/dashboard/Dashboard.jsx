import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Container,
  Button,
  TextField,
  FormControl,
  ListItem,
  Stack,
  List,
  Select,
  IconButton,
  MenuItem,
  InputLabel,
  OutlinedInput,
  Card,
  CardContent
} from '@mui/material'
import { registerUser, fetchUsers } from '../../store/reducers/managers'
import { v4 as uuidv4 } from 'uuid'
import DeleteIcon from '@mui/icons-material/Delete'

const Dashboard = () => {
  const [newUser, setNewUser] = useState({
    userName: '',
    role: '',
    notification: [],
    password: '',
    isAuth: false,
    id: '',
    cinema: ''
  })
  const dispatch = useDispatch()
  const users = useSelector((state) => state.managers.managers) // Recupera gli utenti dal Redux state
  const user = useSelector((state) => state.managers.user) // L'utente loggato

  // Funzione per recuperare gli utenti, passando l'utente loggato come parametro
  const getUsers = async () => {
    if (user) {
      // Passa il parametro user alla funzione fetchUsers
      dispatch(fetchUsers(user))
    }
  }

  // Recupera tutti gli utenti all'avvio del componente
  useEffect(() => {
    getUsers()
  }, [dispatch, user]) // Viene chiamato ogni volta che il componente viene montato o quando cambia `user`

  const onHandleSubmit = async (e) => {
    e.preventDefault()
    const insertNewUser = {
      ...newUser,
      id: `manager-${uuidv4()}`,
      cinema: user.cinema
    }
    dispatch(registerUser(insertNewUser))
    // Resetta il form
    setNewUser({
      userName: '',
      role: '',
      notification: [],
      password: '',
      isAuth: false,
      id: '',
      cinema: ''
    })
  }

  const onHandleDeleteUser = async (e, manager) => {
    e.preventDefault()
    console.log(manager)
    const arrayNames = await window.api.deleteThisManager(manager)
    console.log('dashboard lista managers', arrayNames)
    // Dopo la cancellazione aggiorna la lista degli utenti
    getUsers() // Richiama `getUsers` dopo la cancellazione per aggiornare la lista
  }

  return (
    <Container sx={{ padding: 2, justifyContent: 'center' }}>
      <Card variant="outlined" sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Inserisci un Manager
          </Typography>
          <form onSubmit={onHandleSubmit}>
            <Stack spacing={2}>
              <TextField
                required
                label="Username"
                variant="outlined"
                name="userName"
                value={newUser.userName}
                onChange={(user) => setNewUser({ ...newUser, userName: user.target.value })}
                helperText="nome+iniziale cognome. Es marioc, francof, iolandar"
              />
              <FormControl required>
                <InputLabel id="role">Ruolo</InputLabel>
                <Select
                  labelId="role"
                  name="role"
                  input={<OutlinedInput label="role" />}
                  value={newUser.role}
                  onChange={(role) => setNewUser({ ...newUser, role: role.target.value })}
                >
                  <MenuItem value="manager">manager</MenuItem>
                  <MenuItem value="staff">staff</MenuItem>
                </Select>
              </FormControl>
              <TextField
                required
                label="PIN"
                variant="outlined"
                name="password"
                value={newUser.password}
                onChange={(psw) => setNewUser({ ...newUser, password: psw.target.value })}
                helperText="Consiglio: 4 cifre sono più che sufficienti"
              />
              <TextField disabled value={user?.cinema || ''} />
              <Button variant="outlined" type="submit" color="secondary">
                Inserisci user
              </Button>
            </Stack>
          </form>
          <Typography variant="h6" mt={4}>
            Manager Attivi
          </Typography>
          <List sx={{ overflowY: 'auto', maxHeight: 300 }}>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((manager, key) => (
                <ListItem
                  key={key}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => onHandleDeleteUser(e, manager)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <Box>
                    <Typography>{manager.userName}</Typography>
                    <TextField disabled value={manager.password} variant="filled" />
                  </Box>
                </ListItem>
              ))
            ) : (
              <Typography>Nessun manager trovato.</Typography>
            )}
          </List>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Dashboard
