import { createContext, useReducer, useContext } from 'react'
import eventsReducer, { initialEvents } from './eventsReducer'
import taskReducer, { initialTask } from './taskReducer'
import topicsReducer, { initialTopic } from './topicsReducer'
import userReducer, { initialUser } from './userReducer'
import optionsReducer, { initialOption } from './optionsReducer'

export const initialDataContext = {
  events: initialEvents,
  tasks: initialTask,
  topics: initialTopic,
  user: initialUser,
  option: initialOption
}

export const EventDataContext = createContext(initialDataContext)

// eslint-disable-next-line react/prop-types
export const EventStoreContext = ({ children }) => {
  const [eventState, deispatchEvent] = useReducer(eventsReducer, initialEvents)
  const [taskState, taskDispatch] = useReducer(taskReducer, initialTask)
  const [topicState, topicDispatch] = useReducer(topicsReducer, initialTopic)
  const [userState, userDispatch] = useReducer(userReducer, initialUser)
  const [optionsState, optionDispatch] = useReducer(optionsReducer, initialOption)

  //USER ACTION
  const setUser = (args) => {
    console.log('ricevo args per login user: ', args)
    userDispatch({
      type: 'SET_USER',
      payload: { ...args }
    })
  }

  const setUsersName = (usersName) => {
    console.log('ricevo userNames: ', usersName)
    userDispatch({
      type: 'SET_NAMES',
      payload: [...usersName]
    })
  }

  const deleteNotify = (newArrayNotify) => {
    console.log('EDC riceve array notify', newArrayNotify)
    userDispatch({
      type: 'SET_NOTIFICATION',
      payload: newArrayNotify
    })
  }

  //Topic ACTION
  const setTopics = (args) => {
    console.log('SET TOPICS EDC: ', args)
    topicDispatch({
      type: 'SET_TOPICS',
      payload: args
    })
  }

  const addTopic = (topic) => {
    topicDispatch({
      type: 'ADD_TOPIC',
      payload: topic
    })
  }

  const upDateTopic = (topic, id) => {
    topicDispatch({
      type: 'UPDATE_TOPIC',
      payload: { topic, id }
    })
  }

  const deleteTopic = (id) => {
    topicDispatch({
      type: 'DELETE_TOPIC',
      payload: { id }
    })
  }

  //Action EVENT

  const addEvent = (event) => {
    const updateEvents = eventState.events.concat(event)
    deispatchEvent({
      type: 'ADD_EVENT',
      payload: { events: updateEvents }
    })
  }

  const upDateEvent = (event, id) => {
    let updateEvents = eventState.events
    let updateEvent = eventState.events.findIndex((e) => e.id === id)
    updateEvents[updateEvent] = event
    deispatchEvent({
      type: 'UPDATE_EVENT',
      payload: { events: updateEvents }
    })
  }

  const initEvent = () => {
    deispatchEvent({
      type: 'INIT_EVENT'
    })
  }

  const deleteEvent = (eventId) => {
    deispatchEvent({
      type: 'DELETE_EVENT',
      payload: eventId
    })
  }

  const setEvent = (event) => {
    deispatchEvent({
      type: 'SET_EVENT',
      payload: event
    })
  }

  const setEvents = (args) => {
    console.log('SET EVENTS EDC: ', args)
    deispatchEvent({
      type: 'SET_EVENTS',
      payload: args
    })
  }

  //Azioni TASK ############################

  const deleteTask = (taskId) => {
    taskDispatch({
      type: 'DELETE_TASK',
      payload: taskId
    })
  }

  const addTask = (task) => {
    const newTasks = taskState.tasks.concat(task)
    taskDispatch({
      type: 'ADD_TASK',
      payload: { tasks: newTasks }
    })
  }

  const upDateTask = (task, id) => {
    let updateTasks = taskState.tasks
    let updateTask = taskState.tasks.findIndex((e) => e.id === id)
    updateTasks[updateTask] = task
    taskDispatch({
      type: 'UPDATE_TASK',
      payload: { tasks: updateTasks }
    })
  }

  const setTasks = (args) => {
    console.log('SET TASKS EDC: ', args)
    taskDispatch({
      type: 'SET_TASKS',
      payload: args
    })
  }

  const value = {
    //options
    options: optionsState,
    //USER
    user: userState,
    setUser,
    setUsersName,
    deleteNotify,
    //TOPICS
    totalTopics: topicState.totalTopics,
    emptyTopic: initialTopic.newTopic,
    topics: topicState.topics,
    addTopic,
    upDateTopic,
    deleteTopic,
    setTopics,

    //EVENT

    totalEvent: eventState.totalEvents,
    events: eventState.events,
    eventToUpdate: eventState.newEvent,
    emptyEvent: initialEvents.newEvent,
    addEvent,
    upDateEvent,
    initEvent,
    setEvent,
    setEvents,
    deleteEvent,

    //TASK

    tasks: taskState.tasks,
    totalTasks: taskState.totalTasks,
    emptyTask: initialTask.newTask,
    initialTask,
    addTask,
    upDateTask,
    deleteTask,
    setTasks
  }
  return <EventDataContext.Provider value={value}>{children}</EventDataContext.Provider>
}

const useEventsStore = () => {
  const context = useContext(EventDataContext)
  if (context === undefined) {
    throw new Error('useData must be used with DataContext')
  }
  return context
}

export default useEventsStore
