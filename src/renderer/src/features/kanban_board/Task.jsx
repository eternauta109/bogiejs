/* eslint-disable react/prop-types */
import { useDrag } from 'react-dnd'
import { useState } from 'react'
import { Card, CardContent, Typography, Divider, IconButton, Slider, Grid } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DoneOutlineTwoToneIcon from '@mui/icons-material/DoneOutlineTwoTone'
import useEventsStore from '../../store/EventDataContext'

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

export default function Task({ id, task, onHandleCardDelete, status }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  const [perc, setPerc] = useState(task.percent)
  const [visible, setVisible] = useState(false)

  const { upDateTask } = useEventsStore()

  const onPercentChange = async (event, newValue) => {
    setPerc(newValue)
    setVisible(true)
  }

  const onConfirmPercentChange = async () => {
    console.log(perc)
    const newTask = { ...task, percent: perc }
    setVisible(false)
    try {
      await window.api.addNewTask({ task: newTask, upDate: false })
      upDateTask(newTask, id)
    } catch (error) {
      console.log('task: onpercentchange:', error)
    }
  }

  return (
    <div ref={drag} className={`draggable-item ${status} ${isDragging ? 'dragging' : ''}`}>
      <h6>task di: {task.manager}</h6>
      <Card sx={{ marginBottom: 2, position: 'relative', width: 'auto', maxHeight: 400 }}>
        <IconButton
          size="small"
          onClick={() => onHandleCardDelete(id, status)}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <CardContent sx={{ overflowWrap: 'break-word' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ overflowWrap: 'break-word', whiteSpace: 'normal' }}
          >
            {task.title}
          </Typography>
          <Divider />
          <Typography
            sx={{
              mb: 1.5,
              overflowWrap: 'break-word',
              whiteSpace: 'normal',
              maxHeight: 100,
              overflowY: 'auto'
            }}
            color="text.secondary"
          >
            {task.description}
          </Typography>

          <Divider />
          <Typography variant="caption" display="block" gutterBottom sx={{ mt: 2 }}>
            percentuale di avanzamento
          </Typography>
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
                <IconButton aria-label="delete" onClick={() => onConfirmPercentChange()}>
                  <DoneOutlineTwoToneIcon style={{ color: 'green' }} />
                </IconButton>
              )}
            </Grid>
          </Grid>

          <Divider />
          <Typography variant="body2" gutterBottom>
            assegnato da: {task.createdBy}
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}
