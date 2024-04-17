import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  TextField,
  FormControl,
  ListItem,
  Stack,
  List,
  Select,
  IconButton,
  MenuItem,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import useEventsStore from "../../store/EventDataContext";
import { v4 as uuidv4 } from "uuid";
import {
  addNewUser,
  getAllManagers,
  deleteManager,
} from "../../store/userReducer";
import { getOptions } from "../../store/optionsReducer";

import DeleteIcon from "@mui/icons-material/Delete";
import { set } from "date-fns";

const Dashboard = () => {
  const [newUser, setNewUser] = useState({
    userName: "",
    role: "",
    notification: [],
    password: "",
    isAuth: false,
    id: "",
    cinema: "",
  });
  const [managersList, setManagersList] = useState([]);
  const [optionsState, setOptionsState] = useState({});
  const [newOpts, setNewOpts] = useState();

  const { user, setUsersName } = useEventsStore();

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    const insertNewUser = {
      ...newUser,
      id: `manager-${uuidv4()}`,
      cinema: user.user.cinema,
    };
    console.log("onHandleSubmit new manager", insertNewUser);
    const cinemaNamesReturn = await addNewUser(insertNewUser);
    setManagersList([...cinemaNamesReturn]);
    setUsersName(cinemaNamesReturn);
  };

  useMemo(() => {
    console.log("user modificato", newUser);
  }, [newUser]);

  const awaytGetAllManagers = async () => {
    const managersList = await getAllManagers(user);
    console.log("dashboard lista managers", managersList);
    setManagersList([...managersList]);
  };

  const awaytGetAllOptions = async () => {
    const options = await getOptions();
    console.log("options in dashboard", options);
    setOptionsState({ ...options });
  };

  const onAddOptions = (e, tipo) => {
    e.preventDefault();
    console.log(newOpts, tipo);
  };

  const onHandleDeleteUser = async (e, manager) => {
    e.preventDefault();
    console.log(manager);
    const arrayNames = await deleteManager(manager);
    console.log("dashboard lista managers", arrayNames);
    setManagersList([...arrayNames]);
    setUsersName(arrayNames);
  };

  useEffect(() => {
    awaytGetAllManagers();
    awaytGetAllOptions();
    console.log("useEffect");

    return () => {};
  }, [managersList.length]);

  return (
    <Container
      sx={{
        display: "flex",

        padding: 2,
        justifyContent: "center",
      }}
    >
      <Stack spacing={2} direction="column">
        <Box>
          <Stack spacing={2} direction="row" sx={{ height: "400px" }}>
            <form onSubmit={onHandleSubmit} sx={{ height: "200px" }}>
              <Stack spacing={3}>
                <Typography>Inserisci un manager</Typography>

                <TextField
                  required
                  label="user name"
                  variant="outlined"
                  name="useName"
                  value={newUser.userName}
                  onChange={(user) =>
                    setNewUser({ ...newUser, userName: user.target.value })
                  }
                  helperText="nome+iniziale cognome. Es marioc, francof, iolandar"
                />
                <FormControl required>
                  <InputLabel id="role">Ruolo</InputLabel>
                  <Select
                    labelId="role"
                    name="role"
                    input={<OutlinedInput label="role" />}
                    value={newUser?.role ? newUser.role : ""}
                    onChange={(role) =>
                      setNewUser({ ...newUser, role: role.target.value })
                    }
                  >
                    <MenuItem value={""}>none</MenuItem>
                    <MenuItem value="am">am</MenuItem>
                    <MenuItem value="jm">jm</MenuItem>
                    <MenuItem value="tl">tl</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  required
                  label="pin"
                  variant="outlined"
                  name="password"
                  value={newUser.password}
                  onChange={(psw) =>
                    setNewUser({ ...newUser, password: psw.target.value })
                  }
                  helperText="consiglio: 4 cifre sono piu che sufficenti"
                />
                <TextField disabled label="cinema" value={user.user.cinema} />
                <Button variant="outlined" type="submit" color="secondary">
                  Inserisci user
                </Button>
              </Stack>
            </form>

            <Stack sx={{ width: 300 }}>
              <Typography>Manager attivi</Typography>
              <List sx={{ overflowY: "auto" }}>
                {managersList?.map((manager, key) => (
                  <ListItem
                    value={manager.userName}
                    key={key}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={(e) => onHandleDeleteUser(e, manager)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <Box>
                      <Typography>{manager.userName}</Typography>
                      <TextField
                        disabled
                        defaultValue={manager.password}
                        variant="filled"
                      ></TextField>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Stack>
          </Stack>
        </Box>
        <Box>
          <Stack spacing={2} direction="column" sx={{ mt: 10 }}>
            <Typography>OPTIONS</Typography>
            <Stack
              spacing={5}
              direction="row"
              sx={{ justifyContent: "center" }}
            >
              <Box
                component="form"
                noValidate
                onSubmit={(e) => onAddOptions(e, "topicType")}
              >
                <Stack sx={{ width: 300, height: 300 }}>
                  <Typography>argomenti topic</Typography>
                  <List sx={{ overflowY: "auto" }}>
                    {optionsState?.topicType?.map((topic, key) => (
                      <ListItem
                        sx={{ mt: 2 }}
                        value={topic.value}
                        key={key}
                        secondaryAction={
                          <IconButton edge="end" aria-label="delete">
                            <Typography>{topic.value}</Typography>
                            <DeleteIcon />
                          </IconButton>
                        }
                      />
                    ))}
                  </List>
                  <Stack direction={"row"}>
                    <Box>
                      <TextField
                        sx={{ width: 300 }}
                        value={newOpts}
                        onChange={(e) => setNewOpts(e.target.value)}
                      />
                      <Button type="submit">add</Button>
                    </Box>
                  </Stack>
                </Stack>
              </Box>
              <Box>
                <Stack sx={{ width: 300 }}>
                  <Typography>tipi di dcoc</Typography>
                  <List sx={{ overflowY: "auto" }}>
                    {optionsState?.docTypes?.map((doc, key) => (
                      <ListItem
                        sx={{ mt: 2 }}
                        value={doc.value}
                        key={key}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            /* onClick={(e) => onHandleDeleteUser(e, manager)} */
                          >
                            <Typography>{doc.value}</Typography>
                            <DeleteIcon />
                          </IconButton>
                        }
                      />
                    ))}
                  </List>
                  <Stack direction={"row"}>
                    <TextField
                      sx={{ width: 300 }}
                      onChange={(e) => setNewOpts(e.target.value)}
                    />
                    <Button>add</Button>
                  </Stack>
                </Stack>
              </Box>
              <Box>
                <Stack sx={{ width: 300, height: 300 }}>
                  <Typography>reparti</Typography>
                  <List sx={{ overflowY: "auto" }}>
                    {optionsState?.divisions?.map((doc, key) => (
                      <ListItem
                        sx={{ mt: 2 }}
                        value={doc.value}
                        key={key}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            /* onClick={(e) => onHandleDeleteUser(e, manager)} */
                          >
                            <Typography>{doc.nameDivision}</Typography>
                            <DeleteIcon />
                          </IconButton>
                        }
                      />
                    ))}
                  </List>
                  <Stack direction={"row"}>
                    <TextField sx={{ width: 300 }} />
                    <Button>add</Button>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default Dashboard;
