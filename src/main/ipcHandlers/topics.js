// ipcHandlers/topics.js
const { insertTopic, getAllTopics, deleteThisTopic } = require('../../database/topicsDB')
const { addNotifyManagers } = require('../../database/databaseManagersHandle')

export function handleTopicIpc(ipcMain) {
  ipcMain.handle('insertTopic', async (event, args) => {
    console.log('MAIN: insertTopic: topic da inserire in db', args)
    try {
      await insertTopic(args)
      await addNotifyManagers({ typeNotify: 'topic', obj: args.topic })
    } catch (error) {
      console.error('Errore nel main process insertTopic:', error)
      throw error
    }
  })

  ipcMain.handle('getAllTopics', async () => {
    console.log('main: getAllTopics')
    try {
      return await getAllTopics()
    } catch (error) {
      console.error('Errore nel main process getAllTopics:', error)
      throw error
    }
  })

  ipcMain.handle('deleteThisTopic', async (event, topicId) => {
    try {
      await deleteThisTopic(topicId)
    } catch (error) {
      console.error('Errore nel main process deleteThisTopic:', error)
      throw error
    }
  })
}
