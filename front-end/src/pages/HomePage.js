import React, { useState, useEffect, useCallback } from 'react'
import ReactQuill from 'react-quill'
import moment from 'moment'
import { apiPostsAddViewPost, apiPostsGetAllPosts, apiPostsAddDislikePost, apiPostsAddLikePost } from '../services'
import Pagination from '../components/Pagination'
import ModalComment from '../components/Comment'
import DetailPost from '../components/DetailPost'
import { toast } from 'react-toastify'
import { defaultHashtags } from '../constants/hashtag'

export default function HomePage() {
    const [posts, setPosts] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [numberOfPages, setNumberOfPages] = useState([])
    const [postId, setPostId] = useState(0)
    const [dataView, setDataView] = useState({})
    const [hashtag, setHashtag] = useState('')

    const fetchAllPosts = useCallback(async () => {
        try {
            const res = await apiPostsGetAllPosts({ page: pageNumber, limit: 4, hashtag })
            setPosts(res.data.posts)
            setNumberOfPages(new Array(res.data.totalPage).fill(null).map((item, index) => ++index))
        } catch (error) {
            console.log(error)
        }
    }, [pageNumber, hashtag])

    useEffect(() => {
        fetchAllPosts()
    }, [fetchAllPosts])

    const handleUpdateViewPost = async data => {
        setDataView(data)
        try {
            await apiPostsAddViewPost(data.id)
            fetchAllPosts()
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpdateLikePost = async (id) => {
        try {
            await apiPostsAddLikePost(id)
            toast.success('Like successfully!')
            fetchAllPosts()
        } catch (error) {
            console.log(error)
            toast.error('Some things wrong!')
        }
    }

    const handleUpdateDislikePost = async (id) => {
        try {
            await apiPostsAddDislikePost(id, 'totalDislike')
            toast.success('Dislike successfully!')
            fetchAllPosts()
        } catch (error) {
            console.log(error)
            toast.error('Some things wrong!')
        }
    }

    return (
        <main id='main' className='main'>
            <div className='d-flex align-items-center gap-3 mb-4'>
                <label>Hashtags: </label>
                <select onChange={e => setHashtag(e.target.value)} style={{ width: 200 }} className="form-select form-select-sm">
                    <option value={''}>All</option>
                    {defaultHashtags.map(item => (
                        <option value={item} key={item}>{item}</option>
                    ))}
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
                    <div className='m-4 text-end'>
                        <div className='d-flex justify-content-between align-items-center'>
                            <div>
                                <button onClick={() => handleUpdateLikePost(item.id)} className='btn btn-sm btn-outline-success me-2'>
                                    Like {item.totalLike > 0 && `(${item.totalLike})`}
                                </button>
                                <button onClick={() => handleUpdateDislikePost(item.id)} className='btn btn-sm btn-outline-danger me-2'>
                                    Dislike {item.totalDislike > 0 && `(${item.totalDislike})`}
                                </button>
                            </div>
                            <div>
                                <button onClick={() => handleUpdateViewPost(item)} className='btn btn-sm btn-outline-secondary me-2'
                                    data-bs-toggle="modal" data-bs-target="#viewModal">
                                    View {item.totalView > 0 && `(${item.totalView})`}
                                </button>
                                <button onClick={() => setPostId(item.id)} className='btn btn-sm btn-outline-primary'
                                    data-bs-toggle="modal" data-bs-target="#commentModal">
                                    Comment {item.totalComment > 0 && `(${item.totalComment})`}
                                </button>
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
            <ModalComment postId={postId} />
            <DetailPost data={dataView} modalId={'viewModal'} />
        </main>
    )
}
