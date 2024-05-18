/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { Card, CardContent, Typography, Divider, IconButton, Slider } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
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
const CustomCard = ({
  id,
  title,
  description,
  createdBy,
  percent,
  onHandleCardDelete,
  laneId,
  onChangeSignal
}) => {
  const { upDateTask } = useEventsStore()
  const [percentValue, setPercentValue] = useState(percent)

  const onPercentChange = async (event, newValue) => {
    console.log('nuova percentuale', newValue, id, event)
    const oldTask = await window.api.getSingleTask(id)
    console.log('CustomCard: oldTask: ricevo il task dal db:', oldTask)

    const newTask = { ...oldTask, percent: newValue }
    console.log('newTask dopo percent:', newTask)
    await window.api.addNewTask({ task: newTask, upDate: false })
    upDateTask(newTask, id)
    onChangeSignal(newValue)
    setPercentValue(newValue)
  }

  useEffect(() => {
    console.log('customcard: useeffect: percentValue:', description, percentValue, percent)
  }, [percentValue])

  return (
    <Card sx={{ marginBottom: 2, position: 'relative', width: 250, maxHeight: 400 }}>
      <IconButton
        size="small"
        onClick={() => onHandleCardDelete(id, laneId)}
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
          {title}
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
          {description}
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
          value={percent}
          step={10}
          color="secondary"
          marks={marks}
          min={10}
          max={100}
        />
        <Divider />
        <Typography variant="body2" gutterBottom>
          assegnato da: {createdBy}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default CustomCard
