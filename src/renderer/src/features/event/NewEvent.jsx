import { useState, useEffect } from 'react'
import ToggleEvent from './ToggleEvent'
import { v4 as uuidv4 } from 'uuid'

import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker'
import '@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css'
import 'react-calendar/dist/Calendar.css'
import 'react-clock/dist/Clock.css'

import {
  Typography,
  Container,
  InputLabel,
  MenuItem,
  FormControl,
  Button,
  OutlinedInput,
  Select,
  TextField
} from '@mui/material'

//queste sono le funzioni che bho messo dentro i reducer che
// vanno a lavorare con il db Level

import useEventsStore from '../../store/EventDataContext'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

// eslint-disable-next-line react/prop-types
function NewEvent({ handleClose, upDate }) {
  const [dateRange, setDateRange] = useState([new Date(), new Date()])
  const [optionsState, setOptionsState] = useState({})
  const {
    addTask,
    addEvent,
    eventToUpdate,
    totalEvent,
    totalTasks,
    upDateEvent,
    emptyEvent,
    initEvent,
    deleteEvent,
    user
  } = useEventsStore()

  const [event, setEvent] = useState(upDate ? { ...eventToUpdate } : { ...emptyEvent })

  const options = async () => {
    const getOpt = await window.api.getOptions()
    console.log(getOpt)
    setOptionsState({ ...getOpt })
    return getOpt
  }

  //funzione di submit. qua succedono un sacco di cose.
  //primo: se event è nuov lo aggiungo sia sllo store EDC che al db
  //se è solo da aggiornare aggiorno lo store e il db senza aumentare totalEvents
  //devo fare lo stesso con le tasks
  const onSubmit = async (e) => {
    e.preventDefault()
    if (upDate) {
      upDateEvent(event, event.id)
      handleClose()
      await window.api.addNewEvent(event, totalEvent)
    } else {
      if (event.manager !== '') {
        const newTask = {
          id: 'task-' + uuidv4(),
          createdBy: user.user.userName,
          title: event.title,
          start: new Date(),
          cinema: user.user.cinema,
          manager: event.manager,
          description: event.description,
          label: user.user.userName,
          laneId: `lane-${event.manager}`
        }
        addTask(newTask)
        await window.api.addNewTask({ task: newTask, totalTasks })
      }
      const prepareEvent = {
        ...event,
        cinema: user.user.cinema,
        createdBy: user.user.userName,
        id: 'event-' + uuidv4()
      }
      addEvent(prepareEvent)
      initEvent()
      handleClose()
      await window.api.addNewEvent({ event: prepareEvent, totalEvent })
    }
  }

  //questa funzione andra a cancellare l'event. qui upDate deve essere sicuramente true,
  // e poi devo passare event.id per andare a cancellare l'evento
  //sia dallo store che dal db
  const onDelete = async (e, idToCancel) => {
    e.preventDefault()
    deleteEvent(idToCancel)
    handleClose()
    await window.api.removeEvent(idToCancel)
  }

  //gestisco i cambiamenti del valore della divsions e aggiorno sia
  // lo stato che il colore relativo
  const handleDivisionChange = (e) => {
    console.log('selected div', e.target.value)
    const division = optionsState?.divisions?.find(
      (division) => division.nameDivision === e.target.value
    )
    console.log('selected divobj', division)
    setEvent({
      ...event,
      division: e.target.value,
      colorDivision: division.color
    })
  }

  //funzione che stampa event a pogni modifica
  /* useMemo(() => console.log("useMemo newEvent", event), [event]); */

  useEffect(() => {
    console.log('UPDATE', upDate)
    options()
    console.log('user in new events useeffect', user)
    if (upDate) {
      console.log('evento.id esistente questo è l evento da aggiornare', event)
    }

    return () => {
      initEvent()
    }
  }, [])

  return (
    <Container
      sx={{
        height: '600px',
        padding: 2,

        mb: 2,
        overflowY: 'auto'
      }}
    >
      {!upDate && (
        <Typography variant="h4" sx={{ mb: 1 }}>
          New Event
        </Typography>
      )}
      {upDate && (
        <Button
          variant="outlined"
          sx={{ m: 2 }}
          onClick={() => {
            handleClose()
            initEvent()
          }}
        >
          exit without save
        </Button>
      )}
      <form onSubmit={onSubmit}>
        <ToggleEvent setEventType={setEvent} event={event} />

        <TextField
          fullWidth
          label="eventType"
          disabled
          value={event?.eventType ? event.eventType : ''}
          name="eventType"
          sx={{ mb: 2 }}
        />
        {upDate && (
          <TextField
            fullWidth
            label="created by"
            disabled
            value={event?.createdBy ? event.createdBy : ''}
            name="createdBy"
            sx={{ mb: 2 }}
          />
        )}

        <TextField
          required
          fullWidth
          label="title"
          variant="outlined"
          value={event?.title ? event.title : ''}
          name="title"
          sx={{ mb: 2 }}
          onChange={(e) => setEvent({ ...event, title: e.target.value })}
        />

        <TextField
          fullWidth
          label="Describe event"
          variant="filled"
          multiline
          value={event?.description ? event.description : ''}
          name="description"
          rows={4}
          sx={{ mb: 2 }}
          onChange={(e) => setEvent({ ...event, description: e.target.value })}
        />

        <DateTimeRangePicker
          onChange={(newDateRange) => {
            setDateRange(newDateRange)
            console.log(newDateRange)
            setEvent({
              ...event,
              start: newDateRange[0],
              end: newDateRange[1]
            })
          }}
          value={upDate ? [event.start, event.end] : dateRange}
        />

        {optionsState?.divisions && (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="division">Division</InputLabel>
            <Select
              labelId="division"
              name="division"
              input={<OutlinedInput label="division" />}
              id="demo-simple-select"
              value={event?.division ? event.division : ''}
              onChange={(e) => handleDivisionChange(e)}
              fullWidth
            >
              <MenuItem value={''}>none</MenuItem>
              {optionsState?.divisions?.map((division, key) => (
                <MenuItem value={division.nameDivision} key={key}>
                  {division.nameDivision}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <TextField
          fullWidth
          label="link egnyte"
          variant="outlined"
          size="small"
          name="egnyte"
          value={event?.link ? event.link : ''}
          onChange={(link) => setEvent({ ...event, link: link.target.value })}
          rows={1}
          sx={{ mt: 2, mb: 2 }}
        />
        <TextField
          fullWidth
          label="some note"
          variant="outlined"
          multiline
          name="note"
          value={event?.note ? event.note : ''}
          onChange={(note) => setEvent({ ...event, note: note.target.value })}
          rows={4}
          sx={{ mt: 2, mb: 2 }}
        />

        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel id="owner">person in charge</InputLabel>
          <Select
            fullWidth
            labelId="owner"
            value={event?.manager ? event.manager : ''}
            onChange={(manager) => setEvent({ ...event, manager: manager.target.value })}
            MenuProps={MenuProps}
            input={<OutlinedInput label="assign this task to.." />}
          >
            <MenuItem value="">None</MenuItem>
            {user?.managersName.map((el, key) => (
              <MenuItem key={key} value={el}>
                {el}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/*  
        <FormControl fullWidth sx={{ mt: 2, maxWidth: 400 }}>
          <InputLabel id="cinemaInvolved">Cinema involved </InputLabel>
          <Select
            multiple
            labelId="cinemaInvolved"
            multiline
            value={cinemaSelect}
            onChange={handleChangeCinema}
            MenuProps={MenuProps}
            input={<OutlinedInput label="Cinema involved" />}
          >
            {cinemaDB.map((el, key) => (
              <MenuItem
                key={key}
                value={el.name}
                style={getStyles(el.name, cinemaSelect, theme)}
              >
                {el.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        
         */}

        <Button fullWidth variant="outlined" type="submit" color="secondary">
          {upDate ? 'updates' : 'save'}
        </Button>
        {upDate && (
          <Button
            variant="contained"
            color="error"
            sx={{ mt: 4 }}
            onClick={(e) => {
              onDelete(e, event.id)
            }}
          >
            Delete This Event
          </Button>
        )}
      </form>
    </Container>
  )
}

export default NewEvent
