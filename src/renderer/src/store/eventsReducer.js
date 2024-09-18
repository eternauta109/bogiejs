export const initialEvents = {
  totalEvents: 0,
  events: [],
  newEvent: { subAction: [], description: '', division: '', link: '', note: '' }
}

const eventsReducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case 'ADD_EVENT':
      console.log('ADD_EVENT', payload)
      return {
        ...state,
        events: state.events.concat(payload),
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

    // Aggiungi il caso per la cancellazione di eventi multipli
    case 'DELETE_EVENTS': {
      // Filtra gli eventi rimuovendo quello con l'ID corrispondente
      const updatedEvents = state.events.filter((event) => event.frequencyId !== payload)
      return {
        ...state,
        events: updatedEvents
      }
    }

    case 'UPDATE_EVENT':
      /* console.log("UPDATE_EVENT", payload); */
      return { ...state, events: payload.events }

    case 'SET_EVENT':
      console.log('eventReducer: SET_EVENT: payload:', payload)
      return {
        ...state,
        newEvent: {
          ...payload
        }
      }

    case 'SET_FIELD_EVENT':
      console.log('eventReducer: SET_FIELD_EVENT: payload:', payload)
      return {
        ...state,
        newEvent: {
          ...state.newEvent,
          [payload.campo]: payload.valore
        }
      }

    case 'SET_EVENTS':
      /* console.log("payload SET_EVETN in reducer says:", payload); */
      console.log('eventReducer: SET_EVENTS: payload:', payload)
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
