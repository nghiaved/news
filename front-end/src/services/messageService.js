import axiosClient from './axiosClient'

export const apiMessagesGetAllMessages = (id, user) =>
    axiosClient.get(`/api/messages/get-all-messages?id=${id}&user=${user}`)

export const apiMessagesSendMessage = data =>
    axiosClient.post('/api/messages/send-message', data)

