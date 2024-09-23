/* eslint-disable react/prop-types */
import { useMemo, useEffect } from 'react'

import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
/* import enUS from 'date-fns/locale/en-US' */
import it from 'date-fns/locale/it'
import useEventsStore from '../../store/EventDataContext'

import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar.css'

/* const locales = {
  'en-US': enUS
} */

const locales = {
  it: it
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => {
    const day = getDay(date)
    return day === 5 ? date : startOfWeek(date, { weekStartsOn: 5 }) // Start week on Friday
  },
  getDay,
  locales
})

export default function Basic({ handleOpen, setRicorency, filteredEvents }) {
  const { events, setEvent, setEvents } = useEventsStore()

  const { views } = useMemo(
    () => ({
      views: [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA] // Remove 'WORK_WEEK' from here
    }),
    []
  )

  const onSelectEvent = (event) => {
    console.log('onSelectEvent', event)
    event.eventType === 'ricorrenza' ? setRicorency(true) : setRicorency(false)
    setEvent(event)
    handleOpen()
  }

  const getEventsFromDb = async () => {
    console.log('getEventsFromDb triggerato')
    try {
      const result = await window.api.getAllEvents()
      console.log('result get events from db', result)
      setEvents(result) // Assicurati di impostare gli eventi correttamente
    } catch (error) {
      console.error('MyCalendar: getEventsFromDb: Error fetching events:', error)
      // Gestisci l'errore, magari impostando uno stato di errore per mostrarlo nell'interfaccia utente
    }
  }

  useEffect(() => {
    console.log('useeffect dopo aggiunta event')
  }, [events])

  useEffect(() => {
    getEventsFromDb()
    console.log('calendar effect triggered to take evetns from db')
    return () => {}
  }, [])

  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: event.colorEventType // Use event's background color
    }

    // Check if eventType is 'ricorrenza' and execute is true
    if (event.eventType === 'ricorrenza' && event.execute) {
      style = {
        ...style,
        border: '4px solid green' // Add a green border
      }
    }

    return { style }
  }

  // Define start and end times for the DAY view
  const minTime = new Date()
  minTime.setHours(0, 0, 0) // Start time: 6:00 AM

  const maxTime = new Date()
  maxTime.setHours(23, 59, 59) // End time: 3:00 AM (27 = 24 + 3)

  return (
    <div className="calendarContainer">
      {events && (
        <Calendar
          localizer={localizer}
          events={filteredEvents?.length > 0 ? filteredEvents : events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 880 }}
          selectable={true}
          step={60}
          views={views}
          min={minTime} // Set the minimum time shown in the day view
          max={maxTime} // Set the maximum time shown in the day view
          onSelectEvent={onSelectEvent}
          eventPropGetter={eventStyleGetter}
          components={{
            month: {
              dateHeader: ({ label }) => <span>{label}</span> // Custom component to show more events in month view
            },
            event: ({ event }) => (
              <span>
                <strong>{event.title}</strong>
                {event.desc && ':  ' + event.desc}
              </span>
            )
          }}
        />
      )}
    </div>
  )
}
