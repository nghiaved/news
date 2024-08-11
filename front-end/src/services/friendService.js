import axiosClient from './axiosClient'

export const apiFriendsGetFriend = data =>
    axiosClient.get(`/api/friends/get-friend?username=${data.username}&friendUsername=${data.friendUsername}`)

export const apiFriendsGetListFriends = username =>
    axiosClient.get(`/api/friends/get-list-friends?username=${username}`)

export const apiFriendsGetListRequests = username =>
    axiosClient.get(`/api/friends/get-list-requests?username=${username}`)

export const apiFriendsSendRequest = data =>
    axiosClient.post('/api/friends/send-request', data)

export const apiFriendsAcceptRequest = id =>
    axiosClient.patch('/api/friends/accept-request?id=' + id)

export const apiFriendsDeleteFriend = id =>
    axiosClient.delete('/api/friends/delete-friend?id=' + id)
