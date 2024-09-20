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
  /* eventType: [
    {
      type: 'operations',
      color: '#F39C12'
    },
    {
      type: 'concession',
      color: '#7DCEA0'
    },
    {
      type: 'screen_content',
      color: '#BB8FCE'
    },
    {
      type: 'eventi_sales',
      color: '#AAB7B8'
    },
    {
      type: 'maintenance',
      color: '#448AFF'
    }
  ], */
  colorMap: {
    //ops
    visita: '#1f618d',
    compleanni: '#5499c7',
    matinee: '#2980b9',
    //manutenzione
    manutenzione: '#6699ff',
    //concession
    delivery: '#af7ac5',
    promo: '#9b59b6',
    menu: '#633974',
    //evento
    sopraluogo: '#f7dc6f',
    meeting: '#f4d03f',
    evento: '#d4ac0d',
    convention: '#d4ac0d',
    privateproj: '#9a7d0a',
    //screencontent
    prevendite: '#7dcea0',
    extra: '#52be80',
    anteprima: '#27ae60 ',
    maratona: '#1e8449 ',
    stampa: '#196f3d'
  },
  topicType: [
    { value: 'none', label: 'none' },
    { value: 'utility', label: 'utlity' },
    { value: 'cascading', label: 'cascading' },
    { value: 'suggest', label: 'abitudini' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'procedur', label: 'procedura interna' },
    { value: 'brief', label: 'brief' },
    { value: 'file', label: 'file' },
    { value: 'module', label: 'modulo' },
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
