/* eslint-disable react/prop-types */
import {
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem
} from '@mui/material'
import EventDataContext from '../../../store/EventDataContext'
import { useEffect } from 'react'
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker'

export default function ClassicEvent({ upDate }) {
  const { event, setFieldEvent, options } = EventDataContext()

  console.log('ClassicEvent: upDate:', upDate)
  useEffect(() => {
    setFieldEvent({ campo: 'eventType', valore: 'evento' })
    setFieldEvent({ campo: 'colorEventType', valore: '#F39C12' })
  }, [])

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
        <DateTimeRangePicker
          onChange={(newDateRange) => {
            console.log(newDateRange)
            setFieldEvent({ campo: 'start', valore: newDateRange[0] })
            setFieldEvent({ campo: 'end', valore: newDateRange[1] })
          }}
          value={event.start ? [event.start, event.end] : [new Date(), new Date()]}
        />

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
          onChange={(link) => setFieldEvent({ campo: link.target.name, valore: link.target.value })}
          rows={1}
          sx={{ mt: 2, mb: 2 }}
        />
        <TextField
          fullWidth
          label={`note: ${event.note ? event.note.length : 0}/${options.MAXNOTELENGTH}`}
          inputProps={{ maxLength: options.MAXNOTELENGTH }}
          variant="outlined"
          multiline
          name="note"
          value={event?.note ? event.note : ''}
          onChange={(note) => setFieldEvent({ campo: note.target.note, note: note.target.value })}
          rows={4}
          sx={{ mt: 2, mb: 2 }}
        />
      </Box>
    </>
  )
}
