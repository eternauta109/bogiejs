/* eslint-disable react/prop-types */
import { TextField } from '@mui/material'
import EventDataContext from '../../../store/EventDataContext'

export default function Prevendite() {
  const { setEvent, event } = EventDataContext()

  return (
    <TextField
      fullWidth
      label="Film"
      onChange={handleFilmChange}
      value={event?.film || ''}
      name="film"
      sx={{ mb: 2 }}
    />
  )
}
