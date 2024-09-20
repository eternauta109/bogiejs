/* eslint-disable react/prop-types */
import { TextField, Box, InputAdornment, Typography } from '@mui/material'
import useEventsStore from '../../../store/EventDataContext'

import { useEffect } from 'react'
import PriceCheckIcon from '@mui/icons-material/PriceCheck'
import VideocamTwoToneIcon from '@mui/icons-material/VideocamTwoTone'
import { DateTimeRange } from './serviceEventType/Field'

export default function Maratona({ upDate }) {
  const { event, setFieldEvent, options, setEvent } = useEventsStore()

  useEffect(() => {
    !upDate &&
      setEvent({
        ...event,

        screen: 0,
        priceCard: ''
      })
  }, [])

  return (
    <>
      <Box>
        <TextField
          required
          fullWidth
          label={`maratona: ${event.title ? event.title.length : 0}/${options.MAXTITLELENGTH}`}
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
            giorno di programmazione maratona
          </Typography>
          <DateTimeRange />
        </Box>

        <TextField
          id="input-with-icon-textfield"
          label="Price card da applicare"
          fullWidth
          value={event.priceCard ? event.priceCard : ''}
          name="priceCard"
          sx={{ mb: 4, mt: 4 }}
          onChange={(e) => {
            setFieldEvent({ campo: e.target.name, valore: e.target.value })
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PriceCheckIcon />
              </InputAdornment>
            )
          }}
          variant="standard"
        />
        <TextField
          id="input-with-icon-textfield"
          label="in che sala"
          fullWidth
          value={event.screen ? event.screen : ''}
          name="screen"
          sx={{ mb: 4 }}
          onChange={(e) => {
            setFieldEvent({ campo: e.target.name, valore: e.target.value })
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <VideocamTwoToneIcon />
              </InputAdornment>
            )
          }}
          variant="standard"
        />
      </Box>
    </>
  )
}
