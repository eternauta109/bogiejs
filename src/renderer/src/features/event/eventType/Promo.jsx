/* eslint-disable react/prop-types */
import { Box, TextField, InputAdornment, Typography } from '@mui/material'
import useEventsStore from '../../../store/EventDataContext'
import { useEffect, useMemo } from 'react'
import RedeemIcon from '@mui/icons-material/Redeem'
import ModeOfTravelIcon from '@mui/icons-material/ModeOfTravel'
import { DateTimeRange } from './serviceEventType/Field'

export default function Promo({ upDate }) {
  const { event, setEvent, options, setFieldEvent } = useEventsStore()

  useMemo(() => console.log('event in Promo event', event), [event])

  useEffect(() => {
    console.log('upDate in Promo', upDate)
    !upDate &&
      setEvent({
        ...event,
        title: '',
        subAction: [],
        description: '',
        gadget: '',
        whereGadget: '',
        start: new Date(),
        end: new Date()
      })
  }, [])
  return (
    <Box>
      <TextField
        required
        fullWidth
        label={`titolo promo/iniziativa: ${event.title ? event.title.length : 0}/${options.MAXTITLELENGTH}`}
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
        required
        fullWidth
        rows={4}
        multiline
        label={`descrizione: ${event.description ? event.description.length : 0}/${options.MAXDESCRIPTIONLENGTH}`}
        variant="outlined"
        value={event.description || ''}
        inputProps={{ maxLength: options.MAXDESCRIPTIONLENGTH }}
        name="description"
        sx={{ mb: 2 }}
        onChange={(e) => {
          setFieldEvent({ campo: e.target.name, valore: e.target.value })
        }}
      />
      <TextField
        id="input-with-icon-textfield"
        label="c'è un gadget, menu da distribuire?"
        fullWidth
        value={event.gadget ? event.gadget : ''}
        name="gadget"
        sx={{ mb: 4, mt: 4 }}
        onChange={(e) => {
          setFieldEvent({ campo: e.target.name, valore: e.target.value })
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <RedeemIcon />
            </InputAdornment>
          )
        }}
        variant="standard"
      />
      <TextField
        id="input-with-icon-textfield"
        label="il gadget/materiale è arrivato? dove si trova?"
        fullWidth
        value={event.whereGadget ? event.whereGadget : ''}
        name="whereGadget"
        sx={{ mb: 4 }}
        onChange={(e) => {
          setFieldEvent({ campo: e.target.name, valore: e.target.value })
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <ModeOfTravelIcon />
            </InputAdornment>
          )
        }}
        variant="standard"
      />

      <Typography variant="body2" color="grey">
        {' '}
        validita promo/iniziativa
      </Typography>
      <DateTimeRange />
    </Box>
  )
}
