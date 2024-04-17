export const initialTask = {
  totalTasks: 0,
  tasks: [],
  newTask: {
    id: null,
    createdBy: null,
    colorType: "#F39C12",
    description: "",
    start: new Date(),
    /* end: new Date(), */
    note: "",
    title: "",
    manager: "",
    laneId: null,
  },
};

//funzione che tramite icp di electron va a prendere tutto il db events
export const getTasks = async () => {
  if (process.env.NODE_ENV === "development") {
    console.log("sono in dev mode");
    return { ...initialTask };
  } else {
    //siamo in dist e quindi uso icp per andare sul db
    const { ipcRenderer } = window.require("electron");
    return new Promise((resolve, reject) => {
      try {
        ipcRenderer.send("send:getTasks", "getAllTasks");
        ipcRenderer.on("return:getTasks", (e, args) => {
          console.log("return:getTasks da task reducers", args);
          resolve(args);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
};

//funzione che tramite icp di electron va ad aggiungere un event nel db
export const addNewTask = async (task, totalTasks) => {
  if (process.env.NODE_ENV === "development") {
    const newTask = task;
    return newTask;
  } else {
    // siamo in modalita dist, quindi vado sul db gestito da electron
    //inizializzo icpRender
    console.log(
      "sono in modalita dist e vado su electron per inserire un nuovo task",
      task,
      totalTasks
    );
    const { ipcRenderer } = window.require("electron");
    return new Promise((resolve, reject) => {
      try {
        ipcRenderer.send("send:task", { task, totalTasks });

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
};

//funzione che va gestire la cancellazione di un task sia in modalità dev che dist
export const deleteTaskFromDb = async (taskId) => {
  console.log("sono in taskReducer e sto cancelladno", taskId);
  if (process.env.NODE_ENV === "development") {
    return taskId;
  } else {
    return new Promise((resolve, reject) => {
      const { ipcRenderer } = window.require("electron");
      try {
        ipcRenderer.send("send:taskToDelete", taskId);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
};

const taskReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "ADD_TASK":
      console.log("ADD_TASK", payload);
      return {
        ...state,
        tasks: payload.tasks,
        totalTasks: state.totalTasks + 1,
      };
    case "UPDATE_TASK":
      return { ...state, tasks: payload.tasks };
    case "DELETE_TASK":
      // Filtra gli eventi rimuovendo quello con l'ID corrispondente
      const updatedTasks = state.tasks.filter((event) => event.id !== payload);
      return {
        ...state,
        tasks: updatedTasks,
      };
    case "SET_TASKS":
      console.log("payload.tasks SET_TASKS in reducer says:", payload);
      return {
        ...state,
        totalTasks: payload.totalTasks,
        tasks: [...payload.tasks],
      };

    default:
      throw new Error("no case for type", type);
  }
};

export default taskReducer;
