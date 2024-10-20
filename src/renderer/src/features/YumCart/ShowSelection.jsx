/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { Box, Select, MenuItem, TextField } from '@mui/material'
import { useSelector } from 'react-redux'

const ShowSelection = ({ selectedShow, setSelectedShow, attendance, setAttendance }) => {
  const shows = useSelector((state) => state.shows.selectedShows)
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
  )

  const now = new Date()
  const nowPlus15Min = new Date(now.getTime() + 15 * 60000) // Ora attuale + 15 minuti

  const sortedShows = shows.slice().sort((a, b) => {
    return new Date(a.FEATURE_TIME) - new Date(b.FEATURE_TIME)
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }))
    }, 60000) // Aggiorna ogni minuto

    // Pulizia del timer quando il componente si smonta
    return () => clearInterval(timer)
  }, [])

  return (
    <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
      <TextField
        label="time"
        value={currentTime}
        size="small"
        sx={{ width: '80px', mr: 1 }}
        disabled
      />
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
          {sortedShows.map((show) => {
            const featureTime = new Date(show.FEATURE_TIME)

            // Condizione per colorare il Box se FEATURE_TIME è tra ora attuale e ora attuale + 15 minuti
            const isWithinNext15Min = featureTime > now && featureTime <= nowPlus15Min

            return (
              <MenuItem
                value={show.id}
                key={show.id}
                sx={{
                  backgroundColor: isWithinNext15Min ? '#f39c12' : 'inherit', // Colore arancione se entro 15 minuti, altrimenti normale
                  padding: 1, // Aggiungi un po' di padding
                  borderRadius: '4px' // Aggiungi border-radius per un effetto migliore
                }}
              >
                {show.PLAYLIST} - {show.AUDITORIUM} -{' '}
                {new Date(show.FEATURE_TIME).toLocaleTimeString('it-IT', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </MenuItem>
            )
          })}
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
          sx={{ ml: 1, width: '100px' }}
          inputProps={{ maxLength: 4, style: { textAlign: 'center' } }}
        />
      </Box>
    </Box>
  )
}

export default ShowSelection
