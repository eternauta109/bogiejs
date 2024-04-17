import { useEffect, useState, useMemo } from 'react'
import { Container, Typography, Box, Button } from '@mui/material'
import Board from 'react-trello'
import useEventsStore from '../../store/EventDataContext'
import TaskModal from './TaskModal'
/* import CustomCard from './CustomCard' */

const styleLane = {
  width: 270,
  overflowY: 'auto',
  backgroundColor: '#B39DDB',
  color: '#fff',

  boxShadow: '2px 2px 4px 0px rgba(0,0,0,0.75)'
}

const Kanban = () => {
  const { tasks, upDateTask, user, setTasks, totalTasks, deleteTask } = useEventsStore()
  const [openNewTask, setOpenNewTask] = useState(false)
  const [selectedManager, setSelectedManager] = useState()

  const handleOpenNewTask = () => setOpenNewTask(true)
  const handleCloseNewTask = () => setOpenNewTask(false)

  const [dataKanban, setDataKanban] = useState([])

  const onhandleDragEnd = async (cardId, sourceLaneId, targetLaneId) => {
    const sourceManager = sourceLaneId.split('-')[1]
    const targetManager = targetLaneId.split('-')[1]
    console.log('spostamenti di lane', sourceManager, targetManager)

    const finder = tasks.find((task) => task.id === cardId)

    if (sourceManager !== targetManager) {
      const newTask = {
        ...finder,
        laneId: targetLaneId,
        manager: targetManager
      }
      upDateTask(newTask, cardId)
      await window.api.addNewTask({ task: newTask })
    } else {
      const newTask = { ...finder, laneId: targetLaneId }
      upDateTask(newTask, cardId)
      await window.api.addNewTask({ task: newTask })
    }
  }

  //funzione asincrona che prende i task dal db con una funzione
  // sotto taskReducer attenzione ch ein modalita dev
  //task si azzera a ogni ricarica della pagina
  const getTasksFromDb = async () => {
    console.log('getTasksFromDb triggerato')
    await window.api.getAllTasks().then((args) => {
      console.log('getTasksFromDb result:', args)
      setTasks(args)
    })
  }

  //funzione che cancella una task solo se l'user è tm e la lane e quella
  //completed. se queste condizioni sono verificate, procedo con la chiamata della funzione
  // su taskReducer
  const onHandleCardDelete = async (taskId, laneId) => {
    console.log('cancello card :', taskId, laneId, user.user)
    if (user.user.role === 'tm' && laneId.endsWith('-completed')) {
      console.log('cancello card :', taskId, laneId, user.user)
      deleteTask(taskId)
      await window.api.removeTask(taskId)
    }
  }

  //prendo tutte le task
  useEffect(() => {
    getTasksFromDb()
    return () => {}
  }, [])

  //creo l'array per le lanes
  useMemo(() => {
    console.log('task in use effect di kanban', tasks, totalTasks)
    const updatedDataKanban = user?.managersName.map((manager) => ({
      manager: manager,
      data: {
        lanes: [
          {
            id: `lane-${manager}`,
            title: 'to do task',
            label: '',
            style: {
              ...styleLane,
              backgroundColor: '#B39DDB'
            },
            cards: tasks.filter(
              (task) => task.manager === manager && task.laneId === `lane-${manager}`
            )
          },
          {
            id: `lane-${manager}-in-progress`,
            title: 'in svolgimento',
            label: '',
            style: {
              ...styleLane,
              backgroundColor: '#F9A825'
            },

            cards: tasks.filter(
              (task) => task.manager === manager && task.laneId === `lane-${manager}-in-progress`
            )
          },
          {
            id: `lane-${manager}-completed`,
            title: 'Completi',
            label: '',

            style: {
              ...styleLane,
              backgroundColor: '#689F38'
            },
            cards: tasks.filter(
              (task) => task.manager === manager && task.laneId === `lane-${manager}-completed`
            )
          },
          {
            id: `lane-${manager}-blocked`,
            title: 'in stallo',
            label: '',
            style: {
              ...styleLane,
              backgroundColor: '#9E9E9E'
            },

            cards: tasks.filter(
              (task) => task.manager === manager && task.laneId === `lane-${manager}-blocked`
            )
          }
        ]
      }
    }))
    console.log('mappa lane da kanban', updatedDataKanban)
    setDataKanban(updatedDataKanban)
  }, [tasks.length])

  return (
    <Container>
      {dataKanban.map(({ manager, data }) => (
        <Box key={manager} sx={{ mt: '30px' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              border: '2px dashed grey'
            }}
          >
            <Typography>{manager}</Typography>
            <Button
              variant="contained"
              sx={{
                borderRadius: '50%',
                backgroundColor: 'orange',
                color: 'white'
              }}
              onClick={() => {
                setSelectedManager(manager)
                handleOpenNewTask()
              }}
            >
              +
            </Button>
          </Box>
          <Board
            style={{ height: '500px', marginTop: '20px', overflowY: 'auto' }}
            data={data} // Passa direttamente l'oggetto data
            handleDragEnd={onhandleDragEnd}
            onCardDelete={onHandleCardDelete}
          />
        </Box>
      ))}
      <TaskModal manager={selectedManager} open={openNewTask} handleClose={handleCloseNewTask} />
    </Container>
  )
}

export default Kanban
