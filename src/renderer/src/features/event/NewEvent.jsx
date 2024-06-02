import { useEffect, useCallback } from 'react'
import ToggleEvent from './ToggleEvent'
import { v4 as uuidv4 } from 'uuid'
import ClassicEvent from './eventType/ClassicEvent'
import MattineEvent from './eventType/MattineEvent'

import '@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css'
import 'react-calendar/dist/Calendar.css'
import 'react-clock/dist/Clock.css'

import {
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
import Prevendite from './eventType/Prevendite'
import Promo from './eventType/Promo'
import Compleanni from './eventType/Compleanni'
import Extra from './eventType/Extra'
import Delivery from './eventType/Delivery'
import Anteprima from './eventType/Anteprima'
import Maratona from './eventType/Maratona'
import Visita from './eventType/Visita'
import Stampa from './eventType/Stampa'
import Sopraluogo from './eventType/Sopraluogo'
import Meeting from './eventType/Meeting'

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
  const {
    event,
    setFieldEvent,
    addTask,
    addEvent,
    setOptions,
    totalEvents,
    totalTasks,
    upDateEvent,

    initEvent,
    deleteEvent,
    user
  } = useEventsStore()

  const options = async () => {
    const getOpt = await window.api.getOptions()
    console.log('newEvent: options: getOptions:', getOpt)
    setOptions(getOpt)
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
      await window.api.addNewEvent({ event, totalEvents })
    } else {
      if (event.manager !== '') {
        const newTask = {
          id: 'task-' + uuidv4(),
          role: user.user.role,
          area: user.user.area,
          createdBy: user.user.userName,
          title: event.title,
          start: new Date(),
          cinema: user.user.cinema,
          manager: event.manager,
          description: event.description,
          label: user.user.userName,
          status: 'newtask'
        }
        addTask(newTask)
        await window.api.addNewTask({ task: newTask, totalTasks, upDate: true })
      }
      const prepareEvent = {
        ...event,
        cinema: user.user.cinema,
        role: user.user.role,
        area: user.user.area,
        createdBy: user.user.userName,
        id: 'event-' + uuidv4()
      }
      addEvent(prepareEvent)
      initEvent()
      handleClose()
      await window.api.addNewEvent({ event: prepareEvent, totalEvents })
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

  const RenderEventType = useCallback(() => {
    console.log('event in Render: ', event)
    switch (event.eventType) {
      case 'prevendite':
        return <Prevendite />
      case 'promo':
        return <Promo />
      case 'compleanni':
        return <Compleanni />
      case 'delivery':
        return <Delivery />
      case 'extra':
        return <Extra />
      case 'anteprima':
        return <Anteprima />
      case 'maratona':
        return <Maratona />
      case 'visita':
        return <Visita />
      case 'stampa':
        return <Stampa />
      case 'sopraluogo':
        return <Sopraluogo />
      case 'meeting':
        return <Meeting />
      case 'matineè':
        return <MattineEvent />
      default:
        return <ClassicEvent upDate={upDate} />
    }
  }, [event.eventType])

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
  }, [user.managersName.length])

  return (
    <Container
      sx={{
        height: '600px',
        padding: 2,

        mb: 2,
        overflowY: 'auto'
      }}
    >
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
        <ToggleEvent />

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

        <RenderEventType />
        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel id="owner">person in charge</InputLabel>
          <Select
            fullWidth
            labelId="owner"
            value={event?.manager ? event.manager : ''}
            onChange={(manager) =>
              setFieldEvent({ campo: 'manager', valore: manager.target.value })
            }
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
