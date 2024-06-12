import { useState, useMemo, useEffect } from 'react'
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
  Tabs,
  Tab,
  Card,
  CardContent
} from '@mui/material'
import useEventsStore from '../../store/EventDataContext'
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
  const [managersList, setManagersList] = useState([])
  const [optionsState, setOptionsState] = useState({})
  const [newOpts, setNewOpts] = useState('')
  const [tabValue, setTabValue] = useState(0)

  const { user, setUsersName } = useEventsStore()

  const onHandleSubmit = async (e) => {
    e.preventDefault()
    const insertNewUser = {
      ...newUser,
      id: `manager-${uuidv4()}`,
      cinema: user.user.cinema
    }
    console.log('onHandleSubmit new manager', insertNewUser)
    const cinemaNamesReturn = await window.api.addNewUser(insertNewUser)
    console.log('nominativi di ritorno in dashboard', cinemaNamesReturn)
    setManagersList([...cinemaNamesReturn])
    setUsersName(cinemaNamesReturn)
    // Reset newUser state to prevent uncontrolled input warning
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

  useMemo(() => {
    console.log('user modificato', newUser)
  }, [newUser])

  const awaytGetAllManagers = async () => {
    const managersList = await window.api.getAllManagers(user)
    console.log('dashboard lista managers', managersList)
    setManagersList([...managersList])
  }

  const awaytGetAllOptions = async () => {
    const options = await window.api.getOptions()
    console.log('options in dashboard', options)
    setOptionsState({ ...options })
  }

  const onAddOptions = async (e, tipo) => {
    e.preventDefault()
    console.log(newOpts, tipo)
    const updatedOptions = await window.api.addOption({ tipo, value: newOpts })
    setOptionsState({ ...optionsState, [tipo]: updatedOptions })
    setNewOpts('')
  }

  const onHandleDeleteUser = async (e, manager) => {
    e.preventDefault()
    console.log(manager)
    const arrayNames = await window.api.deleteThisManager(manager)
    console.log('dashboard lista managers', arrayNames)
    setManagersList([...arrayNames])
    setUsersName(arrayNames)
  }

  useEffect(() => {
    awaytGetAllManagers()
    awaytGetAllOptions()
    console.log('useEffect')
  }, [managersList.length])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <Container sx={{ padding: 2, justifyContent: 'center' }}>
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Gestione Manager" />
        <Tab label="Opzioni" />
      </Tabs>
      {tabValue === 0 && (
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
                    <MenuItem value="">none</MenuItem>
                    <MenuItem value="am">am</MenuItem>
                    <MenuItem value="jm">jm</MenuItem>
                    <MenuItem value="tl">tl</MenuItem>
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
                <TextField disabled label="Cinema" value={user.user.cinema} />
                <Button variant="outlined" type="submit" color="secondary">
                  Inserisci user
                </Button>
              </Stack>
            </form>
            <Typography variant="h6" mt={4}>
              Manager Attivi
            </Typography>
            <List sx={{ overflowY: 'auto', maxHeight: 300 }}>
              {managersList?.map((manager, key) => (
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
              ))}
            </List>
          </CardContent>
        </Card>
      )}
      {tabValue === 1 && (
        <Card variant="outlined" sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Opzioni
            </Typography>
            <Stack spacing={5} direction="row" sx={{ justifyContent: 'center' }}>
              <Box component="form" noValidate onSubmit={(e) => onAddOptions(e, 'topicType')}>
                <Stack sx={{ width: 300, height: 300 }}>
                  <Typography>Argomenti Topic</Typography>
                  <List sx={{ overflowY: 'auto' }}>
                    {optionsState?.topicType?.map((topic, key) => (
                      <ListItem
                        sx={{ mt: 2 }}
                        key={key}
                        secondaryAction={
                          <IconButton edge="end" aria-label="delete">
                            <Typography>{topic.value}</Typography>
                            <DeleteIcon />
                          </IconButton>
                        }
                      />
                    ))}
                  </List>
                  <Stack direction={'row'}>
                    <TextField
                      sx={{ width: 300 }}
                      value={newOpts}
                      onChange={(e) => setNewOpts(e.target.value)}
                    />
                    <Button type="submit">Add</Button>
                  </Stack>
                </Stack>
              </Box>
              <Box>
                <Stack sx={{ width: 300 }}>
                  <Typography>Tipi di Documenti</Typography>
                  <Stack sx={{ overflowY: 'auto' }}>
                    {optionsState?.docTypes?.map((doc, key) => (
                      <ListItem
                        sx={{ mt: 2 }}
                        key={key}
                        secondaryAction={
                          <IconButton edge="end" aria-label="delete">
                            <Typography>{doc.value}</Typography>
                            <DeleteIcon />
                          </IconButton>
                        }
                      />
                    ))}
                  </Stack>
                  <Stack direction={'row'}>
                    <TextField
                      sx={{ width: 300 }}
                      value={newOpts}
                      onChange={(e) => setNewOpts(e.target.value)}
                    />
                    <Button onClick={(e) => onAddOptions(e, 'docTypes')}>Add</Button>
                  </Stack>
                </Stack>
              </Box>
              <Box>
                <Stack sx={{ width: 300, height: 300 }}>
                  <Typography>Reparti</Typography>
                  <List sx={{ overflowY: 'auto' }}>
                    {optionsState?.divisions?.map((doc, key) => (
                      <ListItem
                        sx={{ mt: 2 }}
                        key={key}
                        secondaryAction={
                          <IconButton edge="end" aria-label="delete">
                            <Typography>{doc.nameDivision}</Typography>
                            <DeleteIcon />
                          </IconButton>
                        }
                      />
                    ))}
                  </List>
                  <Stack direction={'row'}>
                    <TextField
                      sx={{ width: 300 }}
                      value={newOpts}
                      onChange={(e) => setNewOpts(e.target.value)}
                    />
                    <Button onClick={(e) => onAddOptions(e, 'divisions')}>Add</Button>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Container>
  )
}

export default Dashboard
