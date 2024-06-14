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

export default function Basic({ handleOpen }) {
  const { events, setEvent, setEvents } = useEventsStore()

  const { max, views } = useMemo(
    () => ({
      views: [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA] // Remove 'WORK_WEEK' from here
    }),
    []
  )

  const onSelectEvent = (event) => {
    console.log('onSelectEvent', event)
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
    const backgroundColor = event.colorEventType
    return { style: { backgroundColor } }
  }

  return (
    <div className="calendarContainer">
      {events && (
        <Calendar
          localizer={localizer}
          max={max}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 880 }}
          selectable={true}
          step={60}
          views={views}
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
