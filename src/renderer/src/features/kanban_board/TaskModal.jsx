import React from "react";

import { Modal, Box } from "@mui/material/";
import NewTaskForm from "./NewTaskForm";

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

const TaskModal = ({ manager,open, handleClose }) => {
  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          handleClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <NewTaskForm manager={manager} onHandleClose={handleClose} />
        </Box>
      </Modal>
    </>
  );
};

export default TaskModal;
