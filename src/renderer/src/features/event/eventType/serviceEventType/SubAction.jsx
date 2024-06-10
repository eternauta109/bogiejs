/* eslint-disable react/prop-types */
import useEventsStore from '../../../../store/EventDataContext'
import { Box, Typography, IconButton, TextField, InputAdornment } from '@mui/material'
import LibraryAddTwoToneIcon from '@mui/icons-material/LibraryAddTwoTone'
import RocketIcon from '@mui/icons-material/Rocket'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone'
import { useEffect } from 'react'
import SubActionCheck from './SubActionCheck'

export default function SubAction({ type, upDate, fakeTask }) {
  const { task, setTask, upDateTask, upDateEvent, event, setEvent } = useEventsStore()

  const getStateAndSetter = (type) => {
    switch (type) {
      case 'task':
        return { state: upDate ? fakeTask : task, setState: setTask, upDateState: upDateTask }
      case 'event':
        return { state: event, setState: setEvent, upDateState: upDateEvent }
      default:
        throw new Error(`Unknown type: ${type}`)
    }
  }

  const { state, setState, upDateState } = getStateAndSetter(type)

  const addSubAction = () => {
    const newSubAction = {
      todo: '',
      checked: false
    }
    if (state.subAction) {
      setState({
        ...state,
        subAction: [...state.subAction, newSubAction]
      })
      upDateState(state, state.id)
    } else {
      setState({
        ...state,
        subAction: [newSubAction]
      })
      upDateState(state, state.id)
    }
  }

  const deleteSubAction = (index) => {
    const updatedSubActions = state.subAction.filter((_, i) => i !== index)
    setState({ ...state, subAction: updatedSubActions })
    upDateState(state, state.id)
  }

  const handleActionTaextChange = (index, event) => {
    const updatedSubActions = state.subAction.map((subAction, i) =>
      i === index ? { ...subAction, todo: event.target.value } : subAction
    )
    setState({ ...state, subAction: updatedSubActions })
    upDateState(state, state.id)
  }

  useEffect(() => {
    console.log('type, upDate, fakeTask', type, upDate, fakeTask)
  }, [upDate])

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
        {!fakeTask && (
          <>
            <Typography variant="body2" color="green" sx={{ flexGrow: 1 }}>
              aggiungi una sub-action:
            </Typography>
            <IconButton
              aria-label="addSubAction"
              onClick={addSubAction}
              sx={{
                color: (theme) => theme.palette.grey[500]
              }}
            >
              <LibraryAddTwoToneIcon />
            </IconButton>
          </>
        )}
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
              onChange={(e) => handleActionTaextChange(key, e)}
              name="subAction"
              sx={{}}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {el.checked ? <RocketLaunchIcon /> : <RocketIcon />}
                  </InputAdornment>
                )
              }}
              variant="standard"
            />
            {!upDate ? (
              <IconButton
                aria-label="add"
                onClick={() => deleteSubAction(key)}
                sx={{
                  color: (theme) => theme.palette.grey[500]
                }}
              >
                <HighlightOffTwoToneIcon />
              </IconButton>
            ) : (
              <SubActionCheck state={state} setState={setState} type={type} obj={el} index={key} />
            )}
          </Box>
        ))}
    </Box>
  )
}
