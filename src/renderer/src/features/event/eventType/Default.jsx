/* eslint-disable react/prop-types */

import { useEffect } from 'react'
import { Box } from '@mui/material'
import useEventsStore from '../../../store/EventDataContext'
import { DateTimeRange } from './serviceEventType/Field'

const Default = () => {
  const { event, setEvent } = useEventsStore()
  useEffect(() => {
    setEvent({
      eventType: !event.evetType && 'evento',
      colorEventType: !event.evetType && '#FD102B',
      start: new Date(),
      end: new Date(),
      subAction: []
    })
    return () => {
      console.log('lascio classic event da useffect con event=:', event)
    }
  }, [])
  return (
    <>
      <Box>
        <DateTimeRange />
      </Box>
    </>
  )
}

export default Default
