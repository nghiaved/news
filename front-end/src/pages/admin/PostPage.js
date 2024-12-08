import React, { useState, useEffect, useCallback } from 'react'
import ReactQuill from 'react-quill'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { path } from '../../utils'
import { apiPostsDeleteFriend, apiPostsGetAllPosts, apiPostsUpdateStatusPost } from '../../services'
import Pagination from '../../components/Pagination'
import DetailPost from '../../components/DetailPost'
import { toast } from 'react-toastify'

export default function HomePage() {
    const [posts, setPosts] = useState([])
    const [statusPost, setStatusPost] = useState('')
    const [pageNumber, setPageNumber] = useState(1)
    const [numberOfPages, setNumberOfPages] = useState([])
    const [dataView, setDataView] = useState({})

    const fetchAllPosts = useCallback(async () => {
        try {
            const res = await apiPostsGetAllPosts({ page: pageNumber, limit: 4, status_post: statusPost })
            setPosts(res.data.posts)
            setNumberOfPages(new Array(res.data.totalPage).fill(null).map((item, index) => ++index))
        } catch (error) {
            console.log(error)
        }
    }, [pageNumber, statusPost])

    useEffect(() => {
        fetchAllPosts()
    }, [fetchAllPosts])

    const renderActionStatusPost = (item) => {
        switch (item.status_post) {
            case 'accepted':
                return <>
                    <button className='btn btn-sm btn-outline-danger ms-2' data-bs-toggle="modal" data-bs-target={`#deleteModal${item.id}`}>Delete</button>
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
                </>
            case 'refused':
                return <>
                    <button className='btn btn-sm btn-outline-danger ms-2' data-bs-toggle="modal" data-bs-target={`#deleteModal${item.id}`}>Delete</button>
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
                </>
            default:
                return <>
                    <button onClick={() => handleUpdateStatusPost(item.id, 'accepted')} className='btn btn-sm btn-outline-success ms-2'>
                        Accept
                    </button>
                    <button onClick={() => handleUpdateStatusPost(item.id, 'refused')} className='btn btn-sm btn-outline-danger ms-2'>
                        Refuse
                    </button>
                </>
        }
    }

    const renderStatusPost = (item) => {
        switch (item.status_post) {
            case 'accepted':
                return <span className='text-success'>Accepted</span>
            case 'refused':
                return <span className='text-danger'>Refused</span>
            default:
                return <span className='text-warning'>Waiting</span>
        }
    }

    const handleUpdateStatusPost = async (id, status_post) => {
        try {
            const res = await apiPostsUpdateStatusPost(id, status_post)
            if (res.status === 200) {
                toast.success(res.data.message)
                fetchAllPosts()
            }
        } catch (error) {
            console.log(error)
            toast.error('Some things wrong!')
        }
    }

    const handleDeletePost = async id => {
        try {
            const res = await apiPostsDeleteFriend(id)
            if (res.status === 200) {
                toast.success(res.data.message)
                fetchAllPosts()
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <main id='main' className='main'>
            <div className="pagetitle">
                <h1>User Management</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to={path.HOME}>Home</Link></li>
                        <li className="breadcrumb-item">Pages</li>
                        <li className="breadcrumb-item active">User Management</li>
                    </ol>
                </nav>
            </div>
            <div className='d-flex align-items-center gap-3 mb-4'>
                <label>Status: </label>
                <select onChange={e => setStatusPost(e.target.value)} style={{ width: 200 }} className="form-select form-select-sm">
                    <option value={''}>All</option>
                    <option value={'accepted'}>Accepted</option>
                    <option value={'refused'}>Refused</option>
                    <option value={'waiting'}>Waiting</option>
                </select>
            </div>
            {posts.map((item, index) => (
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
                        <div className='post-image d-flex' style={{ overflow: 'auto' }}>
                            {item.image && <img src={item.image} className="card-img border" alt="..." />}
                            {item.image2 && <img src={item.image2} className="card-img border" alt="..." />}
                            {item.image3 && <img src={item.image3} className="card-img border" alt="..." />}
                            {item.image4 && <img src={item.image4} className="card-img border" alt="..." />}
                        </div>
                        <div className='post-content' style={{ minWidth: 300 }}>
                            <ReactQuill value={item.status} theme="bubble" readOnly={true} />
                        </div>
                    </div>
                    <div className='m-4 text-end'>
                        <div className='d-flex justify-content-between'>
                            <div>Status: {renderStatusPost(item)}</div>
                            <div>
                                <button onClick={() => setDataView(item)} className='btn btn-sm btn-outline-secondary'
                                    data-bs-toggle="modal" data-bs-target="#viewModal">
                                    Detail
                                </button>
                                {renderActionStatusPost(item)}
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
            <DetailPost data={dataView} modalId={'viewModal'} />
        </main>
    )
}
