import axiosClient from './axiosClient'

export const apiPostsGetHomePosts = ({ page, limit, hashtag }) =>
    axiosClient.get(`/api/posts/get-home-posts?page=${page}&limit=${limit}&hashtag=${encodeURIComponent(hashtag)}`)

export const apiPostsGetAllMyPosts = ({ author, page, limit }) =>
    axiosClient.get(`/api/posts/get-all-my-posts?author=${author}&page=${page}&limit=${limit}`)

export const apiPostsGetAllPosts = ({ page, limit, status_post }) =>
    axiosClient.get(`/api/posts/get-all-posts?page=${page}&limit=${limit}&status_post=${encodeURIComponent(status_post)}`)

export const apiPostsCreatePost = data =>
    axiosClient.post('/api/posts/create-post', data)

export const apiPostsUpdatePost = data =>
    axiosClient.put(`/api/posts/update-post?id=${data.id}`, data)

export const apiPostsDeleteFriend = id =>
    axiosClient.delete('/api/posts/delete-post?id=' + id)

export const apiPostsAddViewPost = id =>
    axiosClient.patch('/api/posts/add-view-post', { id })

export const apiPostsAddLikePost = data =>
    axiosClient.patch('/api/posts/add-like-post', data)

export const apiPostsAddDislikePost = data =>
    axiosClient.patch('/api/posts/add-dislike-post', data)

export const apiPostsUpdateStatusPost = (id, status_post) =>
    axiosClient.patch('/api/posts/update-status-post', { id, status_post })