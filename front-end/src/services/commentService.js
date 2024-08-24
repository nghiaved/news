import axiosClient from './axiosClient'

export const apiCommentsGetAllComments = id =>
    axiosClient.get(`/api/comments/get-all-comments?id=${id}`)

export const apiCommentsSendComment = data =>
    axiosClient.post('/api/comments/send-comment', data)

