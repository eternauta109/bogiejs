/* eslint-disable react/prop-types */
import { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import useEventsStore from '../../store/EventDataContext'
import { FormControl, Container, TextField, Button } from '@mui/material'
import SubAction from '../event/eventType/serviceEventType/SubAction'

const NewTaskForm = ({ manager, onHandleClose }) => {
  const { addTask, totalTasks, user, task, setTask } = useEventsStore()

  const maxTitleLength = 30
  const maxDescriptionLength = 240
  const maxNoteLength = 160

  const handleSubmit = async (event) => {
    event.preventDefault()
    // Aggiungi qui la logica per gestire il submit del form
    console.log('Form task submitted!', task, totalTasks)
    const sendNewTaskInStore = {
      ...task,
      manager: manager,
      cinema: user.user.cinema,
      role: user.user.role,
      area: user.user.area,
      createdBy: user.user.userName,
      start: new Date(),
      label: user.user.userName,
      status: `newtask`,
      id: 'task-' + uuidv4()
    }
    console.log('task to save!', sendNewTaskInStore, totalTasks)
    addTask(sendNewTaskInStore)
    onHandleClose()
    await window.api.addNewTask({ task: sendNewTaskInStore, totalTasks: totalTasks, upDate: false })
  }

  useMemo(() => {
    console.log('new task in use memo', task)
  }, [task])

  return (
    <Container
      sx={{
        height: '400px',
        padding: 2,
        mb: 2,
        overflowY: 'auto'
      }}
    >
      {task && (
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth>
            <TextField
              fullWidth
              variant="filled"
              disabled
              value={`new task for:  ${manager}`}
              name="task for"
              onChange={(t) => setTask({ ...task, title: t.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              required
              fullWidth
              label={`title: ${task.title ? task.title.length : 0}/${maxTitleLength}`}
              variant="outlined"
              inputProps={{ maxLength: maxTitleLength }}
              value={task ? task.title : ''}
              name="title"
              onChange={(t) => setTask({ ...task, title: t.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              variant="outlined"
              label={`description: ${task.description ? task.description.length : 0}/${maxDescriptionLength}`}
              multiline
              inputProps={{ maxLength: maxDescriptionLength }}
              rows={4}
              value={task ? task.description : ''}
              name="description"
              onChange={(t) => setTask({ ...task, description: t.target.value })}
              sx={{ mb: 2 }}
            />
            <SubAction subAction={task.subAction} />
            <TextField
              fullWidth
              label={`note: ${task.note ? task.note.length : 0}/${maxNoteLength}`}
              variant="outlined"
              inputProps={{ maxLength: maxNoteLength }}
              value={task ? task.note : ''}
              name="note"
              onChange={(t) => setTask({ ...task, note: t.target.value })}
              sx={{ mb: 2 }}
            />
            <Button fullWidth variant="outlined" type="submit" color="secondary">
              ADD TASK
            </Button>
          </FormControl>
        </form>
      )}
    </Container>
  )
}

export default NewTaskForm
