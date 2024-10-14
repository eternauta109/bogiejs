/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import React, { forwardRef } from 'react'

import OutlinedInput from '@mui/material/OutlinedInput'
import { Box, InputLabel, FormControl, Select, MenuItem, TextField, Button } from '@mui/material'
import { useMemo, useState } from 'react'
import { useTheme } from '@mui/material/styles'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  maxHeight: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  overflowY: 'auto',
  p: 5
}

const maxDescriptionLength = 240

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  }
}

export const MessageForm = forwardRef((props, ref) => {
  const [newMessage, setNewMessage] = useState({
    to: [],
    from: '',
    text: ''
  })
  const [personName, setPersonName] = useState([])

  const theme = useTheme()

  const handleChange = (event) => {
    const {
      target: { value }
    } = event
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    )
  }

  return (
    <Box sx={style} ref={ref} tabIndex={-1}>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-name-label">send to:</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
        >
          {/* {user.managersName.map((name) => (
            <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
              {name}
            </MenuItem>
          ))} */}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        variant="filled"
        multiline
        inputProps={{ maxLength: maxDescriptionLength }}
        label={`text msg: ${newMessage.text?.length || 0}/${maxDescriptionLength}`}
        value={newMessage?.text || ''}
        onChange={(e) => setNewMessage((old) => ({ ...old, text: e.target.value }))}
        name="textMsg"
        rows={4}
        sx={{ mb: 2 }}
      />
      <Button>send message</Button>
    </Box>
  )
})

export default MessageForm
