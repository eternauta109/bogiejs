/* eslint-disable react/prop-types */
import { Checkbox, Stack } from '@mui/material'

import useEventsStore from '../../../../store/EventDataContext'

export default function SubActionCheck({ state, setState, type, obj, index }) {
  const { upDateTask } = useEventsStore()

  const onChecked = async (index) => {
    const updatedSubActions = state.subAction.map((subAction, i) =>
      i === index ? { ...subAction, checked: !subAction.checked } : subAction
    )
    const newObj = { ...state, subAction: updatedSubActions }
    upDateTask(newObj, newObj.id)
    setState(newObj) // Aggiorna lo stato globale
    try {
      switch (type) {
        case 'task':
          await window.api.addNewTask({ task: newObj, upDate: true })
          break
        case 'event':
          await window.api.addNewEvent({ event: newObj, upDate: true })
          break
        default:
          console.log('nessun oggetto tipo rilevato')
          break
      }
    } catch (error) {
      console.log('SubActionCheck: onChecked obj:', error)
    }
  }

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        useFlexGap
      >
        <Checkbox checked={obj.checked} onChange={() => onChecked(index)} />
      </Stack>
    </>
  )
}
