/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Typography } from '@mui/material'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Box from '@mui/material/Box'
import opsIcon from '../../assets/ops.png'
import maintenanceIcons from '../../assets/maintenance.png'
import concIcon from '../../assets/concIcon.png'
import eventIcon from '../../assets/eventIcon.png'
import screenIcon from '../../assets/screenIcon.png'
import ToggleService from './ToggleService'
import useEventsStore from '../../store/EventDataContext'

const ToggleEvent = () => {
  const { setEvent } = useEventsStore()
  const [selectedEvent, setSelectedEvent] = useState(null) // Stato per il pulsante
  const colorMap = {
    //ops
    visita: '#1f618d',
    compleanni: '#5499c7',
    matinee: '#2980b9',
    //manutenzione
    manutenzione: '#6699ff',
    //concession
    delivery: '#af7ac5',
    promo: '#9b59b6  ',
    menu: '#633974  ',
    //evento
    sopraluogo: '#f7dc6f',
    meeting: '#f4d03f  ',
    evento: '#d4ac0d',
    convention: '#d4ac0d ',
    privateproj: '#9a7d0a',
    //screencontent
    prevendite: '#7dcea0',
    extra: '#52be80',
    anteprima: '#27ae60 ',
    maratona: '#1e8449 ',
    stampa: '#196f3d'
  }

  const handleToggleAlignment = (newAlignment) => {
    console.log('toggleAlignment', newAlignment)
    if (newAlignment !== selectedEvent) {
      setSelectedEvent(newAlignment)
      setEvent({ eventType: newAlignment, colorEventType: colorMap[newAlignment] })
    } else {
      setSelectedEvent(null)
    }
  }

  return (
    <>
      <ToggleButtonGroup
        value={selectedEvent}
        exclusive
        onChange={handleToggleAlignment}
        aria-label="text alignment"
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row', // Layout a colonna
            mb: 2,
            justifyContent: 'space-between', // Centra verticalmente
            gap: 2, // Spaziatura tra gli elementi
            alignItems: 'flex-start' // Allinea tutti i box in alto
          }}
        >
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              flexDirection: 'column', // Disposizione a colonna
              alignItems: 'center', // Centra gli elementi orizzontalmente
              justifyContent: 'flex-start', // Allinea gli elementi in alto verticalmente
              gap: 2, // Spaziatura tra gli elementi
              border: '1px solid #5499c7', // Bordo con colore e larghezza
              borderRadius: '8px', // Arrotonda i bordi (opzionale)
              padding: 1, // Aggiunge spazio interno
              width: 'fit-content' // Imposta la larghezza al contenuto
            }}
          >
            <Typography variant="body2" color="grey">
              ops
            </Typography>

            <img src={opsIcon} alt="My Icon" style={{ width: '50px', height: '50px' }} />
            <ToggleService
              value="visita"
              handleToggleAlignment={handleToggleAlignment}
              selectedEvent={selectedEvent}
            />
            <ToggleService
              selectedEvent={selectedEvent}
              value="compleanni"
              handleToggleAlignment={handleToggleAlignment}
            />
            <ToggleService
              selectedEvent={selectedEvent}
              value="matinee"
              handleToggleAlignment={handleToggleAlignment}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              flexDirection: 'column', // Layout a colonna
              alignItems: 'center', // Centra gli elementi orizzontalmente
              justifyContent: 'flex-start', // Centra verticalmente
              gap: 2, // Spaziatura tra gli elementi
              border: '1px solid 	#48c9b0 ', // Bordo con colore e larghezza
              borderRadius: '8px', // Arrot	#FFFF00nda i bordi (opzionale)
              padding: 1, // Aggiunge spazio interno
              width: 'fit-content' // Imposta la larghezza al contenuto
            }}
          >
            <Typography variant="body2" color="grey">
              manut.
            </Typography>
            <img src={maintenanceIcons} alt="My Icon" style={{ width: '50px', height: '50px' }} />
            <ToggleService
              selectedEvent={selectedEvent}
              value="manutenzione"
              handleToggleAlignment={handleToggleAlignment}
            />
          </Box>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column', // Layout a colonna
              alignItems: 'center', // Centra gli elementi orizzontalmente
              justifyContent: 'flex-start', // Centra verticalmente
              gap: 2, // Spaziatura tra gli elementi
              border: '1px solid #af7ac5', // Bordo con colore e larghezza
              borderRadius: '8px', // Arrotonda i bordi (opzionale)
              padding: 1, // Aggiunge spazio interno
              width: 'fit-content' // Imposta la larghezza al contenuto
            }}
          >
            <Typography variant="body2" color="grey">
              conc.
            </Typography>
            <img src={concIcon} alt="My Icon" style={{ width: '50px', height: '50px' }} />
            <ToggleService
              selectedEvent={selectedEvent}
              value="delivery"
              handleToggleAlignment={handleToggleAlignment}
            />
            <ToggleService
              selectedEvent={selectedEvent}
              value="promo"
              handleToggleAlignment={handleToggleAlignment}
            />
            <ToggleService
              selectedEvent={selectedEvent}
              value="menu"
              handleToggleAlignment={handleToggleAlignment}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column', // Layout a colonna
              alignItems: 'center', // Centra gli elementi orizzontalmente
              justifyContent: 'flex-start', // Centra verticalmente
              gap: 2, // Spaziatura tra gli elementi
              border: '1px solid #f39c12', // Bordo con colore e larghezza
              borderRadius: '8px', // Arrotonda i bordi (opzionale)
              padding: 1, // Aggiunge spazio interno
              width: 'fit-content' // Imposta la larghezza al contenuto
            }}
          >
            <Typography variant="body2" color="grey">
              eventi
            </Typography>
            <img src={eventIcon} alt="My Icon" style={{ width: '50px', height: '50px' }} />
            <ToggleService
              selectedEvent={selectedEvent}
              value="sopraluogo"
              handleToggleAlignment={handleToggleAlignment}
            />
            <ToggleService
              selectedEvent={selectedEvent}
              value="meeting"
              handleToggleAlignment={handleToggleAlignment}
            />
            <ToggleService
              selectedEvent={selectedEvent}
              value="evento"
              handleToggleAlignment={handleToggleAlignment}
            />
            <ToggleService
              selectedEvent={selectedEvent}
              value="convention"
              handleToggleAlignment={handleToggleAlignment}
            />
            <ToggleService
              selectedEvent={selectedEvent}
              value="privateproj"
              handleToggleAlignment={handleToggleAlignment}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column', // Layout a colonna
              alignItems: 'center', // Centra gli elementi orizzontalmente
              justifyContent: 'flex-start', // Centra verticalmente
              gap: 2, // Spaziatura tra gli elementi
              border: '1px solid #229954', // Bordo con colore e larghezza
              borderRadius: '8px', // Arrotonda i bordi (opzionale)
              padding: 1, // Aggiunge spazio interno
              width: 'fit-content' // Imposta la larghezza al contenuto
            }}
          >
            <Typography variant="body2" color="grey">
              ScreenCont.
            </Typography>
            <img src={screenIcon} alt="My Icon" style={{ width: '50px', height: '50px' }} />
            <ToggleService
              selectedEvent={selectedEvent}
              value="prevendite"
              handleToggleAlignment={handleToggleAlignment}
            />
            <ToggleService
              selectedEvent={selectedEvent}
              value="extra"
              handleToggleAlignment={handleToggleAlignment}
            />
            <ToggleService
              selectedEvent={selectedEvent}
              value="anteprima"
              handleToggleAlignment={handleToggleAlignment}
            />
            <ToggleService
              selectedEvent={selectedEvent}
              value="maratona"
              handleToggleAlignment={handleToggleAlignment}
            />
            <ToggleService
              selectedEvent={selectedEvent}
              value="stampa"
              handleToggleAlignment={handleToggleAlignment}
            />
          </Box>
        </Box>
      </ToggleButtonGroup>

      {/*   <ToggleButtonGroup
        value={event.eventType ? event.eventType : 'evento'}
        exclusive
        sx={{
          mb: 1,
          width: '100%',
          justifyContent: 'space-between'
        }}
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
        sx={{
          mb: 4,
          width: '100%',
          justifyContent: 'space-between'
        }}
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
      </ToggleButtonGroup> */}
    </>
  )
}

export default ToggleEvent
