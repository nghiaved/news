import React, { useEffect, useState, useCallback, useRef } from 'react'
import ReactQuill from 'react-quill'
import moment from 'moment'
import { jwtDecode } from 'jwt-decode'
import { Link } from 'react-router-dom'
import { apiPostsGetAllMyPosts, apiPostsCreatePost, apiPostsUpdatePost, apiPostsDeleteFriend } from '../services'
import { path, alertMessage } from '../utils'
import Pagination from '../components/Pagination'

export default function MyPosts() {
    const [myPosts, setMyPosts] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [numberOfPages, setNumberOfPages] = useState([])
    const [imageCreate, setImageCreate] = useState()
    const [statusCreate, setStatusCreate] = useState()
    const [imageUpdate, setImageUpdate] = useState()
    const [statusUpdate, setStatusUpdate] = useState()
    const [edit, setEdit] = useState({})
    const token = JSON.parse(window.localStorage.getItem('token'))
    const userInfo = jwtDecode(token)
    const postRef = useRef()
    const statusCreateRef = useRef()
    const statusUpdateRef = useRef()

    const fetchAllMyPosts = useCallback(async () => {
        try {
            const res = await apiPostsGetAllMyPosts({ author: userInfo.username, page: pageNumber, limit: 4 })
            setMyPosts(res.data.posts)
            setNumberOfPages(new Array(res.data.totalPage).fill(null).map((item, index) => ++index))
        } catch (error) {
            console.log(error)
        }
    }, [userInfo.username, pageNumber])


    useEffect(() => {
        fetchAllMyPosts()
    }, [fetchAllMyPosts])

    const handleCreatePost = async () => {
        const checkEmpty = statusCreateRef.current.value
        if (!checkEmpty
            .replaceAll("<p>", "").replaceAll("</p>", "")
            .replaceAll("<br>", "").replaceAll("<br/>", "").trim())
            return alertMessage(postRef.current, 'Please fill in status', false)
        try {
            const data = new FormData()
            data.append('author', userInfo.username)
            data.append('status', statusCreateRef.current.value)
            if (imageCreate) data.append('image', imageCreate)
            const res = await apiPostsCreatePost(data)
            if (res.status === 200) {
                alertMessage(postRef.current, res.data.message, true)
                fetchAllMyPosts()
                setImageCreate()
                setStatusCreate()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpdatePost = async (item) => {
        const checkEmpty = statusUpdateRef.current.value
        if (!checkEmpty
            .replaceAll("<p>", "").replaceAll("</p>", "")
            .replaceAll("<br>", "").replaceAll("<br/>", "").trim())
            return alertMessage(postRef.current, 'Please fill in status', false)
        try {
            const data = new FormData()
            data.append('id', item.id)
            data.append('author', userInfo.username)
            data.append('status', statusUpdateRef.current.value)
            if (imageUpdate) data.append('image', imageUpdate)
            const res = await apiPostsUpdatePost(data)
            if (res.status === 200) {
                alertMessage(postRef.current, res.data.message, true)
                fetchAllMyPosts()
                setImageUpdate()
                setStatusUpdate()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeletePost = async id => {
        try {
            const res = await apiPostsDeleteFriend(id)
            if (res.status === 200) {
                alertMessage(postRef.current, res.data.message, true)
                fetchAllMyPosts()
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <main id='main'>
            <div className="pagetitle">
                <h1>My Posts</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to={path.HOME}>Home</Link></li>
                        <li className="breadcrumb-item">Pages</li>
                        <li className="breadcrumb-item active">My Posts</li>
                    </ol>
                </nav>
            </div>
            <section className="section">
                <button className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#createModal">Create Post</button>
                <div className='my-3' ref={postRef}></div>
                <div className="modal fade" id="createModal" tabIndex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="createModalLabel">Create Post</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <ReactQuill req value={statusCreate} ref={statusCreateRef} theme="snow" placeholder='Status' />
                                <div className="d-flex justify-content-between mt-3">
                                    <div className="text-center">
                                        {imageCreate
                                            ? <img className='border img-in-create-post' src={URL.createObjectURL(imageCreate)} alt="Profile" />
                                            : <img className='border img-in-create-post' src="/img/no-image.jpeg" alt="Profile" />}
                                        <div className="pt-2">
                                            <label className='set-upload-img'>
                                                <input type='file' onChange={e => {
                                                    setStatusCreate(statusCreateRef.current.value)
                                                    setImageCreate(e.target.files[0])
                                                }} />
                                                <i className="btn btn-primary btn-sm bi bi-upload"></i>
                                            </label>
                                            <i onClick={() => setImageCreate()} className="ms-2 btn btn-danger btn-sm bi bi-trash"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button onClick={handleCreatePost} data-bs-dismiss="modal" type="submit" className="btn btn-primary">Create</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    {myPosts.map((item, index) => {
                        return <div key={index} className="col-lg-6">
                            <div className="card">
                                <div className='card-header d-flex align-items-center justify-content-between'>
                                    <h5 className='mb-0'>{item.author}</h5>
                                    <span>{moment(item.createAt).format('YYYY/MM/DD HH:mm')}</span>
                                </div>
                                <div className="card-body">
                                    <ReactQuill value={item.status} theme="bubble" readOnly={true} />
                                    <div style={{ height: '30vh' }} className='mt-3'>
                                        {item.image && <img style={{ height: '100%', objectFit: 'cover' }} src={item.image} className="card-img border" alt="..." />}
                                    </div>
                                </div>
                                <div className='card-footer text-end'>
                                    <button onClick={() => {
                                        setEdit(item)
                                        setStatusUpdate(item.status)
                                    }} className='btn btn-outline-warning me-3' data-bs-toggle="modal" data-bs-target="#updateModal">Edit</button>
                                    <button className='btn btn-outline-danger' data-bs-toggle="modal" data-bs-target={`#deleteModal${item.id}`}>Delete</button>
                                    <div className="modal fade" id={`deleteModal${item.id}`} tabIndex="-1" aria-labelledby={`deleteModal${item.id}Label`} aria-hidden="true">
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id={`deleteModal${item.id}Label`}>Delete post</h5>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    Are you sure you want to delete your post?
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button onClick={() => handleDeletePost(item.id)} data-bs-dismiss="modal" type="button" className="btn btn-danger">Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })}
                    <Pagination
                        numberOfPages={numberOfPages}
                        pageNumber={pageNumber}
                        setPageNumber={setPageNumber}
                    />
                    {edit &&
                        <div className="modal fade" id="updateModal" tabIndex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="updateModalLabel">Edit Post</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body text-start">
                                        <ReactQuill value={statusUpdate} ref={statusUpdateRef} theme="snow" placeholder='Status' />
                                        <div className="d-flex justify-content-between mt-3">
                                            <div className="text-center">
                                                {imageUpdate
                                                    ? <img className='border img-in-create-post' src={URL.createObjectURL(imageUpdate)} alt="Profile" />
                                                    : <img className='border img-in-create-post' src={edit.image ? edit.image : "/img/no-image.jpeg"} alt="Profile" />}
                                                <div className="pt-2">
                                                    <label className='set-upload-img'>
                                                        <input type='file' onChange={e => {
                                                            setStatusUpdate(statusUpdateRef.current.value)
                                                            setImageUpdate(e.target.files[0])
                                                        }} />
                                                        <i className="btn btn-primary btn-sm bi bi-upload"></i>
                                                    </label>
                                                    <i onClick={() => setImageUpdate()} className="ms-2 btn btn-danger btn-sm bi bi-trash"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                        <button onClick={() => handleUpdatePost(edit)} data-bs-dismiss="modal" type="submit" className='btn btn-warning'>Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>}
                </div>
            </section>
        </main >
    )
}
