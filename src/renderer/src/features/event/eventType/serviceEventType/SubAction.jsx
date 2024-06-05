/* eslint-disable react/prop-types */
import useEventsStore from '../../../../store/EventDataContext'
import { Box, Typography, IconButton, TextField, InputAdornment } from '@mui/material'
import LibraryAddTwoToneIcon from '@mui/icons-material/LibraryAddTwoTone'

import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone'
import { useEffect } from 'react'

export default function SubAction() {
  const { task, setTask } = useEventsStore()

  const addSubAction = () => {
    const newSubAction = {
      todo: '',
      check: false
    }
    setTask({ ...task, subAction: [...task.subAction, newSubAction] })
  }

  const deleteSubAction = (index) => {
    const updatedSubActions = task.subAction.filter((_, i) => i !== index)
    setTask({ ...task, subAction: updatedSubActions })
  }

  const handleChange = (index, event) => {
    const updatedSubActions = task.subAction.map((subAction, i) =>
      i === index ? { ...subAction, todo: event.target.value } : subAction
    )
    setTask({ ...task, subAction: updatedSubActions })
  }

  useEffect(() => {
    console.log('subAction: task: ', task)
  }, [])

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="body2" color="red" sx={{ flexGrow: 1 }}>
          aggiungi una sub-action:
        </Typography>
        <IconButton
          aria-label="close"
          onClick={addSubAction}
          sx={{
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <LibraryAddTwoToneIcon />
        </IconButton>
      </Box>
      {task.subAction.map((el, key) => (
        <Box
          key={key}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1
          }}
        >
          <TextField
            id="input-with-icon-textfield"
            label={`azione ${key + 1}`}
            fullWidth
            value={el.todo}
            onChange={(e) => handleChange(key, e)}
            name="subAction"
            sx={{}}
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>
            }}
            variant="standard"
          />

          <IconButton
            aria-label="add"
            onClick={() => deleteSubAction(key)}
            sx={{
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <HighlightOffTwoToneIcon />
          </IconButton>
        </Box>
      ))}
    </Box>
  )
}
