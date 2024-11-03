import axiosClient from './axiosClient'

export const apiEmotionsGetAllEmotions = receiver =>
    axiosClient.get(`/api/emotions/get-all-emotions?receiver=${receiver}`)

export const apiEmotionsReadEmotions = data =>
    axiosClient.patch(`/api/emotions/read-emotion`, data)
