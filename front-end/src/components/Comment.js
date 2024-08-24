import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { useLoading } from '../hooks'
import { jwtDecode } from 'jwt-decode'
import { path } from '../utils'
import { apiCommentsGetAllComments, apiCommentsSendComment } from '../services'

export default function ModalComment({ postId }) {
    const [comments, setComments] = useState([])
    const token = JSON.parse(window.localStorage.getItem('token'))
    const userInfo = jwtDecode(token)
    const { setIsLoading } = useLoading()

    const fetchComments = useCallback(async () => {
        try {
            setIsLoading(true)
            const res = await apiCommentsGetAllComments(postId)
            setComments(res.data.comments.sort((a, b) => b.createAt.localeCompare(a.createAt)))
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }, [postId, setIsLoading])

    useEffect(() => {
        fetchComments()
    }, [fetchComments])

    const handleSendComment = async e => {
        e.preventDefault()

        if (postId === 0) {
            toast.error('No posts found')
            return
        }

        try {
            setIsLoading(true)
            const res = await apiCommentsSendComment({
                id: postId,
                sender: userInfo.id,
                content: e.target.comment.value
            })
            toast.success(res.data.message)
            e.target.comment.value = ''
            fetchComments(postId)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="modal fade" id="commentModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Comment ({comments.length})</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
                            {comments.map((item, index) => (
                                <div key={index} style={{ fontSize: 15 }} className='d-flex gap-3 mb-4 mx-3'>
                                    <Link to={`${path.PROFILE}/${item.username}`}>
                                        <img src={item.image ? item.image : "/img/no-avatar.png"} alt="Profile" className="rounded-circle img-in-sidebar" />
                                    </Link>
                                    <div className='w-100'>
                                        <div className='d-flex justify-content-between'>
                                            <span className={item.sender === userInfo.id ? 'text-primary' : 'text-black'} style={{ fontWeight: 600 }}>
                                                {item.sender === userInfo.id ? 'You' : `${item.firstName} ${item.lastName}`}
                                            </span>
                                            <span style={{ fontSize: 12 }}>
                                                {moment(item.createAt).fromNow()}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: 13 }}>
                                            {item.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSendComment} className='input-group'>
                            <input name='comment' required autoComplete='off' type="text" className="form-control" placeholder='Say something...' />
                            <button className="input-group-text">Send</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
