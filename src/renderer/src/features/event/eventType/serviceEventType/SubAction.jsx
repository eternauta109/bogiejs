/* eslint-disable react/prop-types */
import useEventsStore from '../../../../store/EventDataContext'
import { Box, Typography, IconButton, TextField, InputAdornment } from '@mui/material'
import LibraryAddTwoToneIcon from '@mui/icons-material/LibraryAddTwoTone'

import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone'
import { useEffect } from 'react'

export default function SubAction({ type }) {
  const { task, setTask, event, setEvent } = useEventsStore()
  console.log(type)
  const getStateAndSetter = (type) => {
    switch (type) {
      case 'task':
        return { state: task, setState: setTask }
      case 'event':
        return { state: event, setState: setEvent }
      default:
        throw new Error(`Unknown type: ${type}`)
    }
  }

  const { state, setState } = getStateAndSetter(type)

  const addSubAction = () => {
    const newSubAction = {
      todo: '',
      checked: false
    }
    setState({ ...state, subAction: [...state.subAction, newSubAction] })
  }

  const deleteSubAction = (index) => {
    const updatedSubActions = state.subAction.filter((_, i) => i !== index)
    setState({ ...state, subAction: updatedSubActions })
  }

  const handleChange = (index, event) => {
    const updatedSubActions = state.subAction.map((subAction, i) =>
      i === index ? { ...subAction, todo: event.target.value } : subAction
    )
    setState({ ...state, subAction: updatedSubActions })
  }

  useEffect(() => {
    console.log(`subAction: ${type}: `, state)
  }, [state, type])

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="body2" color="green" sx={{ flexGrow: 1 }}>
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
      {state.subAction &&
        state.subAction.map((el, key) => (
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
              inputProps={{ maxLength: 40 }}
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
