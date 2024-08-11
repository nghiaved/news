import axiosClient from './axiosClient'

export const apiPostsGetAllMyPosts = ({ author, page, limit }) =>
    axiosClient.get(`/api/posts/get-all-my-posts?author=${author}&page=${page}&limit=${limit}`)

export const apiPostsGetAllPosts = ({ page, limit }) =>
    axiosClient.get(`/api/posts/get-all-posts?page=${page}&limit=${limit}`)

export const apiPostsCreatePost = data =>
    axiosClient.post('/api/posts/create-post', data)

export const apiPostsUpdatePost = data =>
    axiosClient.put(`/api/posts/update-post?id=${data.id}`, data)

export const apiPostsDeleteFriend = id =>
    axiosClient.delete('/api/posts/delete-post?id=' + id)