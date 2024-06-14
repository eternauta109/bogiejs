/* eslint-disable react/prop-types */
import CloseIcon from '@mui/icons-material/Close'
import { Box, Slide, Dialog, DialogTitle, Typography, IconButton } from '@mui/material/'
import NewTaskForm from './NewTaskForm'
import { forwardRef } from 'react'

const style = {
  width: '500px',
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4
}

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const TaskModal = ({ manager, open, handleClose, upDate }) => {
  return (
    <>
      <Dialog
        sx={{ top: '0' }}
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        keepMounted
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="body1">nuovo task: </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
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
        <Box sx={style}>
          <NewTaskForm manager={manager} onHandleClose={handleClose} upDate={upDate} />
        </Box>
      </Dialog>
    </>
  )
}

export default TaskModal
