/* eslint-disable react/prop-types */
import { TextField, Box, Typography, Checkbox, FormControlLabel } from '@mui/material'
import useEventsStore from '../../../store/EventDataContext'

import { useEffect } from 'react'

import { DateTimeRange } from './serviceEventType/Field'

export default function Manutenzione({ upDate }) {
  const { event, setFieldEvent, options, setEvent } = useEventsStore()

  const handleOnClick = (e) => {
    setFieldEvent({ campo: 'doned', valore: e.target.checked })
  }

  useEffect(() => {
    console.log('upDate in delivery', upDate)
    !upDate &&
      setEvent({
        ...event,

        doned: false
      })
  }, [])

  return (
    <>
      <Box>
        <TextField
          required
          fullWidth
          label={`fornitore: ${event.title ? event.title.length : 0}/${options.MAXTITLELENGTH}`}
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
          multiline
          rows={4}
          label={`che lavoro deve fare: ${event.description ? event.description.length : 0}/${options.MAXDESCRIPTIONLENGTH}`}
          variant="outlined"
          value={event.description || ''}
          inputProps={{ maxLength: options.MAXDESCRIPTIONLENGTH }}
          name="description"
          sx={{ mb: 2 }}
          onChange={(e) => {
            setFieldEvent({ campo: e.target.name, valore: e.target.value })
          }}
        />

        <Box>
          <Typography variant="body2" color="grey">
            lavoro previsto per il:
          </Typography>
          <DateTimeRange />
        </Box>

        <Box sx={{ mt: 2 }}></Box>

        <FormControlLabel
          control={<Checkbox onClick={handleOnClick} checked={event.doned ? event.doned : false} />}
          label="il lavoro è stato svolto?"
          labelPlacement="start"
        />
      </Box>
    </>
  )
}
