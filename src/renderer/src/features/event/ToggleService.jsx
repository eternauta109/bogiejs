import { ToggleButton, Tooltip } from '@mui/material'

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
import EngineeringIcon from '@mui/icons-material/Engineering'
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation'
import PhonelinkLockIcon from '@mui/icons-material/PhonelinkLock'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import useEventsStore from '../../store/EventDataContext'
// eslint-disable-next-line react/prop-types
export const ToggleService = ({ value, handleToggleAlignment, selectedEvent }) => {
  const { options } = useEventsStore()

  return (
    <ToggleButton
      value={value}
      selected={selectedEvent === value}
      aria-label={value}
      sx={{
        backgroundColor: selectedEvent === value ? 'grey' : options.colorMap[value] // Cambia il colore a seconda che il pulsante sia selezionato o meno
        // Imposta il colore quando selezionato
      }}
      onClick={() => handleToggleAlignment(value)}
    >
      <Tooltip title={value}>{getIcon(value)}</Tooltip>
    </ToggleButton>
  )
}

export default ToggleService

const getIcon = (type) => {
  switch (type) {
    //ops
    case 'visita':
      return <LocalAirportIcon />
    case 'compleanni':
      return <CelebrationIcon />
    case 'matinee':
      return <SchoolIcon />

    //manutenzione
    case 'manutenzione':
      return <EngineeringIcon />

    //conc
    case 'promo':
      return <DevicesOtherIcon />
    case 'delivery':
      return <LocalShippingIcon />
    case 'menu':
      return <MenuBookIcon />

    //eventi
    case 'evento':
      return <EventIcon />
    case 'sopraluogo':
      return <SettingsAccessibilityIcon />
    case 'meeting':
      return <Groups2Icon />
    case 'convention':
      return <EmojiTransportationIcon />
    case 'privateproj':
      return <PhonelinkLockIcon />

    //screen content
    case 'prevendite':
      return <SellIcon />
    case 'extra':
      return <RocketLaunchIcon />
    case 'anteprima':
      return <MovieCreationIcon />
    case 'maratona':
      return <DirectionsRunIcon />
    case 'stampa':
      return <PhotoCameraFrontIcon />
    default:
      return null
  }
}
