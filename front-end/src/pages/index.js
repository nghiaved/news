import React, { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import BackToTop from '../components/BackToTop'
import Conversation from '../components/Conversation'
import { socket } from '../utils'
import { useGlobalState } from '../hooks'

export default function Home() {
    const [state, dispatch] = useGlobalState()
    const token = JSON.parse(window.localStorage.getItem('token'))
    const userInfo = jwtDecode(token)

    useEffect(() => {
        socket.emit('join-username', userInfo.username)
        socket.on('receive-username', (username) => {
            if (username === userInfo.username) {
                dispatch({ fetchAgain: !state.fetchAgain })
            }
        })
    }, [userInfo.username, state.fetchAgain, dispatch])

    return (
        <React.Fragment>
            <Header />
            <Sidebar />
            <Conversation />
            <Outlet />
            <BackToTop />
        </React.Fragment>
    )
}
