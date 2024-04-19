/* eslint-disable react/prop-types */

import Modal from '@mui/material/Modal'
import useEventsStore from '../../store/EventDataContext'
import { Box, Card, CardActions, CardContent, Button, Typography } from '@mui/material'

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

export const Notify = ({ onHandleClose, open, notify }) => {
  const { user, deleteNotify } = useEventsStore()

  const handleCancelNotify = async (e, notifyId) => {
    console.log(notifyId, user)
    const newNotify = await window.api.deleteThisNotify({ notifyId, userId: user.user.id })
    console.log('array notifiche aggiornato è tornato a Notify cosi', newNotify)
    deleteNotify(newNotify)
    console.log('user aggiornato', user)
  }

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          onHandleClose()
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {notify?.map((value, key) => (
            <Card key={key} sx={{ minWidth: 275, mb: 2 }}>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  hai ricevuto la seguente notifica:
                </Typography>

                <Typography>{value.notify}</Typography>
                <CardActions>
                  <Button
                    onClick={(e) => handleCancelNotify(e, value.id)}
                    size="small"
                    color="secondary"
                  >
                    chiudi
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Modal>
    </>
  )
}
