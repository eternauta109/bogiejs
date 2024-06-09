import { useState, useEffect } from 'react'
import { Scheduler } from '@bitnoi.se/react-scheduler'
import { Box } from '@mui/material'

import useEventsStore from '../../store/EventDataContext'
import { format } from 'date-fns'

// eslint-disable-next-line react/prop-types
const SchedulerComponent = ({ handleOpen }) => {
  const [filterButtonState, setFilterButtonState] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [transformedEvents, setTransformedEvents] = useState([])
  const { events, setEvent } = useEventsStore()

  const hexToRgba = (hex, alpha) => {
    let r = 0,
      g = 0,
      b = 0
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16)
      g = parseInt(hex[2] + hex[2], 16)
      b = parseInt(hex[3] + hex[3], 16)
    } else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16)
      g = parseInt(hex[3] + hex[4], 16)
      b = parseInt(hex[5] + hex[6], 16)
    }
    return `rgba(${r},${g},${b},${alpha})`
  }

  /* const formatDateToISOString = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS")
    const isoString = new Date(formattedDate).toISOString()
    return isoString
  } */

  const transformEvents = () => {
    const groupedData = {}

    console.log('transformEvents: events', events)
    events.forEach((event) => {
      const { eventType, id, start, end, title, description, colorEventType } = event

      if (!groupedData[eventType]) {
        groupedData[eventType] = {
          id: `${eventType}`,
          label: {
            title: eventType,
            subtitle: ''
          },
          data: []
        }
      }

      const bgColor = hexToRgba(colorEventType, 0.5)

      groupedData[eventType].data.push({
        id,
        startDate: new Date(format(start, 'yyyy-MM-dd')),
        endDate: new Date(format(end, 'yyyy-MM-dd')),
        title,
        subtitle: '',
        description,
        bgColor
      })
    })
    console.log('groupedData', groupedData)
    return Object.values(groupedData)
  }

  //funzione che gestisce la riapertura di un evento sul calendario.
  //upDate in questo caso è settata a true dal componete padre
  const onSelectEvent = (event) => {
    console.log('onSelectEvent', event)
    const eventSelected = events.find((e) => e.id === event.id)
    console.log('onSelectEvent', eventSelected)
    setEvent(eventSelected)
    handleOpen()
  }

  useEffect(() => {
    setIsLoading(true)
    const transformed = transformEvents()
    setTransformedEvents(transformed)
    setIsLoading(false)
  }, [events, setEvent])

  return (
    <Box
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '90vh' }}>
        <Scheduler
          data={transformedEvents}
          isLoading={isLoading}
          onRangeChange={(newRange) => console.log(newRange)}
          onTileClick={(clickedResource) => onSelectEvent(clickedResource)}
          onItemClick={(item) => console.log(item)}
          onFilterData={() => setFilterButtonState(1)}
          onClearFilterData={() => setFilterButtonState(0)}
          config={{ zoom: 1, filterButtonState }}
          style={{ flex: 0 }}
        />
      </div>
    </Box>
  )
}

export default SchedulerComponent

/* const mockedSchedulerData = [
  {
    id: '070ac5b5-8369-4cd2-8ba2-0a209130cc60',
    label: { icon: '', title: 'Joe Doe', subtitle: 'Frontend Developer' },
    data: [
      {
        id: 'b088e4ac-9911-426f-aef3-843d75e714c2',
        startDate: new Date('2024-06-04T09:31:08.218Z'),
        endDate: new Date('2024-06-04T09:31:08.218Z'),
        occupancy: 11111,
        title: 'Project D',
        subtitle: 'Subtitle D',
        description: 'Garden heavy an software Metal',
        bgColor: 'rgb(254,165,177)'
      },
      {
        id: 'b088f4ac-9915-426f-aef3-843d75e714c2',
        startDate: new Date('2024-06-04T09:31:08.218Z'),
        endDate: new Date('2024-06-04T09:31:08.218Z'),
        occupancy: 11111,
        title: 'Project D',
        subtitle: 'Subtitle D',
        description: 'Garden heavy an software Metal',
        bgColor: 'rgb(254,165,177)'
      }
    ]
  },
  {
    id: '070ac5b5-8369-4cd2-8ba2-0a209130kk70',
    label: { icon: '', title: 'fabioc', subtitle: 'Frontend Developer' },
    data: []
  }
] */
