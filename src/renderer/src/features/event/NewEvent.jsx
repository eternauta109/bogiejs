import { useEffect, useCallback } from 'react'
import ToggleEvent from './ToggleEvent'
import { v4 as uuidv4 } from 'uuid'
import '@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css'
import 'react-calendar/dist/Calendar.css'
import 'react-clock/dist/Clock.css'

import {
  Container,
  InputLabel,
  MenuItem,
  FormControl,
  Button,
  Box,
  OutlinedInput,
  Select,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material'

import useEventsStore from '../../store/EventDataContext'

import ClassicEvent from './eventType/ClassicEvent'
import MattineEvent from './eventType/MattineEvent'
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
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import SubAction from './eventType/serviceEventType/SubAction'
import Manutenzione from './eventType/Manutenzione'
import Default from './eventType/Default'

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
    events,
    setFieldEvent,
    addTask,
    totalEvents,
    setOptions,
    totalTasks,
    upDateEvent,
    setEvents,
    initEvent,
    deleteEvent,
    user,
    options
  } = useEventsStore()

  const getOptions = async () => {
    console.log('getOptions triggerato')
    try {
      const getOpt = await window.api.getOptions()
      console.log('newEvent: options: getOptions:', getOpt)
      setOptions(getOpt)
    } catch (error) {
      console.error('NewEvent: getOptions: Error fetching getOptions:', error)
    }
  }

  //funzione di submit. qua succedono un sacco di cose.
  //primo: se event è nuov lo aggiungo sia sllo store EDC che al db
  //se è solo da aggiornare aggiorno lo store e il db senza aumentare totalEvents
  //devo fare lo stesso con le tasks
  const onSubmit = async (e) => {
    e.preventDefault()

    if (upDate) {
      if (event.manager) {
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
          subAction: event.subAction ? event.subAction : [],
          status: 'newtask'
        }

        try {
          await window.api.addNewTask({ task: newTask, totalTasks, upDate: true })
          addTask(newTask)
        } catch (error) {
          console.error('NewEvent: onSubmitNewEvent: Error fetching upDate task:', error)
        }
      }

      try {
        await window.api.addNewEvent({ event, totalEvents })
        upDateEvent(event, event.id)
      } catch (error) {
        console.error('NewEvent: onSubmitNewEvent: Error fetching upDate event:', error)
      }
      handleClose()
    } else {
      if (event.manager) {
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
          subAction: event.subAction ? event.subAction : [],
          status: 'newtask'
        }

        try {
          await window.api.addNewTask({ task: newTask, totalTasks, upDate: true })
          addTask(newTask)
        } catch (error) {
          console.error('NewEvent: onSubmitNewEvent: Error fetching new task:', error)
        }
      }

      const prepareEvent = {
        ...event,
        cinema: user.user.cinema,
        role: user.user.role,
        area: user.user.area,
        createdBy: user.user.userName,
        id: 'event-' + uuidv4()
      }

      try {
        await window.api.addNewEvent({ event: prepareEvent, totalEvents })
        setEvents({ events: [...events, prepareEvent], totalEvents })
      } catch (error) {
        console.error('NewEvent: onSubmitNewEvent: Error fetching new event:', error)
      }

      if (event.eventType === 'prevendite') {
        await insertDuble()
      }

      handleClose()
    }
  }

  const insertDuble = async () => {
    console.log('lancia!!!')
    const dobleEvent = {
      ...event,
      cinema: user.user.cinema,
      role: user.user.role,
      area: user.user.area,
      createdBy: user.user.userName,
      start: event.startOpen,
      surrogato: true,
      end: event.endOpen,
      id: 'event-' + uuidv4()
    }

    try {
      await window.api.addNewEvent({ event: dobleEvent, totalEvents })
      setEvents({ events: [...events, dobleEvent], totalEvents })
    } catch (error) {
      console.error('NewEvent: onSubmitNewEvent: Error fetching insertDouble event:', error)
    }
  }

  //questa funzione andra a cancellare l'event. qui upDate deve essere sicuramente true,
  // e poi devo passare event.id per andare a cancellare l'evento
  //sia dallo store che dal db
  const onDelete = async (e, idToCancel) => {
    e.preventDefault()
    try {
      await window.api.removeEvent(idToCancel)
      deleteEvent(idToCancel)
    } catch (error) {
      console.error('NewEvent: onDelete new event: Error fetching delete event:', error)
    }
    handleClose()
  }

  const RenderEventType = useCallback(() => {
    switch (event.eventType) {
      case 'evento':
        return <ClassicEvent />
      case 'prevendite':
        return <Prevendite upDate={upDate} />
      case 'promo':
        return <Promo upDate={upDate} />
      case 'compleanni':
        return <Compleanni upDate={upDate} />
      case 'delivery':
        return <Delivery upDate={upDate} />
      case 'extra':
        return <Extra upDate={upDate} />
      case 'anteprima':
        return <Anteprima upDate={upDate} />
      case 'maratona':
        return <Maratona upDate={upDate} />
      case 'visita':
        return <Visita upDate={upDate} />
      case 'stampa':
        return <Stampa upDate={upDate} />
      case 'sopraluogo':
        return <Sopraluogo upDate={upDate} />
      case 'meeting':
        return <Meeting upDate={upDate} />
      case 'matinee':
        return <MattineEvent upDate={upDate} />
      case 'manutenzione':
        return <Manutenzione upDate={upDate} />
      default:
        return <Default upDate={upDate} />
    }
  }, [event.eventType])

  const openLink = (url) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // Se il link è un URL Internet, aprilo in un browser esterno
      window.api.shell.openExternal(url)
    } else {
      // Se il link è un percorso di file locale, apri il file
      window.api.shell.openPath(url)
    }
  }

  useEffect(() => {
    console.log('UPDATE', upDate)
    getOptions()
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
        width: '500px',
        mb: 2,
        overflowY: 'auto'
      }}
    >
      <form onSubmit={onSubmit}>
        {!upDate && <ToggleEvent />}

        {upDate && (
          <TextField
            fullWidth
            label="created by"
            disabled
            value={event?.createdBy ? event.createdBy : ''}
            name="createdBy"
            sx={{ mb: 2, mt: 4 }}
          />
        )}

        <RenderEventType />
        <TextField
          fullWidth
          label={`note: ${event.note ? event.note.length : 0}/${options.MAXNOTELENGTH}`}
          inputProps={{ maxLength: options.MAXNOTELENGTH }}
          variant="outlined"
          multiline
          name="note"
          value={event?.note ? event.note : ''}
          onChange={(e) => setFieldEvent({ campo: e.target.name, valore: e.target.value })}
          rows={4}
          sx={{ mt: 4, mb: 2 }}
        />

        <SubAction type="event" upDate={upDate} />
        <TextField
          fullWidth
          label="link egnyte"
          variant="outlined"
          size="small"
          name="link"
          value={event?.link ? event.link : ''}
          onChange={(e) => setFieldEvent({ campo: e.target.name, valore: e.target.value })}
          rows={1}
          sx={{ mt: 2, mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {event?.link && (
                  <IconButton
                    onClick={() => openLink(event.link)}
                    edge="end"
                    aria-label="open link"
                  >
                    <OpenInNewIcon />
                  </IconButton>
                )}
              </InputAdornment>
            )
          }}
        />

        <FormControl fullWidth sx={{ my: 4 }}>
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
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 6 }}>
            <Button
              variant="contained"
              color="error"
              sx={{ mt: 6 }}
              onClick={(e) => {
                onDelete(e, event.id)
              }}
            >
              Delete This Event
            </Button>
          </Box>
        )}
      </form>
    </Container>
  )
}

export default NewEvent
