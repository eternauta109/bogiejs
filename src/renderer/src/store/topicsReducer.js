export const initialTopic = {
  totalTopics: 0,
  topics: [],
  newTopic: {
    id: 0,
    createdBy: null,
    dateStart: new Date(),
    topicArgument: "",
    typeDocument: "",
    topicType: "",
    office: "",
    priority: "",
    link: "",
    note: "",
    managers: [],
    tmVeto: false,
    isNew: true,
  },
};

//funzione che tramite icp di electron va a prendere tutto il db events
export const getTopics = async (topics, totalTopics) => {
  if (process.env.NODE_ENV === "development") {
    console.log("sono in dev mode getTopics", topics, totalTopics);
    if (topics.length > 0) {
      return { ...initialTopic, topics: topics, totalTopics };
    } else {
      console.log("boo");
      return { ...initialTopic };
    }
  } else {
    //siamo in dist e quindi uso icp per andare sul db
    const { ipcRenderer } = window.require("electron");
    console.log("sono in dist mode getTopics");
    return new Promise((resolve, reject) => {
      try {
        ipcRenderer.send("send:getTopics", "getAllTopics");
        ipcRenderer.on("return:getTopics", (e, args) => {
          console.log("return:getTopics da topic reducers", args);
          resolve(args);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
};

//funzione che tramite icp di electron va ad aggiungere un event nel db
export const addNewTopic = async (topic, totalTopics) => {
  if (process.env.NODE_ENV === "development") {
    console.log("addNewTopic dev mode topic:", topic, totalTopics);
    const newTopic = topic;
    return newTopic;
  } else {
    // siamo in modalita dist, quindi vado sul db gestito da electron
    //inizializzo icpRender
    console.log(
      "sono in modalita dist e vado su electron per inserire un nuovo topic",
      topic,
      totalTopics
    );
    const { ipcRenderer } = window.require("electron");
    return new Promise((resolve, reject) => {
      try {
        ipcRenderer.send("send:topic", { topic, totalTopics });
        ipcRenderer.on("return:addNewTopics", (e, args) => {
          console.log("return:addNewTopics da topic reducers", args);
          resolve(args);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
};

//funzione che va gestire la cancellazione di un topic sia in modalità dev che dist
export const deleteTopicFromDb = async ({ topicId }) => {
  console.log("sono in topicReducer e sto cancelladno", topicId);
  if (process.env.NODE_ENV === "development") {
    return topicId;
  } else {
    return new Promise((resolve, reject) => {
      const { ipcRenderer } = window.require("electron");
      try {
        ipcRenderer.send("send:topicToDelete", topicId);
        ipcRenderer.on("return:topicToDelete", (e, args) => {
          console.log("return:topicToDelete da topic reducers", args);
          resolve(args);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
};

const topicReducer = (state, action) => {
  const { type } = action;

  switch (type) {
    case "ADD_TOPIC":
      /* console.log("ADD_EVENT", payload); */
      console.log("ADD_TOPIC in reducer", action);

      return {
        ...state,
        topics: [...state.topics, action.payload],
        totalTopics: state.totalTopics + 1,
      };
    case "UPDATE_TOPIC":
      const { payload } = action;
      console.log("UPDATE_TOPIC", state.topics, payload);
      const topicIndex = state.topics.findIndex(
        (topic) => topic.id === payload.id
      );
      const updatedTopic = { ...state.topics[topicIndex], ...payload.topic };
      const updatedTopics = [...state.topics];
      updatedTopics[topicIndex] = updatedTopic;
      return { ...state, topics: updatedTopics };

    case "DELETE_TOPIC":
      return {
        ...state,
        topics: state.topics.filter((topic) => topic.id !== action.payload.id),
      };
    case "SET_TOPICS":
      console.log("payload.topics SET_TOPICS in reducer says:", action.payload);
      return {
        ...state,
        totalTopics: action.payload.totalTopics,
        topics: [...action.payload.topics],
      };

    default:
      throw new Error("no case for type", type);
  }
};

export default topicReducer;
