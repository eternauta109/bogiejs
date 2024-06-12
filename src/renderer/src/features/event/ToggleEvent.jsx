/* eslint-disable react/prop-types */

import { ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility'
import CelebrationIcon from '@mui/icons-material/Celebration'
import SellIcon from '@mui/icons-material/Sell'
import SchoolIcon from '@mui/icons-material/School'
import DevicesOtherIcon from '@mui/icons-material/DevicesOther'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import MovieCreationIcon from '@mui/icons-material/MovieCreation'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import LocalAirportIcon from '@mui/icons-material/LocalAirport'
import PhotoCameraFrontIcon from '@mui/icons-material/PhotoCameraFront'
import Groups2Icon from '@mui/icons-material/Groups2'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import useEventsStore from '../../store/EventDataContext'

const colorMap = {
  evento: '#FD102B',
  matinee: '#7DCEA0',
  prevendite: '#BB8FCE',
  promo: '#F5B041 ',
  compleanni: '#448AFF',
  extra: '#FAFAD2',
  anteprima: '#42C67B',
  maratona: '#4EF9F4',
  visita: '#FF5733',
  stampa: '#669999',
  sopraluogo: '#F7DC6F',
  meeting: '#4291C6 ',
  delivery: '#C49E97'
}
const ToggleEvent = () => {
  const { event, setEvent } = useEventsStore()

  const handleToggleAlignment = (newAlignment) => {
    console.log('toggleAlignment', newAlignment)
    if (newAlignment !== null) {
      setEvent({ eventType: newAlignment, colorEventType: colorMap[newAlignment] })
    }
  }

  return (
    <>
      <Typography variant="body2" color="grey">
        scegli il tipo di evento
      </Typography>
      <ToggleButtonGroup
        value={event.eventType ? event.eventType : 'evento'}
        exclusive
        sx={{ mb: 1 }}
        aria-label="text alignment"
      >
        {Object.keys(colorMap)
          .slice(0, 7)
          .map((type) => (
            <ToggleButton
              key={type}
              value={type}
              aria-label={type}
              sx={{
                backgroundColor: colorMap[type],
                '&.Mui-selected': { backgroundColor: colorMap[type], opacity: 0.7 }
              }}
              onClick={() => handleToggleAlignment(type)}
            >
              <Tooltip title={type}>{getIcon(type)}</Tooltip>
            </ToggleButton>
          ))}
      </ToggleButtonGroup>

      <ToggleButtonGroup
        value={event.eventType ? event.eventType : 'evento'}
        exclusive
        sx={{ mb: 4 }}
        aria-label="text alignment"
      >
        {Object.keys(colorMap)
          .slice(7)
          .map((type) => (
            <ToggleButton
              key={type}
              value={type}
              aria-label={type}
              sx={{
                backgroundColor: colorMap[type],
                '&.Mui-selected': { backgroundColor: colorMap[type], opacity: 0.7 }
              }}
              onClick={() => handleToggleAlignment(type)}
            >
              <Tooltip title={type}>{getIcon(type)}</Tooltip>
            </ToggleButton>
          ))}
      </ToggleButtonGroup>
    </>
  )
}

const getIcon = (type) => {
  switch (type) {
    case 'evento':
      return <EventIcon />
    case 'matinee':
      return <SchoolIcon />
    case 'prevendite':
      return <SellIcon />
    case 'promo':
      return <DevicesOtherIcon />
    case 'compleanni':
      return <CelebrationIcon />
    case 'extra':
      return <RocketLaunchIcon />
    case 'delivery':
      return <LocalShippingIcon />
    case 'anteprima':
      return <MovieCreationIcon />
    case 'maratona':
      return <DirectionsRunIcon />
    case 'visita':
      return <LocalAirportIcon />
    case 'stampa':
      return <PhotoCameraFrontIcon />
    case 'sopraluogo':
      return <SettingsAccessibilityIcon />
    case 'meeting':
      return <Groups2Icon />
    default:
      return null
  }
}

export default ToggleEvent
