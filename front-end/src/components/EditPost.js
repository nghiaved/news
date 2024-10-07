import React, { useState, useRef, useEffect } from 'react'
import ReactQuill from 'react-quill'
import { apiPostsUpdatePost } from '../services'
import { toast } from 'react-toastify'
import { defaultHashtags } from '../constants/hashtag'

export default function EditPost({ edit, userInfo, fetchAllMyPosts }) {
    const [imageUpdate, setImageUpdate] = useState()
    const [imageUpdate2, setImageUpdate2] = useState()
    const [imageUpdate3, setImageUpdate3] = useState()
    const [imageUpdate4, setImageUpdate4] = useState()
    const [statusUpdate, setStatusUpdate] = useState()
    const [hashtagsUpdate, setHashtagsUpdate] = useState([])
    const statusUpdateRef = useRef()

    useEffect(() => {
        setStatusUpdate(edit.status)
        setHashtagsUpdate(edit.hashtags?.split(','))
    }, [edit])

    const handleSelectHashtagUpdate = value => {
        setStatusUpdate(statusUpdateRef.current?.value)
        if (hashtagsUpdate?.includes(value)) {
            setHashtagsUpdate(hashtagsUpdate?.filter(item => item !== value))
            return
        }
        setHashtagsUpdate([...hashtagsUpdate, value])
    }

    const handleUpdatePost = async (item) => {
        const checkEmpty = statusUpdateRef.current.value
        if (!checkEmpty
            .replaceAll("<p>", "").replaceAll("</p>", "")
            .replaceAll("<br>", "").replaceAll("<br/>", "").trim())
            return toast.error('Please fill in status')
        if (hashtagsUpdate.length < 1) {
            return toast.error('Please select in hashtag')
        }
        try {
            const data = new FormData()
            data.append('id', item.id)
            data.append('author', userInfo.username)
            data.append('status', statusUpdateRef.current.value)
            data.append('hashtags', hashtagsUpdate)
            if (imageUpdate) data.append('image', imageUpdate)
            if (imageUpdate2) data.append('image2', imageUpdate2)
            if (imageUpdate3) data.append('image3', imageUpdate3)
            if (imageUpdate4) data.append('image4', imageUpdate4)
            const res = await apiPostsUpdatePost(data)
            if (res.status === 200) {
                toast.success(res.data.message)
                fetchAllMyPosts()
                setImageUpdate()
                setImageUpdate2()
                setImageUpdate3()
                setImageUpdate4()
                setStatusUpdate()
                setHashtagsUpdate([])
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="modal fade" id="updateModal" tabIndex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="updateModalLabel">Edit Post</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body text-start">
                        <ReactQuill value={statusUpdate} ref={statusUpdateRef} theme="snow" placeholder='Status' />
                        <div className='d-flex justify-content-between flex-wrap gap-2'>
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
                            <div className="d-flex justify-content-between mt-3">
                                <div className="text-center">
                                    {imageUpdate2
                                        ? <img className='border img-in-create-post' src={URL.createObjectURL(imageUpdate2)} alt="Profile" />
                                        : <img className='border img-in-create-post' src={edit.image2 ? edit.image2 : "/img/no-image.jpeg"} alt="Profile" />}
                                    <div className="pt-2">
                                        <label className='set-upload-img'>
                                            <input type='file' onChange={e => {
                                                setStatusUpdate(statusUpdateRef.current.value)
                                                setImageUpdate2(e.target.files[0])
                                            }} />
                                            <i className="btn btn-primary btn-sm bi bi-upload"></i>
                                        </label>
                                        <i onClick={() => setImageUpdate2()} className="ms-2 btn btn-danger btn-sm bi bi-trash"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mt-3">
                                <div className="text-center">
                                    {imageUpdate3
                                        ? <img className='border img-in-create-post' src={URL.createObjectURL(imageUpdate3)} alt="Profile" />
                                        : <img className='border img-in-create-post' src={edit.image3 ? edit.image3 : "/img/no-image.jpeg"} alt="Profile" />}
                                    <div className="pt-2">
                                        <label className='set-upload-img'>
                                            <input type='file' onChange={e => {
                                                setStatusUpdate(statusUpdateRef.current.value)
                                                setImageUpdate3(e.target.files[0])
                                            }} />
                                            <i className="btn btn-primary btn-sm bi bi-upload"></i>
                                        </label>
                                        <i onClick={() => setImageUpdate3()} className="ms-2 btn btn-danger btn-sm bi bi-trash"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mt-3">
                                <div className="text-center">
                                    {imageUpdate4
                                        ? <img className='border img-in-create-post' src={URL.createObjectURL(imageUpdate4)} alt="Profile" />
                                        : <img className='border img-in-create-post' src={edit.image4 ? edit.image4 : "/img/no-image.jpeg"} alt="Profile" />}
                                    <div className="pt-2">
                                        <label className='set-upload-img'>
                                            <input type='file' onChange={e => {
                                                setStatusUpdate(statusUpdateRef.current.value)
                                                setImageUpdate4(e.target.files[0])
                                            }} />
                                            <i className="btn btn-primary btn-sm bi bi-upload"></i>
                                        </label>
                                        <i onClick={() => setImageUpdate4()} className="ms-2 btn btn-danger btn-sm bi bi-trash"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-4 d-flex gap-2 flex-wrap'>
                            {defaultHashtags.map(item => (
                                <button
                                    key={item}
                                    onClick={() => handleSelectHashtagUpdate(item)}
                                    className={`btn btn-sm ${hashtagsUpdate?.includes(item) ? 'btn-primary' : 'btn-outline-primary'}`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-sm btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button onClick={() => handleUpdatePost(edit)} data-bs-dismiss="modal" type="submit" className='btn btn-sm btn-warning'>Save</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
