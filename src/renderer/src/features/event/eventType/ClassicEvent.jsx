/* eslint-disable react/prop-types */
import {
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Typography
} from '@mui/material'
import { DateTimeRange } from './serviceEventType/Field'
import useEventsStore from '../../../store/EventDataContext'

import { useEffect, useMemo } from 'react'

export default function ClassicEvent() {
  const { event, setFieldEvent, options, setEvent } = useEventsStore()

  //gestisco i cambiamenti del valore della divsions e aggiorno sia
  // lo stato che il colore relativo
  const handleDivisionChange = (e) => {
    console.log('selected div', e.target.value)
    const division = options?.divisions?.find(
      (division) => division.nameDivision === e.target.value
    )
    console.log('selected divobj', division)
    setFieldEvent({
      campo: 'division',
      valore: e.target.value
    })
    setFieldEvent({ campo: 'colorDivision', valore: division.color })
  }
  useEffect(() => {
    setEvent({
      eventType: !event.evetType && 'evento',
      eventColorType: !event.evetType && '#F39C12',
      start: new Date(),
      end: new Date(),

      description: '',
      division: '',
      link: '',
      note: ''
    })
    return () => {
      console.log('lascio classic event da useffect con event=:', event)
    }
  }, [])

  useMemo(() => console.log('event in calssic event', event), [event])
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

        <Typography variant="body2" color="grey" sx={{ mt: 2 }}>
          durata evento
        </Typography>
        <DateTimeRange />

        {options?.divisions && (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="division">Division</InputLabel>
            <Select
              labelId="division"
              name="division"
              input={<OutlinedInput label="division" />}
              id="demo-simple-select"
              value={event?.division ? event.division : ''}
              onChange={(e) => handleDivisionChange(e)}
              fullWidth
            >
              <MenuItem value={''}>none</MenuItem>
              {options?.divisions?.map((division, key) => (
                <MenuItem value={division.nameDivision} key={key}>
                  {division.nameDivision}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
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
        />
      </Box>
    </>
  )
}
