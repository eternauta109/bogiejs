export const initialEvents = {
  totalEvents: 0,
  events: [],
  newEvent: {
    id: null,
    createdBy: null,
    eventType: 'evento',
    colorDivision: null,
    cinema: null,
    colorEventType: '#F39C12',
    description: '',
    division: null,
    start: new Date(),
    end: new Date(),
    link: null,
    note: '',
    title: '',
    manager: '',
    laneId: 'lane1'
  }
}

const eventsReducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case 'ADD_EVENT':
      /* console.log("ADD_EVENT", payload); */
      return {
        ...state,
        events: payload.events,
        totalEvents: state.totalEvents + 1
      }

    // Aggiungi il caso per la cancellazione dell'evento nel tuo reducer
    case 'DELETE_EVENT': {
      // Filtra gli eventi rimuovendo quello con l'ID corrispondente
      const updatedEvents = state.events.filter((event) => event.id !== payload)
      return {
        ...state,
        events: updatedEvents
      }
    }

    case 'UPDATE_EVENT':
      /* console.log("UPDATE_EVENT", payload); */
      return { ...state, events: payload.events }

    case 'SET_EVENT':
      /* console.log("payload SET_EVETN in reducer says:", payload); */
      return {
        ...state,
        newEvent: {
          ...payload
        }
      }

    case 'SET_EVENTS':
      /* console.log("payload SET_EVETN in reducer says:", payload); */
      console.log('payload.events SET_EVENT in reducer says:', payload)
      return {
        ...state,
        totalEvents: payload.totalEvents,
        events: [...payload.events]
      }

    case 'INIT_EVENT':
      console.log('INIT_EVENT')
      return {
        ...state,
        newEvent: {
          ...initialEvents.newEvent
        }
      }

    default:
      throw new Error('no case for type', type)
  }
}

export default eventsReducer
