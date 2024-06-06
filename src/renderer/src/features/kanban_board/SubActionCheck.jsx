/* eslint-disable react/prop-types */
import { Checkbox, Stack, Typography } from '@mui/material'
import useEventsStore from '../../store/EventDataContext'

export default function CheckBox({ task }) {
  const { upDateTask, setTask } = useEventsStore()

  const onChecked = async (index) => {
    const updatedSubActions = task.subAction.map((subAction, i) =>
      i === index ? { ...subAction, checked: !subAction.checked } : subAction
    )
    const newTask = { ...task, subAction: updatedSubActions }
    upDateTask(newTask, newTask.id)
    setTask(newTask) // Aggiorna lo stato globale
    try {
      await window.api.addNewTask({ task: newTask, upDate: true })
    } catch (error) {
      console.log('task: onChecked:', error)
    }
  }

  return (
    <>
      {task.subAction.map((subAction, i) => (
        <Stack
          key={i}
          direction="row"
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          useFlexGap
        >
          <Typography variant="body2">{subAction.todo}</Typography>
          <Checkbox checked={subAction.checked} onChange={() => onChecked(i)} />
        </Stack>
      ))}
    </>
  )
}
