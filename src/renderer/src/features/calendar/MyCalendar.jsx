/* eslint-disable react/prop-types */
import { useMemo, useEffect } from 'react'

import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import useEventsStore from '../../store/EventDataContext'

/* import { getEvents } from '../../store/eventsReducer' */

import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

/* const localizer = dayjsLocalizer(dayjs); */
// impostazione del formato data

const locales = {
  'en-US': enUS
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
})

/**
 * We are defaulting the localizer here because we are using this same
 * example on the main 'About' page in Storybook
 */

export default function Basic({ handleOpen }) {
  const { events, setEvent, setEvents } = useEventsStore()

  const { max, views } = useMemo(
    () => ({
      /*  max: dates.add(dates.endOf(new Date(2015, 17, 1), 'day'), -1, 'hours'), */
      views: Object.keys(Views).map((k) => Views[k])
    }),
    []
  )

  //funzione che gestisce la riapertura di un evento sul calendario.
  //upDate in questo caso è settata a true dal componete padre
  const onSelectEvent = (event) => {
    console.log('onSelectEvent', event)
    setEvent(event)
    handleOpen()
  }

  //funzione asincrona che prende gli events dal db con una funzione
  // sotto eventsReducer attenzione ch ein modalita dev
  //events si azzera a ogni ricarica della pagina
  const getEventsFromDb = async () => {
    console.log('getEventsFromDb triggerato')
    const result = await window.api.getAllEvents()
    console.log('result get events from db', result)
    setEvents(result)
  }

  useEffect(() => {
    console.log('useeffect dopo aggiunta event')
  }, [events])

  useEffect(() => {
    getEventsFromDb()
    console.log('calendar effect triggered to take evetns from db')
    return () => {}
  }, [])

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
          onSelectEvent={(event) => onSelectEvent(event)}
          /* onSelectSlot={handleSelect} */
          eventPropGetter={(event) => {
            const backgroundColor = event.eventColorType
            return { style: { backgroundColor } }
          }}
        />
      )}
    </div>
  )
}
