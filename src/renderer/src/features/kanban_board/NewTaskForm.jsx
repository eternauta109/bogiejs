/* eslint-disable react/prop-types */
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import useEventsStore from '../../store/EventDataContext'
import { FormControl, Container, TextField, Button } from '@mui/material'

const NewTaskForm = ({ manager, onHandleClose }) => {
  const { addTask, totalTasks, emptyTask, user } = useEventsStore()
  const [newTask, setNewTask] = useState({ ...emptyTask })
  console.log(user)

  const handleSubmit = async (event) => {
    event.preventDefault()
    // Aggiungi qui la logica per gestire il submit del form
    console.log('Form task submitted!', newTask, totalTasks)
    const sendNewTaskInStore = {
      ...newTask,
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
  console.log('Form submitted!', newTask, manager, totalTasks)

  /*  useMemo(() => {
    console.log("new task in use memo", newTask);
    return () => {
      setNewTask({ ...emptyTask });
    };
  }, [newTask]); */

  return (
    <Container
      sx={{
        height: '400px',
        padding: 2,
        mb: 2,
        overflowY: 'auto'
      }}
    >
      {newTask && (
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth>
            <TextField
              fullWidth
              variant="filled"
              disabled
              value={`new task for:  ${manager}`}
              name="task for"
              onChange={(t) => setNewTask({ ...newTask, title: t.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              required
              fullWidth
              label="title"
              variant="outlined"
              value={newTask ? newTask.title : ''}
              name="title"
              onChange={(t) => setNewTask({ ...newTask, title: t.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="description"
              variant="outlined"
              multiline
              rows={4}
              value={newTask ? newTask.description : ''}
              name="description"
              onChange={(t) => setNewTask({ ...newTask, description: t.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="note"
              variant="outlined"
              value={newTask ? newTask.note : ''}
              name="note"
              onChange={(t) => setNewTask({ ...newTask, note: t.target.value })}
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
