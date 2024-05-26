import { useState, useEffect } from 'react'
import { Scheduler } from '@bitnoi.se/react-scheduler'
import { Box } from '@mui/material'

import useEventsStore from '../../store/EventDataContext'

// eslint-disable-next-line react/prop-types
const SchedulerComponent = ({ handleOpen }) => {
  const [filterButtonState, setFilterButtonState] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [transformedEvents, setTransformedEvents] = useState([])
  const { events, setEvent } = useEventsStore()

  const transformEvents = (events) => {
    const groupedData = {}

    events.forEach((event) => {
      const { eventType, id, start, end, title, description, colorEventType: bgColor } = event

      if (!groupedData[eventType]) {
        groupedData[eventType] = {
          id: `id-for-${eventType}`,
          label: {
            title: eventType,
            subtitle: ''
          },
          data: []
        }
      }

      groupedData[eventType].data.push({
        id,
        startDate: new Date(start),
        endDate: new Date(end),
        title,
        subtitle: '',
        description,
        bgColor
      })
    })
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
    const transformed = transformEvents(events)
    setTransformedEvents(transformed)
    setIsLoading(false)
  }, [events])

  return (
    <Box
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
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
    </Box>
  )
}

export default SchedulerComponent

/* 
const mockedSchedulerData = [
  {
    id: '070ac5b5-8369-4cd2-8ba2-0a209130cc60',
    label: { icon: '', title: 'Joe Doe', subtitle: 'Frontend Developer' },
    data: [
      {
        id: 'b088e4ac-9911-426f-aef3-843d75e714c2',
        startDate: new Date('2024-05-20T10:08:22.986Z'),
        endDate: new Date('2024-05-30T12:30:30.150Z'),
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
]
*/
