import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { path } from '../utils'
import { apiSavesDeleteSave, apiSavesGetAllSaves } from '../services/saveService'
import { jwtDecode } from 'jwt-decode'
import ReactQuill from 'react-quill'
import { toast } from 'react-toastify'
import moment from 'moment'
import Pagination from '../components/Pagination'
import DetailPost from '../components/DetailPost'

export default function SavedPosts() {
    const [savedPosts, setSavedPosts] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [numberOfPages, setNumberOfPages] = useState([])
    const [detail, setDetail] = useState({})
    const token = JSON.parse(window.localStorage.getItem('token'))
    const userInfo = jwtDecode(token)

    const fetchSaves = useCallback(async () => {
        try {
            const res = await apiSavesGetAllSaves({
                userId: userInfo.id, type: 'save', page: pageNumber, limit: 4
            })
            setSavedPosts(res.data.saves)
            setNumberOfPages(new Array(res.data.totalPage).fill(null).map((item, index) => ++index))
        } catch (error) {
            console.log(error)
        }
    }, [userInfo.id, pageNumber])

    useEffect(() => {
        fetchSaves()
    }, [fetchSaves])

    const handleDeleteSave = async (item) => {
        try {
            const res = await apiSavesDeleteSave(item.id)
            if (res.status === 200) {
                toast.success(res.data.message)
                fetchSaves()
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <main id='main'>
            <div className="pagetitle">
                <h1>Saved Posts</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to={path.HOME}>Home</Link></li>
                        <li className="breadcrumb-item">Pages</li>
                        <li className="breadcrumb-item active">Saved Posts</li>
                    </ol>
                </nav>
            </div>
            {savedPosts.length > 0 ? (
                <div className='row'>
                    {savedPosts.map((item, index) => (
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
                            <div className='card-footer text-end'>
                                <button onClick={() => setDetail(item)} className='btn btn-sm btn-outline-secondary me-3'
                                    data-bs-toggle="modal" data-bs-target="#detailModalSaved">
                                    Detail
                                </button>
                                <button onClick={() => handleDeleteSave(item)} className='btn btn-sm btn-outline-danger'>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    <Pagination
                        numberOfPages={numberOfPages}
                        pageNumber={pageNumber}
                        setPageNumber={setPageNumber}
                    />
                    <DetailPost data={detail} modalId={'detailModalSaved'} />
                </div>
            ) : (
                <section className="section">
                    <div className='d-flex justify-content-center mt-5'>
                        <div className='p-4 text-center' style={{ border: '1px dashed grey', borderRadius: 10, width: 'fit-content' }}>
                            <h5 className='mb-3'>No posts saved yet</h5>
                            <Link to={path.HOME}>
                                <button className='btn btn-sm btn-warning'>Explore</button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </main >
    )
}
