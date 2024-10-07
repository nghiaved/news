import React, { useState, useRef } from 'react'
import ReactQuill from 'react-quill'
import { apiPostsCreatePost } from '../services'
import { toast } from 'react-toastify'
import { defaultHashtags } from '../constants/hashtag'

export default function CreatePost({ userInfo, fetchAllMyPosts }) {
    const [imageCreate, setImageCreate] = useState()
    const [imageCreate2, setImageCreate2] = useState()
    const [imageCreate3, setImageCreate3] = useState()
    const [imageCreate4, setImageCreate4] = useState()
    const [statusCreate, setStatusCreate] = useState()
    const [hashtagsCreate, setHashtagsCreate] = useState([])
    const statusCreateRef = useRef()

    const handleSelectHashtagCreate = value => {
        setStatusCreate(statusCreateRef.current?.value)
        if (hashtagsCreate?.includes(value)) {
            setHashtagsCreate(hashtagsCreate?.filter(item => item !== value))
            return
        }
        setHashtagsCreate([...hashtagsCreate, value])
    }

    const handleCreatePost = async () => {
        const checkEmpty = statusCreateRef.current.value
        if (!checkEmpty
            .replaceAll("<p>", "").replaceAll("</p>", "")
            .replaceAll("<br>", "").replaceAll("<br/>", "").trim())
            return toast.error('Please fill in status')
        if (hashtagsCreate.length < 1) {
            return toast.error('Please select in hashtag')
        }
        try {
            const data = new FormData()
            data.append('author', userInfo.username)
            data.append('status', statusCreateRef.current.value)
            data.append('hashtags', hashtagsCreate)
            if (imageCreate) data.append('image', imageCreate)
            if (imageCreate2) data.append('image2', imageCreate2)
            if (imageCreate3) data.append('image3', imageCreate3)
            if (imageCreate4) data.append('image4', imageCreate4)
            const res = await apiPostsCreatePost(data)
            if (res.status === 200) {
                toast.success(res.data.message)
                fetchAllMyPosts()
                setImageCreate()
                setImageCreate2()
                setImageCreate3()
                setImageCreate4()
                setStatusCreate()
                setHashtagsCreate([])
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="modal fade" id="createModal" tabIndex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="createModalLabel">Create Post</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <ReactQuill req value={statusCreate} ref={statusCreateRef} theme="snow" placeholder='Status' />
                        <div className='d-flex justify-content-between flex-wrap gap-2'>
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
                            <div className="d-flex justify-content-between mt-3">
                                <div className="text-center">
                                    {imageCreate2
                                        ? <img className='border img-in-create-post' src={URL.createObjectURL(imageCreate2)} alt="Profile" />
                                        : <img className='border img-in-create-post' src="/img/no-image.jpeg" alt="Profile" />}
                                    <div className="pt-2">
                                        <label className='set-upload-img'>
                                            <input type='file' onChange={e => {
                                                setStatusCreate(statusCreateRef.current.value)
                                                setImageCreate2(e.target.files[0])
                                            }} />
                                            <i className="btn btn-primary btn-sm bi bi-upload"></i>
                                        </label>
                                        <i onClick={() => setImageCreate2()} className="ms-2 btn btn-danger btn-sm bi bi-trash"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mt-3">
                                <div className="text-center">
                                    {imageCreate3
                                        ? <img className='border img-in-create-post' src={URL.createObjectURL(imageCreate3)} alt="Profile" />
                                        : <img className='border img-in-create-post' src="/img/no-image.jpeg" alt="Profile" />}
                                    <div className="pt-2">
                                        <label className='set-upload-img'>
                                            <input type='file' onChange={e => {
                                                setStatusCreate(statusCreateRef.current.value)
                                                setImageCreate3(e.target.files[0])
                                            }} />
                                            <i className="btn btn-primary btn-sm bi bi-upload"></i>
                                        </label>
                                        <i onClick={() => setImageCreate3()} className="ms-2 btn btn-danger btn-sm bi bi-trash"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mt-3">
                                <div className="text-center">
                                    {imageCreate4
                                        ? <img className='border img-in-create-post' src={URL.createObjectURL(imageCreate4)} alt="Profile" />
                                        : <img className='border img-in-create-post' src="/img/no-image.jpeg" alt="Profile" />}
                                    <div className="pt-2">
                                        <label className='set-upload-img'>
                                            <input type='file' onChange={e => {
                                                setStatusCreate(statusCreateRef.current.value)
                                                setImageCreate4(e.target.files[0])
                                            }} />
                                            <i className="btn btn-primary btn-sm bi bi-upload"></i>
                                        </label>
                                        <i onClick={() => setImageCreate4()} className="ms-2 btn btn-danger btn-sm bi bi-trash"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-4 d-flex gap-2 flex-wrap'>
                            {defaultHashtags.map(item => (
                                <button
                                    key={item}
                                    onClick={() => handleSelectHashtagCreate(item)}
                                    className={`btn btn-sm ${hashtagsCreate?.includes(item) ? 'btn-primary' : 'btn-outline-primary'}`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-sm btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button onClick={handleCreatePost} data-bs-dismiss="modal" type="submit" className="btn btn-sm btn-primary">Create</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
