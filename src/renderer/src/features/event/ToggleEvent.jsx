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

const ToggleEvent = () => {
  const { event, setEvent } = useEventsStore()

  const handleToggleAlignment = (newAlignment) => {
    console.log('toggleAlignment', newAlignment)
    if (newAlignment !== null) {
      const colorMap = {
        evento: '#F39C12',
        matinee: '#7DCEA0',
        prevendite: '#BB8FCE',
        promo: '#AAB7B8',
        compleanni: '#448AFF',
        extra: '#EF5350',
        anteprima: '#43B5A2',
        maratona: '#A67FB8',
        visita: '#FF5733',
        stampa: '#669999',
        sopraluogo: '#7859C5',
        meeting: '#4F7DE5',
        delivery: '#4F8DF5'
      }

      setEvent({ eventType: newAlignment, eventColorType: colorMap[newAlignment] })
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
        <ToggleButton
          value="evento"
          aria-label="evento"
          onClick={() => handleToggleAlignment('evento')}
        >
          <Tooltip title="evento">
            <EventIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          value="matinee"
          aria-label="matinee"
          onClick={() => handleToggleAlignment('matinee')}
        >
          <Tooltip title="matinee">
            <SchoolIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          value="prevendite"
          aria-label="prevendite"
          onClick={() => handleToggleAlignment('prevendite')}
        >
          <Tooltip title="prevendite">
            <SellIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          value="promo"
          aria-label="promo"
          onClick={() => handleToggleAlignment('promo')}
        >
          <Tooltip title="promo">
            <DevicesOtherIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          value="compleanni"
          aria-label="compleanni"
          onClick={() => handleToggleAlignment('compleanni')}
        >
          <Tooltip title="compleanni">
            <CelebrationIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          value="extra"
          aria-label="extra"
          onClick={() => handleToggleAlignment('extra')}
        >
          <Tooltip title="extra">
            <RocketLaunchIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          value="delivery"
          aria-label="delivery"
          onClick={() => handleToggleAlignment('delivery')}
        >
          <Tooltip title="delivery">
            <LocalShippingIcon />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup
        value={event.eventType ? event.eventType : 'evento'}
        exclusive
        sx={{ mb: 4 }}
        aria-label="text alignment"
      >
        <ToggleButton
          value="anteprima"
          aria-label="anteprima"
          onClick={() => handleToggleAlignment('anteprima')}
        >
          <Tooltip title="anteprima">
            <MovieCreationIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          value="maratona"
          aria-label="maratona"
          onClick={() => handleToggleAlignment('maratona')}
        >
          <Tooltip title="maratona">
            <DirectionsRunIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          value="visita"
          aria-label="visita"
          onClick={() => handleToggleAlignment('visita')}
        >
          <Tooltip title="visita">
            <LocalAirportIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          value="stampa"
          aria-label="stampa"
          onClick={() => handleToggleAlignment('stampa')}
        >
          <Tooltip title="stampa">
            <PhotoCameraFrontIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          value="sopraluogo"
          aria-label="sopraluogo"
          onClick={() => handleToggleAlignment('sopraluogo')}
        >
          <Tooltip title="sopraluogo">
            <SettingsAccessibilityIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          value="meeting"
          aria-label="meeting"
          onClick={() => handleToggleAlignment('meeting')}
        >
          <Tooltip title="meeting">
            <Groups2Icon />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  )
}

export default ToggleEvent
