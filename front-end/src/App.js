import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { path } from './utils'

//App route
import Home from './pages'

import HomePage from './pages/HomePage'
import AccountSettings from './pages/AccountSettings'
import UserProfile from './pages/UserProfile'
import MyPosts from './pages/MyPosts'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Error from './pages/Error'

export default function App() {
    return (
        <Routes>
            <Route path={path.HOME} element={JSON.parse(window.localStorage.getItem('token')) ? <Home /> : <LoginPage />} >
                <Route index element={<HomePage />} />
                <Route path={path.ACCOUNT_SETTINGS} element={<AccountSettings />} />
                <Route path={path.MY_POSTS} element={<MyPosts />} />
                <Route path={`${path.PROFILE}/:username`} element={<UserProfile />} />
            </Route>

            <Route path={path.LOGIN} element={<LoginPage />} />
            <Route path={path.REGISTER} element={<RegisterPage />} />
            <Route path={path.ERROR} element={<Error />} />

        </Routes>
    )
}
