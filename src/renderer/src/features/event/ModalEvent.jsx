import { useState } from "react";
import Box from "@mui/material/Box";
import NewEvent from "./NewEvent";
import useEventsStore from "../../store/EventDataContext";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ModalEvent = ({ open, handleClose, upDate }) => {
  const { initEvent } = useEventsStore();

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          handleClose();
          initEvent(); // Suppongo che tu abbia la funzione initEvent()
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <NewEvent handleClose={handleClose} upDate={upDate} />
        </Box>
      </Modal>
    </>
  );
};

export default ModalEvent;
