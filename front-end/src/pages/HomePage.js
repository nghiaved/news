import React, { useState, useEffect, useCallback } from 'react'
import ReactQuill from 'react-quill'
import moment from 'moment'
import { apiPostsGetAllPosts } from '../services'
import Pagination from '../components/Pagination'

export default function HomePage() {
    const [posts, setPosts] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [numberOfPages, setNumberOfPages] = useState([])

    const fetchAllPosts = useCallback(async () => {
        try {
            const res = await apiPostsGetAllPosts({ page: pageNumber, limit: 4 })
            setPosts(res.data.posts)
            setNumberOfPages(new Array(res.data.totalPage).fill(null).map((item, index) => ++index))
        } catch (error) {
            console.log(error)
        }
    }, [pageNumber])


    useEffect(() => {
        fetchAllPosts()
    }, [fetchAllPosts])
    return (
        <main id='main' className='main'>
            <div className='row'>
                {posts.map((item, index) => {
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
                        </div>
                    </div>
                })}
                <Pagination
                    numberOfPages={numberOfPages}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                />
            </div>
        </main>
    )
}
