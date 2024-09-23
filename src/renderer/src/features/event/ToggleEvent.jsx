/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Typography, Tooltip, IconButton } from '@mui/material'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import opsIcon from '../../assets/ops.png'
import maintenanceIcons from '../../assets/maintenance.png'
import concIcon from '../../assets/concIcon.png'
import eventIcon from '../../assets/eventIcon.png'
import screenIcon from '../../assets/screenIcon.png'
import ToggleService from './ToggleService'
import useEventsStore from '../../store/EventDataContext'

const ToggleEvent = () => {
  const { setEvent, options } = useEventsStore()
  const [selectedEvent, setSelectedEvent] = useState(null) // Stato per il pulsante
  const [macroArea, setMacroArea] = useState(null)

  const handleToggleAlignment = (newAlignment) => {
    console.log('toggleAlignment', options)
    if (newAlignment !== selectedEvent) {
      setSelectedEvent(newAlignment)

      //è qui che sostanzialmente si inizializza l'event
      setEvent({
        eventType: newAlignment,
        colorEventType: options.colorMap[newAlignment],
        start: new Date(),
        end: new Date(),
        subAction: [],
        description: '',
        division: '',
        link: '',
        note: ''
      })
    } else {
      setSelectedEvent(null)
    }
  }

  const handleIconClick = (iconName) => {
    /* console.log(`Icon clicked: ${iconName}`) */
    setMacroArea(iconName)
    // Aggiungi qui la logica che desideri, come il filtraggio degli eventi.
  }

  return (
    <>
      <>
        <Box
          sx={{
            display: 'flex',
            height: '100%',
            flexDirection: 'raw', // Disposizione a colonna
            alignItems: 'center', // Centra gli elementi orizzontalmente
            justifyContent: 'flex-start', // Allinea gli elementi in alto verticalmente
            gap: 1, // Spaziatura tra gli elementi
            width: 'fit-content' // Imposta la larghezza al contenuto
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
            <Tooltip title="Ops">
              <IconButton onClick={() => handleIconClick('ops')}>
                <Avatar
                  alt="My Icon"
                  src={opsIcon}
                  sx={{ width: 50, height: 50 }} // Adjust the size here
                  variant="square" // Change to "circular" for rounded or "rounded" for rounded square
                />
              </IconButton>
            </Tooltip>
          </Box>
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              flexDirection: 'column', // Disposizione a colonna
              alignItems: 'center', // Centra gli elementi orizzontalmente
              justifyContent: 'flex-start', // Allinea gli elementi in alto verticalmente
              gap: 2, // Spaziatura tra gli elementi
              border: '1px solid #6699ff', // Bordo con colore e larghezza
              borderRadius: '8px', // Arrotonda i bordi (opzionale)
              padding: 1, // Aggiunge spazio interno
              width: 'fit-content' // Imposta la larghezza al contenuto
            }}
          >
            <Typography variant="body2" color="grey">
              manut.
            </Typography>
            <Tooltip title="Manutenzione">
              <IconButton onClick={() => handleIconClick('manutenzione')}>
                <Avatar
                  src={maintenanceIcons}
                  alt="Manutenzione Icon"
                  sx={{ width: '50px', height: '50px' }}
                />
              </IconButton>
            </Tooltip>
          </Box>
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              flexDirection: 'column', // Disposizione a colonna
              alignItems: 'center', // Centra gli elementi orizzontalmente
              justifyContent: 'flex-start', // Allinea gli elementi in alto verticalmente
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
            <Tooltip title="Concession">
              <IconButton onClick={() => handleIconClick('conc')}>
                <Avatar
                  src={concIcon}
                  alt="Concession Icon"
                  sx={{ width: '50px', height: '50px' }}
                />
              </IconButton>
            </Tooltip>
          </Box>
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              flexDirection: 'column', // Disposizione a colonna
              alignItems: 'center', // Centra gli elementi orizzontalmente
              justifyContent: 'flex-start', // Allinea gli elementi in alto verticalmente
              gap: 2, // Spaziatura tra gli elementi
              border: '1px solid #d4ac0d', // Bordo con colore e larghezza
              borderRadius: '8px', // Arrotonda i bordi (opzionale)
              padding: 1, // Aggiunge spazio interno
              width: 'fit-content' // Imposta la larghezza al contenuto
            }}
          >
            <Typography variant="body2" color="grey">
              eventi
            </Typography>
            <Tooltip title="Eventi">
              <IconButton onClick={() => handleIconClick('eventi')}>
                <Avatar src={eventIcon} alt="Eventi Icon" sx={{ width: '50px', height: '50px' }} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              flexDirection: 'column', // Disposizione a colonna
              alignItems: 'center', // Centra gli elementi orizzontalmente
              justifyContent: 'flex-start', // Allinea gli elementi in alto verticalmente
              gap: 2, // Spaziatura tra gli elementi
              border: '1px solid #7dcea0', // Bordo con colore e larghezza
              borderRadius: '8px', // Arrotonda i bordi (opzionale)
              padding: 1, // Aggiunge spazio interno
              width: 'fit-content' // Imposta la larghezza al contenuto
            }}
          >
            <Typography variant="body2" color="grey">
              SC&MRK
            </Typography>
            <Tooltip title="Screen Content">
              <IconButton onClick={() => handleIconClick('screenContent')}>
                <Avatar
                  src={screenIcon}
                  alt="Screen Content Icon"
                  sx={{ width: '50px', height: '50px' }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </>

      <>
        <ToggleButtonGroup
          value={selectedEvent}
          exclusive
          onChange={handleToggleAlignment}
          aria-label="text alignment"
        >
          {macroArea === 'ops' ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row', // Layout a colonna
                mb: 2,
                mt: 2,
                justifyContent: 'space-between', // Centra verticalmente
                gap: 2, // Spaziatura tra gli elementi
                alignItems: 'flex-start' // Allinea tutti i box in alto
              }}
            >
              <Avatar
                alt="My Icon"
                src={opsIcon}
                sx={{ width: 50, height: 50 }} // Adjust the size here
                variant="square" // Change to "circular" for rounded or "rounded" for rounded square
              />

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
          ) : null}
          {macroArea === 'manutenzione' ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row', // Layout a colonna
                mb: 2,
                mt: 2,
                justifyContent: 'space-between', // Centra verticalmente
                gap: 2, // Spaziatura tra gli elementi
                alignItems: 'flex-start' // Allinea tutti i box in alto
              }}
            >
              <Avatar src={maintenanceIcons} alt="My Icon" sx={{ width: '50px', height: '50px' }} />
              <ToggleService
                selectedEvent={selectedEvent}
                value="manutenzione"
                handleToggleAlignment={handleToggleAlignment}
              />
            </Box>
          ) : null}

          {macroArea === 'conc' ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row', // Layout a colonna
                mb: 2,
                mt: 2,
                justifyContent: 'space-between', // Centra verticalmente
                gap: 2, // Spaziatura tra gli elementi
                alignItems: 'flex-start' // Allinea tutti i box in alto
              }}
            >
              <Avatar src={concIcon} alt="My Icon" sx={{ width: '50px', height: '50px' }} />
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
          ) : null}

          {macroArea === 'eventi' ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row', // Layout a colonna
                mb: 2,
                mt: 2,
                justifyContent: 'space-between', // Centra verticalmente
                gap: 2, // Spaziatura tra gli elementi
                alignItems: 'flex-start' // Allinea tutti i box in alto
              }}
            >
              <Avatar src={eventIcon} alt="My Icon" sx={{ width: '50px', height: '50px' }} />
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
          ) : null}

          {macroArea === 'screenContent' ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row', // Layout a colonna
                mb: 2,
                mt: 2,
                justifyContent: 'space-between', // Centra verticalmente
                gap: 2, // Spaziatura tra gli elementi
                alignItems: 'flex-start' // Allinea tutti i box in alto
              }}
            >
              <Avatar src={screenIcon} alt="My Icon" sx={{ width: '50px', height: '50px' }} />
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
                value="premiere"
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
          ) : null}
        </ToggleButtonGroup>
      </>
    </>
  )
}

export default ToggleEvent
