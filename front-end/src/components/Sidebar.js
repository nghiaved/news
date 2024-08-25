import React, { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { NavLink, Link } from 'react-router-dom'
import { useGlobalState } from '../hooks'
import { apiFriendsGetListFriends } from '../services'
import { path, socket } from '../utils'

export default function Sidebar() {
    const [state, dispatch] = useGlobalState()
    const [fetchAgain, setFetchAgain] = useState(false)
    const [listFriends, setListFriends] = useState([])
    const token = JSON.parse(window.localStorage.getItem('token'))
    const userInfo = jwtDecode(token)

    useEffect(() => {
        if (state.fetchAgain !== fetchAgain) {
            setFetchAgain(state.fetchAgain)
        }

        const fetchApi = async () => {
            try {
                const res = await apiFriendsGetListFriends(userInfo.username)
                setListFriends(res.data.friends)
            } catch (error) {
                console.log(error)
            }
        }

        fetchApi()

        socket.on('user-online', (username) => {
            if (username !== userInfo.username) {
                fetchApi()
            }
        })

        socket.on('user-offline', (username) => {
            if (username !== userInfo.username) {
                fetchApi()
            }
        })

    }, [userInfo.username, state.fetchAgain, fetchAgain, dispatch])
    return (
        <main id="sidebar" className="sidebar">

            <ul className="sidebar-nav" id="sidebar-nav">

                <li className="nav-heading">Pages</li>

                <li className="nav-item">
                    <NavLink className="nav-link collapsed" to={path.HOME}>
                        <i className="bi bi-house"></i>
                        <span>Home</span>
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink className="nav-link collapsed" to={path.MY_POSTS}>
                        <i className="bi bi-sticky"></i>
                        <span>My Posts</span>
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink className="nav-link collapsed" to={path.SAVED_POSTS}>
                        <i className="bi bi-file-arrow-down"></i>
                        <span>Saved Posts</span>
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink className="nav-link collapsed" to={path.ACCOUNT_SETTINGS}>
                        <i className="bi bi-gear"></i>
                        <span>Account Settings</span>
                    </NavLink>
                </li>

                <li className="nav-heading">Friends ({listFriends.length})</li>

                {listFriends.map((item, index) => {
                    return <li key={index} className="nav-item">
                        <Link className="nav-link collapsed" to={`${path.PROFILE}/${item.username}`}>
                            <img src={item.image ? item.image : "/img/no-avatar.png"} alt={item.username}
                                className='rounded-circle img-in-sidebar me-2' />
                            <span>{item.firstName} {item.lastName}</span>
                            <span className='ms-auto'>
                                {item.online === 1 &&
                                    <i style={{ fontSize: 10 }} className="bi bi-circle-fill text-success"></i>}
                                <i onClick={() => dispatch({ userConversation: item })} className="bi bi-chat-dots"></i>
                            </span>
                        </Link>
                    </li>
                })}

            </ul >

        </main >
    )
}
