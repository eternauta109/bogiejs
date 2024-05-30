/* eslint-disable react/prop-types */

import Modal from '@mui/material/Modal'

import { MessageForm } from './MessageForm'

export const Message = ({ onHandleMessageClose, open }) => {
  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          onHandleMessageClose()
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <MessageForm />
      </Modal>
    </>
  )
}
