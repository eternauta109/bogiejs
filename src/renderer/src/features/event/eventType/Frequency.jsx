import { useState, useEffect } from 'react'
import { RRule } from 'rrule'
import {
  TextField,
  FormControl,
  RadioGroup,
  Box,
  Button,
  Typography,
  FormLabel,
  FormControlLabel,
  Radio,
  Switch,
  Select,
  MenuItem
} from '@mui/material'
import { v4 as uuidv4 } from 'uuid'
import '@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css'
import 'react-calendar/dist/Calendar.css'
import 'react-clock/dist/Clock.css'
import useEventsStore from '../../../store/EventDataContext'
import { DateTimeRange } from './serviceEventType/Field'

// eslint-disable-next-line react/prop-types
function Frequency({ handleClose, upDate }) {
  const [freq, setFreq] = useState('week')
  const [duration, setDuration] = useState(60) // Durata in minuti, predefinita a 60 (1 ora)

  const {
    event,
    addEvent,
    setEvent,
    setFieldEvent,
    deleteMultipleEvents,
    totalEvents,
    upDateEvent,
    deleteEvent,
    user,
    options
  } = useEventsStore()

  const handleFreqChange = (e) => {
    setFreq(e.target.value)
  }

  const handleDurationChange = (e) => {
    setDuration(Number(e.target.value))
  }

  const onDeleteSingle = async (e, idToCancel) => {
    console.log('cancella singolo evento')
    e.preventDefault()
    try {
      await window.api.removeEvent(idToCancel)
      deleteEvent(idToCancel)
    } catch (error) {
      console.error('NewEvent: onDelete new event: Error fetching delete event:', error)
    }
    handleClose()
  }

  const onDeleteAll = async (e, idToCancel) => {
    console.log('cancella tutta ricorrenza', idToCancel)
    e.preventDefault()
    try {
      await window.api.removeMultipleEvent(idToCancel)
      deleteMultipleEvents(idToCancel)
    } catch (error) {
      console.error('NewEvent: onDelete new event: Error fetching delete event:', error)
    }
    handleClose()
  }

  const getRRuleFrequency = () => {
    switch (freq) {
      case 'day':
        return RRule.DAILY
      case 'week':
        return RRule.WEEKLY
      case 'mouth':
        return RRule.MONTHLY
      case 'year':
        return RRule.YEARLY
      case 'endOfMonth':
      case 'startOfMonth':
        return RRule.MONTHLY
      default:
        return RRule.WEEKLY
    }
  }

  const rruleOptions = {
    freq: getRRuleFrequency(),
    dtstart: event.start,
    until: event.end,
    ...(freq === 'endOfMonth' && { bymonthday: -1 }),
    ...(freq === 'startOfMonth' && { bymonthday: 1 })
  }

  const rule = new RRule(rruleOptions)

  const saveFreqEvent = async () => {
    if (upDate) {
      console.log('update evento ricorente:', event)
      try {
        await window.api.addNewEvent({ event, totalEvents })
        upDateEvent(event, event.id)
      } catch (error) {
        console.error('NewEvent: onSubmitNewRecorencyEvent: Error fetching upDate event:', error)
      }
      handleClose()
    } else {
      console.log('aggiungi evento ricorente:', event)
      const recurringDates = rule.all()
      const freqId = uuidv4()
      const formattedEvents = recurringDates.map((date) => ({
        ...event,
        id: 'eventFreq-' + uuidv4(),
        createdBy: user.user.userName,
        cinema: user.user.cinema,
        title: event.title,
        area: user.user.area,
        role: user.user.role,
        description: event.description,
        rrule: rule.toString(),
        start: date,
        eventType: !event.evetType && 'ricorrenza',
        colorEventType: !event.evetType && '#50394c',
        frequencyId: freqId,
        end: new Date(date.getTime() + duration * 60 * 1000) // Durata in base ai minuti selezionati
      }))

      for (let i = 0; i < formattedEvents.length; i++) {
        try {
          await window.api.addNewEvent({ event: formattedEvents[i], totalEvents })
          addEvent(formattedEvents[i])
        } catch (error) {
          console.error('NewReccorencyEvent: onSubmitNewEvent: Error fetching new event:', error)
        }
      }
      handleClose()
      console.log(formattedEvents)
    }
  }

  useEffect(() => {
    console.log('event in ric useeffect', event, upDate)
    !upDate &&
      setEvent({
        eventType: !event.evetType && 'ricorrenza',
        colorEventType: !event.evetType && '#50394c',
        description: '',
        title: '',
        start: new Date(),
        execute: false,
        end: new Date()
      })
    return () => {
      console.log('lascio ricorrenza da useffect con event=:', event)
    }
  }, [])

  return (
    <>
      <TextField
        fullWidth
        label="created by"
        disabled
        value={event.createdBy ? event.createdBy : user.user.userName}
        name="createdBy"
        sx={{ mb: 2, mt: 4 }}
      />
      <TextField
        required
        fullWidth
        label={`title: ${event.title ? event.title.length : 0}/${options.MAXTITLELENGTH}`}
        variant="outlined"
        value={event.title || ''}
        inputProps={{ maxLength: options.MAXTITLELENGTH }}
        name="title"
        sx={{ mb: 2 }}
        onChange={(e) => {
          setFieldEvent({ campo: e.target.name, valore: e.target.value })
        }}
      />
      <TextField
        fullWidth
        variant="filled"
        multiline
        inputProps={{ maxLength: options.MAXDESCRIPTIONLENGTH }}
        label={`description: ${event.description ? event.description.length : 0}/${options.MAXDESCRIPTIONLENGTH}`}
        value={event?.description ? event.description : ''}
        name="description"
        rows={4}
        sx={{ mb: 2 }}
        onChange={(e) => setFieldEvent({ campo: e.target.name, valore: e.target.value })}
      />
      {!upDate && (
        <>
          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">frequenza</FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={freq}
              onChange={handleFreqChange}
            >
              <FormControlLabel value="day" control={<Radio />} label="giornaliero" />
              <FormControlLabel value="week" control={<Radio />} label="settimanale" />
              <FormControlLabel value="mouth" control={<Radio />} label="mensile" />
              <FormControlLabel value="year" control={<Radio />} label="annuale" />
              <FormControlLabel
                value="startOfMonth"
                control={<Radio />}
                label="primo giorno del mese"
              />
              <FormControlLabel
                value="endOfMonth"
                control={<Radio />}
                label="ultimo giorno del mese"
              />
            </RadioGroup>
          </FormControl>

          {/* Campo per selezionare la durata dell'evento */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <FormLabel id="duration-label">Durata evento</FormLabel>
            <Select
              labelId="duration-label"
              value={duration}
              onChange={handleDurationChange}
              displayEmpty
              fullWidth
            >
              {[...Array(48)].map((_, index) => {
                const minutes = (index + 1) * 30
                return (
                  <MenuItem key={minutes} value={minutes}>
                    {`${Math.floor(minutes / 60)}h ${minutes % 60 !== 0 ? (minutes % 60) + 'm' : ''}`.trim()}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="grey" sx={{ mt: 2 }}>
              range temporale
            </Typography>
            <DateTimeRange />
          </Box>
        </>
      )}

      <Box mt={2}>
        <FormControl>
          <FormControlLabel
            control={
              <Switch
                name="execute"
                checked={event?.execute ? event.execute : false}
                onChange={(e) =>
                  setEvent({
                    ...event,
                    execute: e.target.checked,
                    executeBy: user.user.userName
                  })
                }
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label={event?.execute ? `eseguito da ${event.executeBy}` : 'da fare'}
          />
        </FormControl>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button fullWidth variant="outlined" onClick={saveFreqEvent} color="secondary">
          {upDate ? 'UPDATE' : 'SAVE'}
        </Button>
        {upDate && (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 6, gap: 2 }}>
            <Button
              variant="contained"
              color="error"
              sx={{ mt: 6 }}
              onClick={(e) => {
                onDeleteSingle(e, event.id)
              }}
            >
              cancella singolo evento
            </Button>
            <Button
              variant="outlined"
              color="error"
              sx={{ mt: 6 }}
              onClick={(e) => {
                onDeleteAll(e, event.frequencyId)
              }}
            >
              cancella tutta la ricorrenza
            </Button>
          </Box>
        )}
      </Box>
    </>
  )
}

export default Frequency