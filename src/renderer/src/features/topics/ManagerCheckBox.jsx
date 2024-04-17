import React from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import useEventsStore from "../../store/EventDataContext";

const ManagerCheckbox = ({ row, manager, onCheckboxChange }) => {
  const { topics, totalTopics, emptyTopic, updateTopic, addTopic } =
    useEventsStore();

  // Accedi all'oggetto riga usando row.id
  const currentRow = topics.find((item) => item.id === row.id);

  // Controlla se l'oggetto riga è valido e il manager è presente
  const isChecked = currentRow?.managers?.includes(manager) || false;

  const handleChange = () => {
    onCheckboxChange(manager);
  };

  return (
    <FormControlLabel
      control={<Checkbox checked={isChecked} onChange={handleChange} />}
      label={null}
    />
  );
};

export default ManagerCheckbox;
