import { act } from "react-dom/test-utils";

export const initialOption = {
  divisions: [
    {
      nameDivision: "marketing",
      color: "#F39C12",
    },
    {
      nameDivision: "operations",
      color: "#7DCEA0",
    },
    {
      nameDivision: "pricing",
      color: "#BB8FCE",
    },
    {
      nameDivision: "facilities",
      color: "#AAB7B8",
    },
    {
      nameDivision: "screencontent",
      color: "#448AFF",
    },
    {
      nameDivision: "actionpoint",
      color: "#EF5350",
    },
    {
      nameDivision: "brief",
      color: "#90A4AE",
    },
  ],
  eventType: [
    {
      type: "evento",
      color: "#F39C12",
    },
    {
      type: "matineè",
      color: "#7DCEA0",
    },
    {
      type: "prevendite",
      color: "#BB8FCE",
    },
    {
      type: "promo",
      color: "#AAB7B8",
    },
    {
      type: "compleanni",
      color: "#448AFF",
    },
    {
      type: "extra",
      color: "#EF5350",
    },
  ],
  topicType: [
    { value: "none", label: "none" },
    { value: "cascading", label: "cascading" },
    { value: "suggest", label: "abitudini" },
    { value: "tutorial", label: "Tutorial" },
    { value: "procedur", label: "procedura interna" },
    { value: "brief", label: "brief" },
    { value: "internalComunication", label: "comunicazione da sede" },
  ],
  docTypes: [
    { value: "none", label: "none" },
    { value: "presentazione", label: "presentazione" },
    { value: "pdf", label: "pdf" },
    { value: "office", label: "office" },
    { value: "excel", label: "excel" },
  ],
  officeTypes: [
    { value: "none", label: "none" },
    { value: "marketing", label: "marketing" },
    { value: "hr", label: "hr" },
    { value: "operations", label: "operations" },
    { value: "pricing", label: "pricing" },
    { value: "filmcontent", label: "Film Content" },
    { value: "it", label: "it" },
    { value: "finance", label: "finance" },
  ],
};

export const getOptions = async () => {
  if (process.env.NODE_ENV === "development") {
    console.log("sono in DEV_MODE edntro optionsreducers");
    return { ...initialOption };
  } else {
    return new Promise((resolve, reject) => {
      const { ipcRenderer } = window.require("electron");
      try {
        ipcRenderer.send("send:getOptions");
        ipcRenderer.on("return:getOptions", (e, args) => {
          console.log("return:getOption da options reducers", args);
          resolve(args);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
};

const optionsReducer = (state, action) => {
  console.log("state e action optionReducer", state, action);
  switch (action.type) {
    case value:
      break;

    default:
      break;
  }
};

export default optionsReducer;
