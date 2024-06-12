/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { useDrop } from 'react-dnd'
import Task from './Task'
import DnDContext from './DnDContext'
import TaskModal from './TaskModal'
import { Button, Box, Switch, FormControlLabel, Stack } from '@mui/material'
import './KanbanBoard.css'
import useEventsStore from '../../store/EventDataContext'

const KanbanBoard = ({ managerName }) => {
  const { tasks, setTasks, initTask } = useEventsStore()
  const [columns, setColumns] = useState({})
  const [openNewTask, setOpenNewTask] = useState(false)
  const [upDate, setUpDate] = useState()
  const [expanse, setExpanse] = useState(false)

  const handleOpenNewTask = () => {
    initTask()
    setUpDate(false)
    setOpenNewTask(true)
  }

  const handleOpenOldTask = () => {
    setUpDate(true)
    setOpenNewTask(true)
  }

  const handleCloseNewTask = () => {
    setOpenNewTask(false)
  }

  const moveTask = async (taskId, targetStatus) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task || task.status === targetStatus) return // Controlla se il task esiste e se il nuovo stato è diverso

    const taskAggiornato = { ...task, status: targetStatus }
    console.log('Ho spostato questo task:', taskAggiornato)
    try {
      await window.api.addNewTask({ task: taskAggiornato })
      const updatedTasks = tasks.map((t) => (t.id === taskId ? taskAggiornato : t))
      setTasks({ ...tasks, tasks: updatedTasks })

      setColumns((prevColumns) => {
        const sourceColumn = { ...prevColumns[task.status] }
        const targetColumn = { ...prevColumns[targetStatus] }
        sourceColumn.items = sourceColumn.items.filter((item) => item.id !== taskId)
        targetColumn.items = [...targetColumn.items, taskAggiornato]

        return {
          ...prevColumns,
          [task.status]: sourceColumn,
          [targetStatus]: targetColumn
        }
      })
    } catch (error) {
      console.error('Errore durante lo spostamento del task:', error)
    }
  }

  const getTasksFromDb = async () => {
    try {
      const tasksFromDb = await window.api.getAllTasks(managerName)
      setTasks(tasksFromDb)
    } catch (error) {
      console.error('Errore durante il recupero dei task dal DB:', error)
    }
  }

  useEffect(() => {
    getTasksFromDb()
  }, [])

  useEffect(() => {
    const filterTasksByStatusAndManager = (status, manager) =>
      tasks.filter(
        (task) => task.status === status && (manager === 'all' || task.manager === manager)
      )

    const initialColumns = {
      newtask: {
        name: 'New Task',
        items: filterTasksByStatusAndManager('newtask', managerName)
      },
      incharge: {
        name: 'In Charge',
        items: filterTasksByStatusAndManager('incharge', managerName)
      },
      completed: {
        name: 'Completed',
        items: filterTasksByStatusAndManager('completed', managerName)
      },
      blocked: {
        name: 'Blocked',
        items: filterTasksByStatusAndManager('blocked', managerName)
      }
    }

    setColumns(initialColumns)
  }, [managerName, tasks, expanse])

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Stack direction="row" spacing={2} sx={{ my: 2 }}>
        {managerName !== 'all' && (
          <Button
            variant="contained"
            sx={{
              mt: 2,
              mb: 2,
              borderRadius: '50%',
              backgroundColor: 'orange',
              color: 'white',
              width: '40px',
              height: '40px',
              minWidth: 'unset'
            }}
            onClick={handleOpenNewTask}
          >
            +
          </Button>
        )}
        <FormControlLabel
          value={expanse ? 'comprimi' : 'espandi'}
          control={
            <Switch
              checked={expanse}
              onChange={(e) => setExpanse(e.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          }
          label={!expanse ? 'comprimi' : 'espandi'}
          labelPlacement="start"
        />
      </Stack>
      <DnDContext>
        <div className="kanban-board">
          {Object.entries(columns).map(([columnId, column]) => (
            <Column
              key={columnId}
              columnId={columnId}
              name={column.name}
              items={column.items}
              moveTask={moveTask}
              handleOpenOldTask={handleOpenOldTask}
              expanse={expanse}
            />
          ))}
        </div>
      </DnDContext>
      <TaskModal
        manager={managerName}
        open={openNewTask}
        handleClose={handleCloseNewTask}
        upDate={upDate}
      />
    </Box>
  )
}

const Column = ({ columnId, name, items, moveTask, handleOpenOldTask, expanse }) => {
  const [, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => moveTask(item.id, columnId)
  })

  return (
    <div className={`column ${columnId}`} ref={drop}>
      <h2>
        {name} ({items.length})
      </h2>
      <div className="droppable-col">
        {items.map((item, index) => (
          <Task
            key={index}
            id={item.id}
            taskFromParent={item}
            status={item.status}
            expanse={expanse}
            handleOpenOldTask={handleOpenOldTask}
          />
        ))}
      </div>
    </div>
  )
}

export default KanbanBoard
