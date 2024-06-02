export const initialOption = {
  MAXTITLELENGTH: 40,
  MAXDESCRIPTIONLENGTH: 240,
  MAXNOTELENGTH: 140,
  divisions: [
    {
      nameDivision: 'marketing',
      color: '#F39C12'
    },
    {
      nameDivision: 'operations',
      color: '#7DCEA0'
    },
    {
      nameDivision: 'pricing',
      color: '#BB8FCE'
    },
    {
      nameDivision: 'facilities',
      color: '#AAB7B8'
    },
    {
      nameDivision: 'screencontent',
      color: '#448AFF'
    },
    {
      nameDivision: 'actionpoint',
      color: '#EF5350'
    },
    {
      nameDivision: 'brief',
      color: '#90A4AE'
    }
  ],
  eventType: [
    {
      type: 'evento',
      color: '#F39C12'
    },
    {
      type: 'matineè',
      color: '#7DCEA0'
    },
    {
      type: 'prevendite',
      color: '#BB8FCE'
    },
    {
      type: 'promo',
      color: '#AAB7B8'
    },
    {
      type: 'compleanni',
      color: '#448AFF'
    },
    {
      type: 'extra',
      color: '#EF5350'
    }
  ],
  topicType: [
    { value: 'none', label: 'none' },
    { value: 'cascading', label: 'cascading' },
    { value: 'suggest', label: 'abitudini' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'procedur', label: 'procedura interna' },
    { value: 'brief', label: 'brief' },
    { value: 'internalComunication', label: 'comunicazione da sede' }
  ],
  docTypes: [
    { value: 'none', label: 'none' },
    { value: 'presentazione', label: 'presentazione' },
    { value: 'pdf', label: 'pdf' },
    { value: 'office', label: 'office' },
    { value: 'excel', label: 'excel' }
  ],
  officeTypes: [
    { value: 'none', label: 'none' },
    { value: 'marketing', label: 'marketing' },
    { value: 'hr', label: 'hr' },
    { value: 'operations', label: 'operations' },
    { value: 'pricing', label: 'pricing' },
    { value: 'filmcontent', label: 'Film Content' },
    { value: 'it', label: 'it' },
    { value: 'finance', label: 'finance' }
  ]
}

const optionsReducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case 'SET_OPTIONS':
      console.log('optionsReducer: SET_OPTIONS: state, action', state, action)
      return { ...payload }

    default:
      throw new Error('no case for type', type)
  }
}

export default optionsReducer
