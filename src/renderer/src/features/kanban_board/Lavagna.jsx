import { useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import useEventsStore from '../../store/EventDataContext'
import KanbanBoard from './KanbanBoard'

export default function ColorTabs() {
  const { user } = useEventsStore()
  const [value, setValue] = useState(user.user.userName) // Inizializza il valore al nome dell'utente corrente

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        centered
        aria-label="secondary tabs example"
      >
        {user.managersName.map((name, index) => (
          <Tab key={index} value={name} label={name} />
        ))}
      </Tabs>
      {user.managersName.map((name, index) => (
        <div key={index} hidden={value !== name}>
          {value === name && <KanbanBoard managerName={name} />}
        </div>
      ))}
    </Box>
  )
}
