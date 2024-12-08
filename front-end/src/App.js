import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { path } from './utils'

//App route
import Home from './pages'

import HomePage from './pages/HomePage'
import AccountSettings from './pages/AccountSettings'
import UserProfile from './pages/UserProfile'
import MyPosts from './pages/MyPosts'
import SavedPosts from './pages/SavedPosts'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Error from './pages/Error'
import { jwtDecode } from 'jwt-decode'

import Admin from './pages/admin/Admin'
import AdminPage from './pages/admin/AdminPage'
import UserPage from './pages/admin/UserPage'
import PostPage from './pages/admin/PostPage'

export default function App() {
    const token = JSON.parse(window.localStorage.getItem('token'))
    const userInfo = token ? jwtDecode(token) : ''
    return (
        <Routes>
            <Route path={path.HOME} element={token ? userInfo.username === 'admin' ? <Admin /> : <Home /> : <LoginPage />} >
                <Route index element={userInfo.username === 'admin' ? <AdminPage /> : <HomePage />} />
                <Route path={path.USER_MANAGEMENT} element={<UserPage />} />
                <Route path={path.POST_MANAGEMENT} element={<PostPage />} />
                <Route path={path.ACCOUNT_SETTINGS} element={<AccountSettings />} />
                <Route path={path.MY_POSTS} element={<MyPosts />} />
                <Route path={path.SAVED_POSTS} element={<SavedPosts />} />
                <Route path={`${path.PROFILE}/:username`} element={<UserProfile />} />
            </Route>

            <Route path={path.LOGIN} element={<LoginPage />} />
            <Route path={path.REGISTER} element={<RegisterPage />} />
            <Route path={path.ERROR} element={<Error />} />

        </Routes>
    )
}
