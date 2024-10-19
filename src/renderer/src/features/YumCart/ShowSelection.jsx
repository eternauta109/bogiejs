/* eslint-disable react/prop-types */
import { Box, Select, MenuItem, TextField } from '@mui/material'
import { useSelector } from 'react-redux'

const ShowSelection = ({ selectedShow, setSelectedShow, attendance, setAttendance }) => {
  const shows = useSelector((state) => state.shows.selectedShows)

  return (
    <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
      <Box width="75%">
        <Select
          value={selectedShow !== null && selectedShow !== undefined ? selectedShow : ''}
          onChange={(e) => {
            console.log(e.target.value)
            setSelectedShow(e.target.value)
          }}
          displayEmpty
          fullWidth
        >
          <MenuItem value="" disabled>
            Seleziona uno Spettacolo
          </MenuItem>
          {shows.map((show) => (
            <MenuItem key={show.id} value={show.id}>
              {show.PLAYLIST} -{show.AUDITORIUM} -{show.FEATURE_TIME}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Finestra per inserire le presenze */}
      <Box width="20%">
        <TextField
          value={attendance ? attendance : ''}
          onChange={(e) => setAttendance(e.target.value)}
          variant="outlined"
          label="presenze"
          size="small"
          type="number"
          inputProps={{ maxLength: 3, style: { textAlign: 'center' } }}
          fullWidth
        />
      </Box>
    </Box>
  )
}

export default ShowSelection
