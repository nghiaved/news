import React, { useEffect, useState, useCallback } from 'react'
import ReactQuill from 'react-quill'
import moment from 'moment'
import { jwtDecode } from 'jwt-decode'
import { Link } from 'react-router-dom'
import { apiPostsGetAllMyPosts, apiPostsDeleteFriend } from '../services'
import { path } from '../utils'
import Pagination from '../components/Pagination'
import DetailPost from '../components/DetailPost'
import { toast } from 'react-toastify'
import CreatePost from '../components/CreatePost'
import EditPost from '../components/EditPost'

export default function MyPosts() {
    const [myPosts, setMyPosts] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [numberOfPages, setNumberOfPages] = useState([])
    const [edit, setEdit] = useState({})
    const [detail, setDetail] = useState({})
    const token = JSON.parse(window.localStorage.getItem('token'))
    const userInfo = jwtDecode(token)

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

    const handleDeletePost = async id => {
        try {
            const res = await apiPostsDeleteFriend(id)
            if (res.status === 200) {
                toast.success(res.data.message)
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
                <button className="btn btn-sm btn-outline-primary mb-3" data-bs-toggle="modal" data-bs-target="#createModal">Create Post</button>
                <CreatePost userInfo={userInfo} fetchAllMyPosts={fetchAllMyPosts} />
                <div className='row'>
                    {myPosts.map((item, index) => (
                        <div key={index} className="card">
                            <div className='card-header d-flex align-items-center justify-content-between'>
                                <h5 className='mb-0'>{item.author}</h5>
                                <span>
                                    {item.hashtags?.split(',').map(item => (
                                        <div key={item} className='btn btn-sm text-secondary'>{item}</div>
                                    ))} {moment(item.createAt).format('YYYY/MM/DD HH:mm')}
                                </span>
                            </div>
                            <div className="card-body post-container" style={index % 2 === 0 ? {} : { flexDirection: 'row-reverse' }}>
                                <div className='post-image'>
                                    {item.image && <img src={item.image} className="card-img border" alt="..." />}
                                    {item.image2 && <img src={item.image2} className="card-img border" alt="..." />}
                                    {item.image3 && <img src={item.image3} className="card-img border" alt="..." />}
                                    {item.image4 && <img src={item.image4} className="card-img border" alt="..." />}
                                </div>
                                <div className='post-content'>
                                    <ReactQuill value={item.status} theme="bubble" readOnly={true} />
                                </div>
                            </div>
                            <div className='card-footer text-end'>
                                <button onClick={() => setDetail(item)} className='btn btn-sm btn-outline-secondary me-3'
                                    data-bs-toggle="modal" data-bs-target="#detailModal">
                                    Detail
                                </button>
                                <button onClick={() => setEdit(item)} className='btn btn-sm btn-outline-warning me-3' data-bs-toggle="modal" data-bs-target="#updateModal">Edit</button>
                                <button className='btn btn-sm btn-outline-danger' data-bs-toggle="modal" data-bs-target={`#deleteModal${item.id}`}>Delete</button>
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
                                                <button type="button" className="btn btn-sm btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button onClick={() => handleDeletePost(item.id)} data-bs-dismiss="modal" type="button" className="btn btn-sm btn-danger">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <Pagination
                        numberOfPages={numberOfPages}
                        pageNumber={pageNumber}
                        setPageNumber={setPageNumber}
                    />
                    {edit && <EditPost edit={edit} userInfo={userInfo} fetchAllMyPosts={fetchAllMyPosts} />}
                </div>
            </section>
            <DetailPost data={detail} modalId={'detailModal'} />
        </main >
    )
}
