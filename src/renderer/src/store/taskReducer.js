export const initialTask = {
  totalTasks: 0,
  tasks: [],
  newTask: {
    id: null,
    createdBy: null,
    colorType: '#F39C12',
    description: '',
    start: new Date(),
    percent: 0,
    /* end: new Date(), */
    note: '',
    title: '',
    manager: '',
    subAction: []
  }
}

const taskReducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case 'ADD_TASK':
      console.log('ADD_TASK', payload)
      return {
        ...state,
        tasks: payload.tasks,
        totalTasks: state.totalTasks + 1
      }

    case 'SET_TASK':
      console.log('taskReducer: SET_TASK: payload:', payload)
      return {
        ...state,
        newTask: {
          ...payload
        }
      }

    case 'INIT_TASK':
      console.log('taskReducer: INIT_TASK')
      return {
        ...state,
        newTask: {
          ...initialTask.newTask
        }
      }

    case 'UPDATE_TASK':
      return { ...state, tasks: payload.tasks }

    case 'DELETE_TASK': {
      // Filtra gli eventi rimuovendo quello con l'ID corrispondente
      const updatedTasks = state.tasks.filter((event) => event.id !== payload)

      return {
        ...state,
        tasks: updatedTasks
      }
    }
    case 'SET_TASKS':
      console.log('payload.tasks SET_TASKS in reducer says:', payload)
      return {
        ...state,
        totalTasks: payload.totalTasks,
        tasks: [...payload.tasks]
      }

    default:
      throw new Error('no case for type', type)
  }
}

export default taskReducer
