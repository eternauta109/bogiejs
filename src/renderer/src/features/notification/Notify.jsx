/* eslint-disable react/prop-types */

import Modal from '@mui/material/Modal'
import useEventsStore from '../../store/EventDataContext'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  IconButton,
  Divider
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect } from 'react'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 600,
  maxHeight: '80%',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  overflowY: 'auto',
  p: 4
}

export const Notify = ({ onHandleClose, open, notify }) => {
  const { user, deleteNotify } = useEventsStore()

  const handleCancelNotify = async (e, notifyId) => {
    console.log(notifyId, user)
    const newNotify = await window.api.deleteThisNotify({ notifyId, userId: user.user.id })
    console.log('array notifiche aggiornato è tornato a Notify cosi', newNotify)
    deleteNotify(newNotify)
    console.log('user aggiornato', user)
  }

  useEffect(() => {
    if (notify.length === 0) {
      onHandleClose()
    }
  }, [notify, onHandleClose])

  return (
    <Modal
      open={open}
      onClose={() => {
        onHandleClose()
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2">
            Notifiche
          </Typography>
          <IconButton onClick={onHandleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {notify?.map((value, key) => (
          <Card key={key} sx={{ mb: 2, boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Hai ricevuto la seguente notifica:
              </Typography>
              <Typography variant="body2" component="p" sx={{ mb: 2 }}>
                {value.notify}
              </Typography>
              <CardActions>
                <Button
                  onClick={(e) => handleCancelNotify(e, value.id)}
                  size="small"
                  variant="contained"
                  color="secondary"
                  startIcon={<CloseIcon />}
                >
                  Chiudi
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Modal>
  )
}
