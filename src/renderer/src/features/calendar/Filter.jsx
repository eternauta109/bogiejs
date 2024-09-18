import useEventsStore from '../../store/EventDataContext'
import { Box, Typography, IconButton, Tooltip } from '@mui/material'
import maintenanceIcons from '../../assets/maintenance.png'
import concIcon from '../../assets/concIcon.png'
import eventIcon from '../../assets/eventIcon.png'
import screenIcon from '../../assets/screenIcon.png'
import opsIcon from '../../assets/ops.png'
import all from '../../assets/all.png'
import { useState, useEffect } from 'react'

// Definizione della classificazione delle macro aree
const classificazione = {
  ops: ['visita', 'compleanni', 'matinee'],
  manutenzione: ['manutenzione'],
  conc: ['delivery', 'promo', 'menu'],
  eventi: ['sopraluogo', 'meeting', 'evento', 'convention', 'privateproj'],
  screenContent: ['prevendite', 'extra', 'anteprima', 'maratona', 'stampa']
}

// eslint-disable-next-line react/prop-types
const Filter = ({ setFilteredEvents }) => {
  const { events } = useEventsStore() // Ottieni gli eventi dal context

  // Stato per gli eventi filtrati

  // Stato per tracciare le icone selezionate
  const [selectedIcons, setSelectedIcons] = useState({
    ops: false,
    manutenzione: false,
    conc: false,
    eventi: false,
    screenContent: false,
    all: false
  })

  // Funzione per gestire la selezione/deselezione di un'icona
  const handleIconClick = (iconName) => {
    console.log('handle click', iconName)
    // Aggiorna lo stato di selezione dell'icona
    if (iconName === 'all') {
      setSelectedIcons({
        ops: false,
        manutenzione: false,
        conc: false,
        eventi: false,
        screenContent: false,
        all: false
      })
    } else {
      setSelectedIcons((prevSelected) => ({
        ...prevSelected,
        [iconName]: !prevSelected[iconName] // Inverte lo stato dell'icona selezionata
      }))
    }
  }

  // Funzione per filtrare gli eventi in base alle macro aree selezionate
  const filterEvents = () => {
    const selectedMacros = Object.keys(selectedIcons).filter((key) => selectedIcons[key])
    console.log(selectedMacros)
    // Se è selezionato 'all', restituisci tutti gli eventi
    if (selectedIcons.all) {
      console.log('ALL')
      return null
    }

    // Se nessuna macro area è selezionata, restituisci tutti gli eventi
    if (selectedMacros.length === 0) {
      return null
    }

    const newArray = events.filter((event) =>
      selectedMacros.some((macro) => {
        // Verifica se la classificazione esiste e include l'eventType
        return classificazione[macro] && classificazione[macro].includes(event.eventType)
      })
    )
    console.log('newArray', newArray)
    return newArray
  }

  // Usa useEffect per filtrare gli eventi ogni volta che cambia la selezione delle icone
  useEffect(() => {
    const newFilteredEvents = filterEvents()

    console.log('newFilteredEvents', newFilteredEvents)
    setFilteredEvents(newFilteredEvents) // Aggiorna gli eventi filtrati
  }, [selectedIcons, events])

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column', // Disposizione a colonna
        alignItems: 'center', // Centra gli elementi orizzontalmente
        justifyContent: 'flex-start', // Allinea gli elementi in alto verticalmente
        gap: 3, // Spaziatura tra gli elementi
        border: '1px solid grey', // Bordo con colore e larghezza
        borderRadius: '8px', // Arrotonda i bordi (opzionale)
        padding: 1, // Aggiunge spazio interno
        width: 'fit-content' // Imposta la larghezza al contenuto
      }}
    >
      <Typography variant="body2" color="grey">
        ops
      </Typography>
      <Tooltip title="Ops">
        <IconButton
          onClick={() => handleIconClick('ops')}
          sx={{
            backgroundColor: selectedIcons.ops ? '#cce7ff' : 'transparent', // Colore di sfondo se selezionato
            borderRadius: '50%' // Arrotonda l'icona se selezionata
          }}
        >
          <img src={opsIcon} alt="Ops Icon" style={{ width: '50px', height: '50px' }} />
        </IconButton>
      </Tooltip>

      <Typography variant="body2" color="grey">
        manut.
      </Typography>
      <Tooltip title="Manutenzione">
        <IconButton
          onClick={() => handleIconClick('manutenzione')}
          sx={{
            backgroundColor: selectedIcons.manutenzione ? '#cce7ff' : 'transparent',
            borderRadius: '50%'
          }}
        >
          <img
            src={maintenanceIcons}
            alt="Manutenzione Icon"
            style={{ width: '50px', height: '50px' }}
          />
        </IconButton>
      </Tooltip>

      <Typography variant="body2" color="grey">
        conc.
      </Typography>
      <Tooltip title="Concession">
        <IconButton
          onClick={() => handleIconClick('conc')}
          sx={{
            backgroundColor: selectedIcons.conc ? '#cce7ff' : 'transparent',
            borderRadius: '50%'
          }}
        >
          <img src={concIcon} alt="Concession Icon" style={{ width: '50px', height: '50px' }} />
        </IconButton>
      </Tooltip>

      <Typography variant="body2" color="grey">
        eventi
      </Typography>
      <Tooltip title="Eventi">
        <IconButton
          onClick={() => handleIconClick('eventi')}
          sx={{
            backgroundColor: selectedIcons.eventi ? '#cce7ff' : 'transparent',
            borderRadius: '50%'
          }}
        >
          <img src={eventIcon} alt="Eventi Icon" style={{ width: '50px', height: '50px' }} />
        </IconButton>
      </Tooltip>

      <Typography variant="body2" color="grey">
        ScreenCont.
      </Typography>
      <Tooltip title="Screen Content">
        <IconButton
          onClick={() => handleIconClick('screenContent')}
          sx={{
            backgroundColor: selectedIcons.screenContent ? '#cce7ff' : 'transparent',
            borderRadius: '50%'
          }}
        >
          <img
            src={screenIcon}
            alt="Screen Content Icon"
            style={{ width: '50px', height: '50px' }}
          />
        </IconButton>
      </Tooltip>

      <Typography variant="body2" color="grey">
        all
      </Typography>
      <Tooltip title="All">
        <IconButton
          onClick={() => handleIconClick('all')}
          sx={{
            backgroundColor: selectedIcons.all ? '#cce7ff' : 'transparent',
            borderRadius: '50%'
          }}
        >
          <img src={all} alt="All Icon" style={{ width: '50px', height: '50px' }} />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default Filter
