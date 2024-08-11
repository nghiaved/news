import axiosClient from './axiosClient'

export const apiUsersRegister = data =>
    axiosClient.post('/api/users/register', data)

export const apiUsersLogin = data =>
    axiosClient.post('/api/users/login', data)

export const apiUsersDeleteAccount = data =>
    axiosClient.delete(`/api/users/delete-account?id=${data.id}&username=${data.username}&password=${data.password}`)

export const apiUsersChangePassword = data =>
    axiosClient.patch(`/api/users/change-password?id=${data.id}`, data)

export const apiUsersUpdateInfo = data =>
    axiosClient.put(`/api/users/update-info?id=${data.id}`, data)

export const apiUsersList = searchValue =>
    axiosClient.get(`/api/users/list?search=${searchValue}`)

export const apiUsersGetInfo = username =>
    axiosClient.get(`/api/users/get-info/${username}`)
