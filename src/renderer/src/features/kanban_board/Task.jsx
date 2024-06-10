/* eslint-disable react/prop-types */
import { useDrag } from 'react-dnd'
import { useEffect, useState } from 'react'
import { Typography, Divider, IconButton, Slider, Grid, Stack, Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DoneOutlineTwoToneIcon from '@mui/icons-material/DoneOutlineTwoTone'
import useEventsStore from '../../store/EventDataContext'
import LaunchIcon from '@mui/icons-material/Launch'
import './task.css'
import { styled } from '@mui/system'

import SubAction from './../event/eventType/serviceEventType/SubAction'

function valuetext(value) {
  return `${value}%`
}

const marks = [
  {
    value: 10,
    label: '0%'
  },
  {
    value: 50,
    label: '50%'
  },
  {
    value: 100,
    label: '100%'
  }
]

const ScrollableBox = styled(Box)({
  '&::-webkit-scrollbar': {
    height: '8px', // Altezza della barra di scorrimento orizzontale
    width: '8px' // Larghezza della barra di scorrimento verticale
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888', // Colore del pollice della barra di scorrimento
    borderRadius: '4px' // Arrotondamento del pollice
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#555' // Colore del pollice della barra di scorrimento quando hover
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1' // Colore della traccia della barra di scorrimento
  }
})

export default function Task({ id, taskFromParent, status, handleOpenOldTask }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  const [perc, setPerc] = useState(taskFromParent.percent)
  const [visible, setVisible] = useState(false)

  const { upDateTask, user, deleteTask, task, setTask } = useEventsStore()

  const onPercentChange = async (event, newValue) => {
    setPerc(newValue)

    setVisible(true)
  }

  const onHandleCardDelete = async (taskId, status) => {
    console.log('cancello card :', taskId, status)
    if (user.user.role === 'tm' && status === 'completed') {
      deleteTask(taskId)
      await window.api.removeTask(taskId)
    }
  }

  const onConfirmPercentChange = async () => {
    console.log(perc)
    const newTask = { ...taskFromParent, percent: perc }
    setVisible(false)
    try {
      await window.api.addNewTask({ task: newTask, upDate: true })
      upDateTask(newTask, id)
    } catch (error) {
      console.log('task: onpercentchange:', error)
    }
  }
  function calculatePercent() {
    const total = taskFromParent.subAction.length
    const completed = taskFromParent.subAction.filter((subAction) => subAction.checked).length
    const result = (completed / total) * 100

    return result
  }

  useEffect(() => {
    // Questo effetto viene eseguito quando `task` cambia
    console.log('Il task è cambiato', task, visible)
  }, [task, perc])

  useEffect(() => {
    taskFromParent.subAction?.length > 0 && setPerc(calculatePercent())
  }, [taskFromParent.subAction?.length])

  const openOldTask = () => {
    console.log('click')
    setTask(taskFromParent)
    handleOpenOldTask()
  }

  return (
    <div ref={drag} className={`draggable-item ${status} ${isDragging ? 'dragging' : ''}`}>
      <Typography variant="h8">Task di: {taskFromParent.manager}</Typography>
      <IconButton
        size="small"
        onClick={() => onHandleCardDelete(id, status)}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <Divider sx={{ margin: '16px 0' }} />
      <Typography variant="h5">{taskFromParent.title}</Typography>
      <ScrollableBox sx={{ maxHeight: 100, maxWidth: '100%', overflowX: 'auto' }}>
        <Typography variant="body1" sx={{ mb: 4 }}>
          {taskFromParent.description}
        </Typography>
      </ScrollableBox>

      {taskFromParent.subAction && (
        <>
          <Divider sx={{ margin: '16px 0' }} />
          <Box sx={{ maxHeight: 200, maxWidth: '100%', overflowX: 'auto' }}>
            <SubAction type="task" fakeTask={taskFromParent} upDate={true} />
          </Box>
        </>
      )}
      <Divider sx={{ margin: '16px 0' }} />
      <Typography variant="body2" color="green">
        Percentuale di avanzamento
      </Typography>

      <Grid container spacing={1}>
        <Grid item xs={10}>
          <Slider
            aria-label="Percentuali"
            onChange={onPercentChange}
            getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            value={taskFromParent.subAction?.length > 0 ? calculatePercent() : perc}
            step={10}
            color="secondary"
            marks={marks}
            min={10}
            max={100}
          />
        </Grid>
        <Grid item xs={2}>
          {visible && (!taskFromParent.subAction || taskFromParent.subAction.length === 0) && (
            <IconButton aria-label="confirm" onClick={onConfirmPercentChange}>
              <DoneOutlineTwoToneIcon style={{ color: 'green' }} />
            </IconButton>
          )}
        </Grid>
      </Grid>

      <Divider sx={{ margin: '16px 0' }} />
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        useFlexGap
      >
        <Typography variant="caption">Assegnato da: {taskFromParent.createdBy}</Typography>
        <IconButton
          aria-label="close"
          sx={{
            color: (theme) => theme.palette.grey[500]
          }}
          onClick={() => openOldTask()}
        >
          <LaunchIcon />
        </IconButton>
      </Stack>
    </div>
  )
}
