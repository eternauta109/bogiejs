/* eslint-disable react/prop-types */
import { useDrag } from 'react-dnd'
import { useState } from 'react'
import { Typography, Divider, IconButton, Slider, Grid, Checkbox, Stack } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DoneOutlineTwoToneIcon from '@mui/icons-material/DoneOutlineTwoTone'
import useEventsStore from '../../store/EventDataContext'
import './task.css'

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

export default function Task({ id, task, status }) {
  console.log(task)
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  const [perc, setPerc] = useState(task.percent)
  const [visible, setVisible] = useState(false)

  const { upDateTask, user, deleteTask } = useEventsStore()

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
    const newTask = { ...task, percent: perc }
    setVisible(false)
    try {
      await window.api.addNewTask({ task: newTask, upDate: true })
      upDateTask(newTask, id)
    } catch (error) {
      console.log('task: onpercentchange:', error)
    }
  }

  return (
    <div ref={drag} className={`draggable-item ${status} ${isDragging ? 'dragging' : ''}`}>
      <Typography variant="h8">Task di: {task.manager}</Typography>

      <IconButton
        size="small"
        onClick={() => onHandleCardDelete(id, status)}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>

      <Typography variant="h5">{task.title}</Typography>

      <div className="description">
        <Typography variant="body1" sx={{ mb: 4 }}>
          {task.description}
        </Typography>
      </div>
      <Divider sx={{ margin: '16px 0' }} />
      <Typography variant="body2" color="white">
        sotto-azioni
      </Typography>
      {task.subAction.map((e, key) => (
        <Stack
          direction="row"
          spacing={2}
          key={key}
          justifyContent="space-between"
          alignItems="center"
          useFlexGap
        >
          <Typography variant="body2">{e.todo}</Typography>
          <Checkbox />
        </Stack>
      ))}

      <Divider sx={{ margin: '16px 0' }} />

      <Typography variant="subtitle1">Percentuale di avanzamento</Typography>

      <Grid container spacing={1}>
        <Grid item xs={10}>
          <Slider
            aria-label="Percentuali"
            onChange={onPercentChange}
            getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            value={perc}
            step={10}
            color="secondary"
            marks={marks}
            min={10}
            max={100}
          />
        </Grid>
        <Grid item xs={2}>
          {visible && (
            <IconButton aria-label="confirm" onClick={onConfirmPercentChange}>
              <DoneOutlineTwoToneIcon style={{ color: 'green' }} />
            </IconButton>
          )}
        </Grid>
      </Grid>

      <Divider sx={{ margin: '16px 0' }} />

      <Typography variant="caption">Assegnato da: {task.createdBy}</Typography>
    </div>
  )
}
