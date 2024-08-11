import React, { useState, useEffect, useCallback, useRef } from 'react'
import moment from 'moment'
import { jwtDecode } from 'jwt-decode'
import {
    apiConversationsGetConversation, apiConversationsCreateConversation,
    apiMessagesGetAllMessages, apiMessagesSendMessage
} from '../services'
import { useGlobalState } from '../hooks'
import { socket } from '../utils'

export default function Conversation() {
    const [state, dispatch] = useGlobalState()
    const [fetchAgain, setFetchAgain] = useState(false)
    const [hide, setHide] = useState(false)
    const [user, setUser] = useState({})
    const [idConversation, setIdConversation] = useState()
    const [messages, setMessages] = useState([])
    const token = JSON.parse(window.localStorage.getItem('token'))
    const userInfo = jwtDecode(token)
    const messageInputRef = useRef()
    const messageRef = useRef()

    const getConversation = useCallback(async () => {
        try {
            const res = await apiConversationsGetConversation({ user1: userInfo.id, user2: state.userConversation.id })
            if (res.data.conversation) {
                setIdConversation(res.data.conversation.id)
            } else {
                await apiConversationsCreateConversation({ user1: userInfo.id, user2: state.userConversation.id })
                getConversation()
            }
        } catch (error) {
            console.log(error)
        }
    }, [state.userConversation?.id, userInfo.id])

    const getAllMessages = useCallback(async () => {
        try {
            const res = await apiMessagesGetAllMessages(idConversation, userInfo.id)
            if (res.data.messages) {
                setMessages(res.data.messages)
            }
        } catch (error) {
            console.log(error)
        }
    }, [idConversation, userInfo.id])

    useEffect(() => {
        if (state.fetchAgain !== fetchAgain) {
            setFetchAgain(state.fetchAgain)
        }

        if (state.userConversation) {
            setUser(state.userConversation)
            getConversation()
            getAllMessages()
        }

    }, [state.userConversation, state.fetchAgain, fetchAgain, getConversation, getAllMessages])

    const handleSendMessage = async (e) => {
        e.preventDefault()
        await apiMessagesSendMessage({
            id: idConversation,
            content: messageInputRef.current.value,
            sender: userInfo.id,
            receiver: state.userConversation.id
        })
        await dispatch({ fetchAgain: !state.fetchAgain })
        await socket.emit('request-friend', user.username)
        await getAllMessages()
        messageInputRef.current.value = ''
    }

    return (
        <div className="conversation-wrapper" style={state.userConversation ? hide ? { right: '20px', height: 50, overflow: 'hidden' } : { right: '20px' } : {}}>
            <div className='conversation-header bg-secondary text-white'>
                <span className='d-flex align-items-center'>
                    <img src={user.image ? user.image : "/img/no-avatar.png"} alt="Profile" className="rounded-circle border" />
                    <div>
                        <span>{user.firstName + ' ' + user.lastName}</span>
                        <div style={{ fontSize: 12 }}>
                            {state.userConversation?.lastActive
                                ? moment(state.userConversation?.lastActive).fromNow()
                                : 'Online'}
                        </div>
                    </div>
                </span>
                <span>
                    <i onClick={() => setHide(!hide)} className={hide ? "bi bi-plus-lg me-3" : "bi bi-dash-lg me-3"}></i>
                    <i onClick={() => {
                        setHide(false)
                        dispatch({ userConversation: null })
                    }} className="bi bi-x-lg nav-icon"></i>
                </span>
            </div>
            <div className={hide ? 'conversation-body d-none' : 'conversation-body'}>
                {messages.map((item, index) => {
                    messageRef.current.scrollIntoView({ behavior: 'smooth' })
                    return <div key={index} style={{ fontSize: 15 }} className={item.sender === userInfo.id ? 'text-end ms-5' : 'me-5'}>
                        {item.content}
                    </div>
                }
                )}
                <div className='pt-4' ref={messageRef}></div>
            </div>
            <form onSubmit={handleSendMessage} className={hide ? "conversation-footer input-group d-none" : "conversation-footer input-group"}>
                <input ref={messageInputRef} required autoComplete='off' type="text" className="form-control" placeholder='Say something...' />
                <button className="input-group-text">Send</button>
            </form>
        </div>
    )
}
