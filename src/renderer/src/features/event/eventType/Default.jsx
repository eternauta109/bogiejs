/* eslint-disable react/prop-types */

import { Box, TextField } from '@mui/material'
import useEventsStore from '../../../store/EventDataContext'
import { DateTimeRange } from './serviceEventType/Field'

const Default = () => {
  const { event, options, setFieldEvent } = useEventsStore()

  return (
    <>
      <Box>
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
        <DateTimeRange />
      </Box>
    </>
  )
}

export default Default
