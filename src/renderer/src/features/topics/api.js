//funzione asincrona che prende i topics dal db con una funzione
// sotto topicsReducer attenzione ch in modalita dev
//topics si azzera a ogni ricarica della pagina
export const getTopicsFromDb = async () => {
  console.log('apiTopics: getTopicsFromDb triggerato')
  const result = await window.api.getAllTopics()
  const sortedResult = result.topics.sort((a, b) => b.id - a.id)
  console.log('apiTopics: getTopicsFromDb: result:', sortedResult)
  return { topics: sortedResult, totalTopics: result.totalTopics }
}

export const getOptionsFromDb = async () => {
  console.log('in options di topics')
  try {
    const getOpt = await window.api.getOptions()
    console.log('options function loading', getOpt)
    return { ...getOpt }
  } catch (error) {
    throw new Error(error)
  }
}
