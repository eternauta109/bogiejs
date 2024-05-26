import { useState } from 'react'

import ModalEvent from '../event/ModalEvent'

import { Container, Grid, Switch, Button, FormGroup, FormControlLabel } from '@mui/material'
import SchedulerComponent from '../scheduler/SchedulerComponent'
import MyCalendar from './MyCalendar'

const roundButtonStyle = {
  borderRadius: '10%',
  width: '100px',
  height: '60px',
  margin: '20px',
  minWidth: 'unset',
  backgroundColor: '#689F38' // Aggiungi il colore rosso al background
}

const ShareCalendar = () => {
  const [openNewEvent, setOpenNewEvent] = useState(false)
  const [upDate, setUpDate] = useState(false)
  const [checked, setChecked] = useState(false) //stato dello swith per visualizzare calendar/scheduler

  const handleOpenNewEvent = () => {
    setUpDate(false)
    setOpenNewEvent(true)
    // Imposta upDate a false quando viene aperto il modal
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
  //^^^

  const handleCloseNewEvent = () => setOpenNewEvent(false)

  return (
    <Container maxWidth="xl" style={{ maxHeight: '900px' }}>
      <Grid container spacing={1} alignItems="center" justifyContent="center">
        <Grid item xs={12} md={11}>
          {!checked ? (
            <MyCalendar handleOpen={handleOpenOldEvent} />
          ) : (
            <SchedulerComponent handleOpen={handleOpenOldEvent} />
          )}
        </Grid>
        <Grid item xs={12} md={1}>
          <Button variant="contained" style={roundButtonStyle} onClick={handleOpenNewEvent}>
            Add ITEM
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
              label="scheduler"
            />
          </FormGroup>
        </Grid>
      </Grid>

      <ModalEvent open={openNewEvent} handleClose={handleCloseNewEvent} upDate={upDate} />
    </Container>
  )
}

export default ShareCalendar
