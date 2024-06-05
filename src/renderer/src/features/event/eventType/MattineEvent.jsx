/* eslint-disable react/prop-types */
import { TextField, Box, InputAdornment, Typography, Stack } from '@mui/material'
import useEventsStore from '../../../store/EventDataContext'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import Groups2Icon from '@mui/icons-material/Groups2'

import { useEffect, useMemo } from 'react'
import { DateTimeRange } from './serviceEventType/Field'

export default function MattineEvent({ upDate }) {
  const { event, setFieldEvent, options, setEvent } = useEventsStore()

  useEffect(() => {
    console.log('upDate in MattineEvent', upDate)
    !upDate &&
      setEvent({
        ...event,
        title: '',
        referent: '',
        email: '',
        phone: 0,
        start: new Date(),
        end: new Date(),
        number: 0,
        amount: 0
      })
  }, [])

  useMemo(() => console.log('event in matinee event', event), [event])

  return (
    <>
      <Box>
        <TextField
          required
          fullWidth
          label={`istituto/azienda: ${event.title ? event.title.length : 0}/${options.MAXTITLELENGTH}`}
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
          id="input-with-icon-textfield"
          label="Referente"
          fullWidth
          value={event.referent ? event.referent : ''}
          name="referent"
          sx={{ mb: 4, mt: 2 }}
          onChange={(e) => {
            setFieldEvent({ campo: e.target.name, valore: e.target.value })
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            )
          }}
          variant="standard"
        />
        <TextField
          id="input-with-icon-textfield"
          label="email"
          fullWidth
          value={event.email ? event.email : ''}
          name="email"
          sx={{ mb: 4 }}
          onChange={(e) => {
            setFieldEvent({ campo: e.target.name, valore: e.target.value })
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailOutlineIcon />
              </InputAdornment>
            )
          }}
          variant="standard"
        />

        <TextField
          id="input-with-icon-textfield"
          label="phone"
          fullWidth
          value={event.phone ? event.phone : ''}
          name="phone"
          sx={{ mb: 4 }}
          onChange={(e) => {
            setFieldEvent({ campo: e.target.name, valore: e.target.value })
          }}
          InputProps={{
            inputMode: 'numeric',
            pattern: '[0-9]*',
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIphoneIcon />
              </InputAdornment>
            )
          }}
          variant="standard"
        />

        <Stack direction="row" spacing={2} sx={{ mb: 4 }} justifyContent={'center'}>
          <TextField
            label="numero spettatori "
            id="filled-start-adornment"
            sx={{ width: '150px', mr: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Groups2Icon />
                </InputAdornment>
              )
            }}
            name="number"
            value={event.number ? event.number : ''}
            onChange={(e) => {
              setFieldEvent({ campo: e.target.name, valore: e.target.value })
            }}
            variant="standard"
          />

          <TextField
            label="incasso"
            id="filled-start-adornment"
            name="amount"
            value={event.amount ? event.amount : ''}
            onChange={(e) => {
              setFieldEvent({ campo: e.target.name, valore: e.target.value })
            }}
            sx={{ width: '150px', mr: 2 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>
            }}
            variant="standard"
          />
        </Stack>

        <Typography variant="h7" sx={{ mt: 2 }}>
          quando
        </Typography>
        <DateTimeRange />
      </Box>
    </>
  )
}
