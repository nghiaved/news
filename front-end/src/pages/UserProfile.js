import React, { useState, useEffect, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useGlobalState } from '../hooks'
import { apiUsersGetInfo, apiFriendsGetFriend, apiFriendsSendRequest, apiFriendsAcceptRequest, apiFriendsDeleteFriend } from '../services'
import { path, socket } from '../utils'

export default function UserProfile() {
    const [state, dispatch] = useGlobalState()
    const [fetchAgain, setFetchAgain] = useState(false)
    const [user, setUser] = useState({})
    const [infoFriend, setInfoFriend] = useState()
    const { username } = useParams()
    const token = JSON.parse(window.localStorage.getItem('token'))
    const userInfo = jwtDecode(token)
    const navigate = useNavigate()

    const getInfoUser = useCallback(async () => {
        try {
            const res = await apiUsersGetInfo(username)
            setUser(res.data.user)
        } catch (error) {
            navigate(username)
        }
    }, [username, navigate])

    const getInfoFriend = useCallback(async () => {
        try {
            const res = await apiFriendsGetFriend({ username: userInfo.username, friendUsername: username })
            setInfoFriend(res.data.friend)
        } catch (error) {
            setInfoFriend(null)
        }
    }, [userInfo.username, username])

    useEffect(() => {
        if (state.fetchAgain !== fetchAgain) {
            setFetchAgain(state.fetchAgain)
        }

        getInfoUser()
        getInfoFriend()
    }, [getInfoUser, getInfoFriend, setFetchAgain, fetchAgain, state.fetchAgain])

    const handleRequestFriend = async (api, data) => {
        try {
            await api(data)
            getInfoFriend()
            dispatch({ fetchAgain: !state.fetchAgain })
            socket.emit('request-friend', username)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSendRequest = () => {
        handleRequestFriend(apiFriendsSendRequest, { username: userInfo.username, friendUsername: username })
        toast.success('Friend request sent')
    }

    const handleAcceptRequest = () => {
        handleRequestFriend(apiFriendsAcceptRequest, infoFriend.id)
        toast.success('Friend request accepted')
    }

    const handleDeleteFriend = () => {
        handleRequestFriend(apiFriendsDeleteFriend, infoFriend.id)
        toast.success('Friend request deleted')
    }

    const renderStatus = () => {
        if (infoFriend?.status === 1) {
            return <button type="button" className="btn btn-sm btn-outline-danger me-4" data-bs-toggle="modal" data-bs-target="#exampleModal">Unfriend</button>
        } else if (infoFriend?.status === 0) {
            if (infoFriend?.sender === userInfo.username)
                return <button type="button" className="btn btn-sm btn-outline-danger me-4" data-bs-toggle="modal" data-bs-target="#exampleModal">Recall</button>
            else return <React.Fragment>
                <button onClick={handleAcceptRequest} type="button" className="btn btn-sm btn-outline-primary me-2">Agree</button>
                <button onClick={handleDeleteFriend} type="button" className="btn btn-sm btn-outline-danger me-4">Refuse</button>
            </React.Fragment>
        } else {
            return <button onClick={handleSendRequest} type="button" className="btn btn-sm btn-outline-primary me-4">Add friend</button>
        }
    }

    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>Profile</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to={path.HOME}>Home</Link></li>
                        <li className="breadcrumb-item">Profile</li>
                        <li className="breadcrumb-item active">{username}</li>
                    </ol>
                </nav>
            </div>
            <section className="section profile">
                <div className="row">
                    <div className="col-xl-4 col-lg-4">
                        <div className="card">
                            <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
                                <img src={user.image ? user.image : "/img/no-avatar.png"} alt="Profile" className="rounded-circle" />
                                <h2>{user.firstName + ' ' + user.lastName}</h2>
                                <h3>@{user.username}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-8 col-lg-8">
                        <div className="card">
                            <div className="card-body pt-3">
                                {userInfo.username !== username
                                    ? <div className='d-flex justify-content-end pt-4'>
                                        {renderStatus()}
                                        <button onClick={() => dispatch({ userConversation: user })} type="button" className="btn btn-sm btn-outline-success">Send message</button>
                                        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="exampleModalLabel">Delete friendship</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        Are you sure you want to delete your friendship relationship?
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-sm btn-secondary" data-bs-dismiss="modal">Close</button>
                                                        <button onClick={handleDeleteFriend} data-bs-dismiss="modal" type="button" className="btn btn-sm btn-danger">Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    : <div className="d-flex justify-content-end pt-4">
                                        <Link to={path.ACCOUNT_SETTINGS} className="btn btn-sm btn-outline-warning">Edit profile</Link>
                                    </div>
                                }
                                <div className="tab-content">
                                    <div className="tab-pane fade show active profile-overview">
                                        <h5 className="card-title">About</h5>
                                        <p className="small fst-italic">
                                            {user.about ? user.about : 'No bio yet.'}
                                        </p>
                                        <h5 className="card-title">Profile Details</h5>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 label ">Full Name</div>
                                            <div className="col-lg-9 col-md-8">{user.firstName + ' ' + user.lastName}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Username</div>
                                            <div className="col-lg-9 col-md-8">{user.username}</div>
                                        </div>
                                        {user.email && <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Email</div>
                                            <div className="col-lg-9 col-md-8">{user.email}</div>
                                        </div>}
                                        {user.address && <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Address</div>
                                            <div className="col-lg-9 col-md-8">{user.address}</div>
                                        </div>}
                                        {user.phone && <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Phone</div>
                                            <div className="col-lg-9 col-md-8">{user.phone}</div>
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
