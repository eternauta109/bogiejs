export const initialEvents = {
  totalEvents: 0,
  events: [],
  newEvent: {
    id: null,
    createdBy: null,
    eventType: "evento",
    colorDivision: null,
    colorEventType: "#F39C12",
    description: "",
    division: null,
    start: new Date(),
    end: new Date(),
    link: null,
    note: "",
    title: "",
    manager: "",
    laneId: "lane1",
  },
};

//funzione che tramite icp di electron va a prendere tutto il db events
export const getEvents = async () => {
  if (process.env.NODE_ENV === "development") {
    console.log("sono in dev mode");
    return { ...initialEvents };
  } else {
    //siamo in dist e quindi uso icp per andare sul db
    const { ipcRenderer } = window.require("electron");
    return new Promise((resolve, reject) => {
      try {
        ipcRenderer.send("send:getEvents", "getAllEvents");
        ipcRenderer.on("return:getEvents", (e, args) => {
          console.log("return:getEvents da event reducers", args);
          resolve(args);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
};

//funzione che tramite icp di electron va ad aggiungere un event nel db
export const addNewEvent = async (event, totalEvents) => {
  if (process.env.NODE_ENV === "development") {
    console.log("modali dev addNewEvent: ", event);
    const newEvent = event;
    return newEvent;
  } else {
    // siamo in modalita dist, quindi vado sul db gestito da electron
    //inizializzo icpRender
    console.log(
      "sono inn modalita dist e vado su electron per inserire un nuovo event"
    );
    const { ipcRenderer } = window.require("electron");
    return new Promise((resolve, reject) => {
      try {
        ipcRenderer.send("send:event", { event, totalEvents });
        /* ipcRenderer.on("retunr:eventSaved", (e, events) => {
          console.log("send:managers è arrivato su user reducer", events);
          resolve(events);
        }); */
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
};

//funzione che va gestire la cnacellazione di un event sia in modali dev che dist
export const deleteEventFromDb = async (eventId) => {
  if (process.env.NODE_ENV === "development") {
    return eventId;
  } else {
    return new Promise((resolve, reject) => {
      const { ipcRenderer } = window.require("electron");
      try {
        ipcRenderer.send("send:eventToDelete", eventId);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
};

const eventsReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "ADD_EVENT":
      /* console.log("ADD_EVENT", payload); */
      return {
        ...state,
        events: payload.events,
        totalEvents: state.totalEvents + 1,
      };

    // Aggiungi il caso per la cancellazione dell'evento nel tuo reducer
    case "DELETE_EVENT":
      // Filtra gli eventi rimuovendo quello con l'ID corrispondente
      const updatedEvents = state.events.filter(
        (event) => event.id !== payload
      );
      return {
        ...state,
        events: updatedEvents,
      };

    case "UPDATE_EVENT":
      /* console.log("UPDATE_EVENT", payload); */
      return { ...state, events: payload.events };

    case "SET_EVENT":
      /* console.log("payload SET_EVETN in reducer says:", payload); */
      return {
        ...state,
        newEvent: {
          ...payload,
        },
      };

    case "SET_EVENTS":
      /* console.log("payload SET_EVETN in reducer says:", payload); */
      console.log("payload.events SET_EVENT in reducer says:", payload);
      return {
        ...state,
        totalEvents: payload.totalEvents,
        events: [...payload.events],
      };

    case "INIT_EVENT":
      console.log("INIT_EVENT");
      return {
        ...state,
        newEvent: {
          ...initialEvents.newEvent,
        },
      };

    default:
      throw new Error("no case for type", type);
  }
};

export default eventsReducer;
