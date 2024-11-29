import axiosClient from './axiosClient'

export const apiSavesGetAllSaves = data =>
    axiosClient.get(`/api/saves/get-all-saves?userId=${data.userId}&type=${data.type}&page=${data.page}&limit=${data.limit}`)

export const apiSavesCreateSave = data =>
    axiosClient.post('/api/saves/create-save', data)

export const apiSavesDeleteSave = id =>
    axiosClient.delete('/api/saves/delete-save?id=' + id)
