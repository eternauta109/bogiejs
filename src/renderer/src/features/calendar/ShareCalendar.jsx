import { useState } from 'react'

import ModalEvent from '../event/ModalEvent'
import useEventsStore from '../../store/EventDataContext'
import { Container, Grid, Switch, Button, FormGroup, FormControlLabel } from '@mui/material'
import SchedulerComponent from '../scheduler/SchedulerComponent'
import MyCalendar from './MyCalendar'
import './calendar.css'
import Filter from './Filter'

const roundButtonStyle = {
  borderRadius: '10%',
  width: '100px',
  height: '60px',
  marginBottom: '20px',
  minWidth: 'unset',
  backgroundColor: '#689F38' // Aggiungi il colore rosso al background
}

const ShareCalendar = () => {
  const [openNewEvent, setOpenNewEvent] = useState(false)
  const [ricorency, setRicorency] = useState(false)
  const [upDate, setUpDate] = useState(false)
  const [checked, setChecked] = useState(false) //stato dello swith per visualizzare calendar/scheduler
  const { initEvent } = useEventsStore()

  const handleOpenNewEvent = () => {
    setUpDate(false)
    setRicorency(false)
    setOpenNewEvent(true)
    // Imposta upDate a false quando viene aperto il modal
  }

  const handleOpenRicorencyEvent = () => {
    setUpDate(false)
    setRicorency(true)
    setOpenNewEvent(true)
  }

  const handleOpenOldEvent = () => {
    setUpDate(true)
    setOpenNewEvent(true)
    // Imposta upDate a false quando viene aperto il modal
  }

  //funzione per swithciare visualizzazione
  // tra scheduler e calendar
  const handleChange = (event) => {
    setChecked(event.target.checked)
  }

  const handleCloseNewEvent = () => {
    initEvent()
    setOpenNewEvent(false)
  }

  return (
    <Container maxWidth="xl" style={{ width: '100%', height: '100vh' }}>
      <Grid container spacing={1} alignItems="center" justifyContent="start">
        <Grid item xs={12} md={1}>
          <Button
            variant="contained"
            style={roundButtonStyle}
            onClick={handleOpenNewEvent}
            sx={{
              p: 5,
              '&:hover': {
                backgroundColor: 'darkred !important'
              }
            }}
          >
            Aggiungi Singola Attività
          </Button>

          <Button
            variant="contained"
            style={roundButtonStyle}
            onClick={handleOpenRicorencyEvent}
            sx={{
              p: 5,
              backgroundColor: 'teal !important', // Imposta il colore di sfondo a rosso
              '&:hover': {
                backgroundColor: 'darkred !important' // Colore di sfondo durante l'hover
              }
            }}
          >
            Aggiungi Attività Ricorrente
          </Button>

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={checked}
                  onChange={handleChange}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              labelPlacement="top"
              label="scheduler"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12} md={10}>
          {!checked ? (
            <MyCalendar handleOpen={handleOpenOldEvent} setRicorency={setRicorency} />
          ) : (
            <SchedulerComponent handleOpen={handleOpenOldEvent} />
          )}
        </Grid>
        <Grid item xs={12} md={1}>
          <Filter />
        </Grid>
      </Grid>

      <ModalEvent
        open={openNewEvent}
        handleClose={handleCloseNewEvent}
        upDate={upDate}
        ricorency={ricorency}
      />
    </Container>
  )
}

export default ShareCalendar
