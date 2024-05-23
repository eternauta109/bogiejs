/* eslint-disable react/prop-types */
import { useDrag } from 'react-dnd'
import { useState, useEffect } from 'react'
import { Card, CardContent, Typography, Divider, IconButton, Slider } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
/* import useEventsStore from '../../store/EventDataContext' */

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

  /* const { upDateTask } = useEventsStore() */
  const [percentValue, setPercentValue] = useState(task.percent || 10)

  const onPercentChange = async (event, newValue) => {
    console.log('nuova percentuale', newValue, id, event)
    setPercentValue(newValue)
  }

  useEffect(() => {
    console.log(
      'customcard: useeffect: percentValue:',
      task.description,
      percentValue,
      task.percent
    )
  }, [percentValue])

  return (
    <div ref={drag} className={`draggable-item ${status} ${isDragging ? 'dragging' : ''}`}>
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
          <Slider
            aria-label="Percentuali"
            onChange={onPercentChange}
            getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            value={percentValue}
            step={10}
            color="secondary"
            marks={marks}
            min={10}
            max={100}
          />
          <Divider />
          <Typography variant="body2" gutterBottom>
            assegnato da: {task.createdBy}
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}
