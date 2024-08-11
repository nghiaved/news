import axiosClient from './axiosClient'

export const apiConversationsGetConversation = data =>
    axiosClient.get(`/api/conversations/get-conversation?user1=${data.user1}&user2=${data.user2}`)

export const apiConversationsGetAllConversations = user =>
    axiosClient.get(`/api/conversations/get-all-conversations?user=${user}`)

export const apiConversationsCreateConversation = data =>
    axiosClient.post('/api/conversations/create-conversation', data)
