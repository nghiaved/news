import React, { useState } from 'react'
import FileBase64 from 'react-file-base64'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { apiUsersUpdateInfo } from '../services'

export default function UpdateInfo({ userInfo }) {
    const [image, setImage] = useState()
    const { register: registerUpdateInfo, handleSubmit: handleSubmitUpdateInfo } = useForm()
    const navigate = useNavigate()

    const handleUpdateInfo = async (data) => {
        try {
            image ? data.image = image : data.image = userInfo.image
            const res = await apiUsersUpdateInfo({ ...data, id: userInfo.id })
            if (res.status === 200) {
                toast.success(res.data.message)
                window.localStorage.setItem('token', JSON.stringify(res.data.token))
                setTimeout(function () {
                    navigate(window.location.pathname)
                }, 3000)
            }
        } catch (e) {
            toast.error(e.data.message)
        }
    }

    return (
        <form onSubmit={handleSubmitUpdateInfo(handleUpdateInfo)}>
            <div className="row mb-3">
                <label htmlFor="profileImage" className="col-md-4 col-lg-3 col-form-label">Profile Image</label>
                <div className="col-md-8 col-lg-9">
                    {image
                        ? <img className='border' src={image} alt="Profile" />
                        : <img className='border' src={userInfo.image ? userInfo.image : "/img/no-avatar.png"} alt="Profile" />}
                    <div className="pt-2">
                        <label className='set-upload-img'>
                            <FileBase64
                                multiple={false}
                                onDone={({ base64 }) => {
                                    setImage(base64)
                                }}
                            />
                            <i className="btn btn-primary btn-sm bi bi-upload"></i>
                        </label>
                        <i onClick={() => setImage()} className="mx-2 btn btn-danger btn-sm bi bi-trash"></i>
                    </div>
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="firstName" className="col-md-4 col-lg-3 col-form-label">First Name</label>
                <div className="col-md-8 col-lg-9">
                    <input {...registerUpdateInfo('firstName')} required maxLength={30} autoComplete='off'
                        type="text" className="form-control" id="firstName" defaultValue={userInfo.firstName} />
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="lastName" className="col-md-4 col-lg-3 col-form-label">Last Name</label>
                <div className="col-md-8 col-lg-9">
                    <input {...registerUpdateInfo('lastName')} required maxLength={30} autoComplete='off'
                        type="text" className="form-control" id="lastName" defaultValue={userInfo.lastName} />
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="about" className="col-md-4 col-lg-3 col-form-label">About</label>
                <div className="col-md-8 col-lg-9">
                    <textarea  {...registerUpdateInfo('about')} maxLength={255} autoComplete='off'
                        className="form-control" id="about" style={{ height: '100px' }} defaultValue={userInfo.about && userInfo.about}></textarea>
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="Address" className="col-md-4 col-lg-3 col-form-label">Address</label>
                <div className="col-md-8 col-lg-9">
                    <input {...registerUpdateInfo('address')} maxLength={100} autoComplete='off'
                        type="text" className="form-control" id="Address" defaultValue={userInfo.address && userInfo.address} />
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="Phone" className="col-md-4 col-lg-3 col-form-label">Phone</label>
                <div className="col-md-8 col-lg-9">
                    <input {...registerUpdateInfo('phone')} maxLength={20} autoComplete='off'
                        type="text" className="form-control" id="Phone" defaultValue={userInfo.phone && userInfo.phone} />
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="Email" className="col-md-4 col-lg-3 col-form-label">Email</label>
                <div className="col-md-8 col-lg-9">
                    <input {...registerUpdateInfo('email')} maxLength={50} autoComplete='off'
                        type="email" className="form-control" id="Email" defaultValue={userInfo.email && userInfo.email} />
                </div>
            </div>
            <div className="text-center">
                <button type="submit" className="btn btn-sm btn-primary">Save Changes</button>
            </div>
        </form>
    )
}
