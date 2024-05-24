//funzione asincrona che prende i topics dal db con una funzione
// sotto topicsReducer attenzione ch in modalita dev
//topics si azzera a ogni ricarica della pagina
export const getTopicsFromDb = async () => {
  console.log('getTopicsFromDb triggerato')
  const result = await window.api.getAllTopics()
  return result
}

export const getOptionsFromDb = async () => {
  console.log('in options di topics')
  try {
    const getOpt = await window.api.getOptions()
    console.log('options function loading', getOpt)
    return { ...getOpt }
  } catch (error) {
    console.log(error)
  }
}
