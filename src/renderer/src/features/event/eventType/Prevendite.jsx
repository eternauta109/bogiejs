/* eslint-disable react/prop-types */
import { TextField, Box, InputAdornment, Typography } from '@mui/material'
import useEventsStore from '../../../store/EventDataContext'

import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker'

import { useEffect, useMemo } from 'react'
import PriceCheckIcon from '@mui/icons-material/PriceCheck'
import VideocamTwoToneIcon from '@mui/icons-material/VideocamTwoTone'
import { DateTimeRange } from './serviceEventType/Field'

export default function Prevendite({ upDate }) {
  const { event, setFieldEvent, options, setEvent } = useEventsStore()

  useMemo(() => console.log('event in prevendite event', event), [event])

  useEffect(() => {
    console.log('upDate in MattineEvent', upDate)
    !upDate &&
      setEvent({
        ...event,
        title: '',
        referent: '',
        screen: 0,
        subAction: [],
        priceCard: '',
        start: new Date(),
        end: new Date(),
        startOpen: new Date(),
        endOpen: new Date()
      })
  }, [])

  return (
    <>
      <Box>
        <TextField
          required
          fullWidth
          label={`film da aprire: ${event.title ? event.title.length : 0}/${options.MAXTITLELENGTH}`}
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
          <Typography variant="h7" sx={{ mt: 2 }}>
            da aprire prevendite il
          </Typography>
          <DateTimeRange />
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h7" sx={{ mt: 6 }}>
            periodo di programmazione
          </Typography>
          <DateTimeRangePicker
            onChange={(newDateRange) => {
              console.log(newDateRange)
              setFieldEvent({ campo: 'startOpen', valore: newDateRange[0] })
              setFieldEvent({ campo: 'endOpen', valore: newDateRange[1] })
            }}
            value={event.startOpen ? [event.startOpen, event.endOpen] : [new Date(), new Date()]}
          />
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
