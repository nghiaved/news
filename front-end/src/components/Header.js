import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import moment from 'moment'
import { useGlobalState } from '../hooks'
import {
    apiFriendsGetListRequests, apiFriendsAcceptRequest, apiFriendsDeleteFriend,
    apiConversationsGetAllConversations
} from '../services'
import { path, socket, alertMessage } from '../utils'
import SearchUser from './SearchUser'

export default function Header() {
    const [state, dispatch] = useGlobalState()
    const [fetchAgain, setFetchAgain] = useState(false)
    const [listFriends, setListFriends] = useState([])
    const [conversations, setConversations] = useState([])
    const token = JSON.parse(window.localStorage.getItem('token'))
    const userInfo = token ? jwtDecode(token) : {}
    const navigate = useNavigate()
    const toastRef = useRef()

    const handleToggleSidebar = () => {
        document.querySelector('body').classList.toggle('toggle-sidebar')
    }

    const handleToggleSearchBar = () => {
        document.querySelector('.search-bar').classList.toggle('search-bar-show')
    }

    const handleLogout = () => {
        socket.disconnect()
        window.localStorage.removeItem('token')
        navigate(0)
    }

    const messNotify = conversations.reduce((total, item) => {
        return item.latestMessage.isRead || item.latestMessage.sender === userInfo.id ? total : ++total
    }, 0)

    useEffect(() => {
        if (state.fetchAgain !== fetchAgain || state.userConversation) {
            setFetchAgain(state.fetchAgain)
        }

        const fetchApi = async () => {
            try {
                const resListFriends = await apiFriendsGetListRequests(userInfo.username)
                setListFriends(resListFriends.data.friends.reverse())
                const resConversations = await apiConversationsGetAllConversations(userInfo.id)
                setConversations(
                    resConversations.data.conversations
                        .filter(item => item.latestMessage)
                        .sort((a, b) => Date.parse(b.latestMessage.createAt) - Date.parse(a.latestMessage.createAt))
                )
            } catch (error) {
                console.log(error)
            }
        }

        fetchApi()
    }, [userInfo.username, userInfo.id, state.fetchAgain, fetchAgain, state.userConversation])

    const handleAcceptRequest = async (e, id, friendUsername) => {
        e.stopPropagation()
        try {
            const res = await apiFriendsAcceptRequest(id)
            if (res.status === 200) {
                dispatch({ fetchAgain: !state.fetchAgain })
                socket.emit('request-friend', friendUsername)
                alertMessage(toastRef.current, res.data.message, true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteFriend = async (e, id, friendUsername) => {
        e.stopPropagation()
        try {
            const res = await apiFriendsDeleteFriend(id)
            if (res.status === 200) {
                dispatch({ fetchAgain: !state.fetchAgain })
                socket.emit('request-friend', friendUsername)
                alertMessage(toastRef.current, res.data.message, true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <header id="header" className="header fixed-top d-flex align-items-center">
            <div className="d-flex align-items-center justify-content-between">
                <Link to={path.HOME} className="logo d-flex align-items-center">
                    <img src="/img/logo.png" alt="" />
                    <span className="d-none d-lg-block">News</span>
                </Link>
                <i onClick={handleToggleSidebar} className="bi bi-list toggle-sidebar-btn"></i>
            </div>
            <SearchUser userId={userInfo.id} />
            <nav className="header-nav ms-auto">
                <ul className="d-flex align-items-center">
                    <li className="nav-item d-block d-md-none">
                        <Link onClick={handleToggleSearchBar} className="nav-link nav-icon search-bar-toggle" to="#search">
                            <i className="bi bi-search"></i>
                        </Link>
                    </li>
                    <li className="nav-item dropdown">
                        <Link className="nav-link nav-icon" to="/" data-bs-toggle="dropdown">
                            <i className="bi bi-bell"></i>
                            {listFriends.length > 0 && <span className="badge bg-primary badge-number">{listFriends.length}</span>}
                        </Link>
                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                            <li className="dropdown-header">
                                You have {listFriends.length} new notifications
                                <Link to="/"><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></Link>
                            </li>
                            <li className='mx-2 h6' ref={toastRef}></li>
                            {listFriends.map((item, index) => {
                                return <div key={index}>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li className="notification-item align-items-start">
                                        <Link to={`${path.PROFILE}/${item.username}`}>
                                            <img src={item.image ? item.image : "/img/no-avatar.png"} alt="Profile" className="rounded-circle img-in-notify" />
                                        </Link>
                                        <div className='ms-2'>
                                            <h4>{item.firstName} sent you a friend request.</h4>
                                            <p>
                                                <button onClick={(e) => handleAcceptRequest(e, item.id, item.username)} className='btn btn-primary me-2 py-0 px-3'>Confirm</button>
                                                <button onClick={(e) => handleDeleteFriend(e, item.id, item.username)} className='btn btn-secondary py-0 px-3'>Delete</button>
                                            </p>
                                            <p>{moment(item.createAt).fromNow()}</p>
                                        </div>
                                    </li>
                                </div>
                            })}
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li className="dropdown-footer">
                                <Link to="/">Show all notifications</Link>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-item dropdown">
                        <Link className="nav-link nav-icon" to="/" data-bs-toggle="dropdown">
                            <i className="bi bi-chat-left-text"></i>
                            {messNotify > 0 && <span className="badge bg-success badge-number">{messNotify}</span>}
                        </Link>
                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                            <li className="dropdown-header">
                                You have {messNotify} new messages
                                <Link to="/"><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            {conversations.map((item, index) => {
                                return <div key={index}>
                                    <li className="notification-item align-items-start">
                                        <Link to={`${path.PROFILE}/${item.username}`}>
                                            <img src={item.image ? item.image : "/img/no-avatar.png"} alt="Profile" className="rounded-circle img-in-notify" />
                                        </Link>
                                        <Link onClick={() => dispatch({ userConversation: item })} className='ms-2'>
                                            <h4 className='text-black'>{item.firstName + ' ' + item.lastName}</h4>
                                            <p className={item.latestMessage.isRead || item.latestMessage.sender === userInfo.id ? 'fw-normal' : 'fw-bold'}>
                                                {item.latestMessage.content.length > 30
                                                    ? item.latestMessage.content.slice(0, 30) + '...'
                                                    : item.latestMessage.content}</p>
                                            <p>{moment(item.latestMessage.createAt).fromNow()}</p>
                                        </Link>
                                    </li>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                </div>
                            })}
                            <li className="dropdown-footer">
                                <Link to="/">Show all messages</Link>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-item dropdown pe-3">
                        <Link className="nav-link nav-profile d-flex align-items-center pe-0" to="/" data-bs-toggle="dropdown">
                            <img src={userInfo.image ? userInfo.image : "/img/no-avatar.png"} alt="Profile" className="rounded-circle" />
                            <span className="d-none d-md-block dropdown-toggle ps-2">{userInfo.firstName}</span>
                        </Link>
                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                            <li className="dropdown-header">
                                <h6>{userInfo.firstName + ' ' + userInfo.lastName}</h6>
                                <span>@{userInfo.username}</span>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <Link className="dropdown-item d-flex align-items-center" to={path.MY_POSTS}>
                                    <i className="bi bi-sticky"></i>
                                    <span>My Posts</span>
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <Link className="dropdown-item d-flex align-items-center" to={path.ACCOUNT_SETTINGS}>
                                    <i className="bi bi-gear"></i>
                                    <span>Account Settings</span>
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li onClick={handleLogout}>
                                <Link className="dropdown-item d-flex align-items-center" to="#">
                                    <i className="bi bi-box-arrow-right"></i>
                                    <span>Sign Out</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </header>
    )
}
