export const initialTopic = {
  totalTopics: 0,
  topics: [],
  newTopic: {
    id: 0,
    createdBy: null,
    dateStart: new Date(),
    topicArgument: '',
    typeDocument: '',
    topicType: '',
    office: '',
    priority: '',
    link: '',
    note: '',
    managers: [],
    tmVeto: false,
    isNew: true
  }
}

const topicReducer = (state, action) => {
  const { type } = action

  switch (type) {
    case 'ADD_TOPIC':
      /* console.log("ADD_EVENT", payload); */
      console.log('ADD_TOPIC in reducer', action)

      return {
        ...state,
        topics: [...state.topics, action.payload],
        totalTopics: state.totalTopics + 1
      }
    case 'UPDATE_TOPIC': {
      const { payload } = action
      console.log('UPDATE_TOPIC', state.topics, payload)
      const topicIndex = state.topics.findIndex((topic) => topic.id === payload.id)
      const updatedTopic = { ...state.topics[topicIndex], ...payload.topic }
      const updatedTopics = [...state.topics]
      updatedTopics[topicIndex] = updatedTopic
      return { ...state, topics: updatedTopics }
    }

    case 'DELETE_TOPIC':
      return {
        ...state,
        topics: state.topics.filter((topic) => topic.id !== action.payload.id)
      }
    case 'SET_TOPICS':
      console.log('payload.topics SET_TOPICS in reducer says:', action.payload)
      return {
        ...state,
        totalTopics: action.payload.totalTopics,
        topics: [...action.payload.topics]
      }

    default:
      throw new Error('no case for type', type)
  }
}

export default topicReducer
