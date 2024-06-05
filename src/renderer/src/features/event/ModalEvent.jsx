import Box from '@mui/material/Box'
import { forwardRef } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import NewEvent from './NewEvent'
import useEventsStore from '../../store/EventDataContext'
import Slide from '@mui/material/Slide'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const style = {
  width: '500px',
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4
}

// eslint-disable-next-line react/prop-types
const ModalEvent = ({ open, handleClose, upDate }) => {
  const { initEvent, event } = useEventsStore()

  const handleDialogClose = () => {
    handleClose()
    initEvent() // Suppongo che tu abbia la funzione initEvent()
  }
  console.log('update', upDate)

  return (
    <Dialog
      sx={{ top: '0' }}
      open={open}
      TransitionComponent={Transition}
      onClose={handleDialogClose}
      keepMounted
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle
        sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography variant="h6">
          {upDate ? `aggiorna: ${event.eventType}` : `nuovo evento: ${event.eventType}`}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleDialogClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={style}>
          <NewEvent handleClose={handleClose} upDate={upDate} />
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ModalEvent
