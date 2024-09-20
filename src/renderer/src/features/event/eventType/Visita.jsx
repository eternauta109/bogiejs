/* eslint-disable react/prop-types */
import { TextField, Box, Typography } from '@mui/material'
import useEventsStore from '../../../store/EventDataContext'

import { useEffect } from 'react'

import { DateTimeRange } from './serviceEventType/Field'

export default function Visita({ upDate }) {
  const { event, setFieldEvent, options, setEvent } = useEventsStore()

  useEffect(() => {
    !upDate &&
      setEvent({
        ...event
      })
  }, [])

  return (
    <>
      <Box>
        <TextField
          required
          fullWidth
          label={`chi viene: ${event.title ? event.title.length : 0}/${options.MAXTITLELENGTH}`}
          variant="outlined"
          value={event.title || ''}
          inputProps={{ maxLength: options.MAXTITLELENGTH }}
          name="title"
          sx={{ mb: 2 }}
          onChange={(e) => {
            setFieldEvent({ campo: e.target.name, valore: e.target.value })
          }}
        />

        <Box>
          <Typography variant="body2" color="grey" sx={{ mt: 2 }}>
            quando
          </Typography>
          <DateTimeRange />
        </Box>
      </Box>
    </>
  )
}
