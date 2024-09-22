/* eslint-disable react/prop-types */
import { TextField, Box, Typography } from '@mui/material'
import useEventsStore from '../../../store/EventDataContext'

import { useMemo } from 'react'

import { DateTimeRange } from './serviceEventType/Field'

export default function Delivery() {
  const { event, setFieldEvent, options } = useEventsStore()

  useMemo(() => console.log('event in prevendite event', event), [event])

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

        <Box>
          <Typography variant="body2" color="grey">
            consegna prevista per il:
          </Typography>
          <DateTimeRange />
        </Box>

        <Box sx={{ mt: 2 }}></Box>
      </Box>
    </>
  )
}
