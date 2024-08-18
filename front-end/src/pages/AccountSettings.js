import React, { useState } from 'react'
import FileBase64 from 'react-file-base64'
import { jwtDecode } from 'jwt-decode'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { path } from '../utils'
import { apiUsersDeleteAccount, apiUsersChangePassword, apiUsersUpdateInfo } from '../services'

export default function AccountSettings() {
    const [image, setImage] = useState()
    const { register: registerUpdateInfo, handleSubmit: handleSubmitUpdateInfo } = useForm()
    const { register: registerChangePassword, handleSubmit: handleSubmitChangePassword } = useForm()
    const { register: registerDeleteAccount, handleSubmit: handleSubmitDeleteAccount } = useForm()
    const token = JSON.parse(window.localStorage.getItem('token'))
    const userInfo = jwtDecode(token)
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

    const handleChangePassword = async (data) => {
        try {
            const res = await apiUsersChangePassword({ ...data, id: userInfo.id })
            if (res.status === 200) {
                toast.success(res.data.message)
            }
        } catch (e) {
            toast.error(e.data.message)
        }
    }

    const handleDeleteAccount = async (data) => {
        try {
            const res = await apiUsersDeleteAccount({ ...data, id: userInfo.id })
            if (res.status === 200) {
                window.localStorage.removeItem('token')
                navigate(0)
            }
        } catch (e) {
            toast.error(e.data.message)
        }
    }

    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>Account Settings</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to={path.HOME}>Home</Link></li>
                        <li className="breadcrumb-item">Pages</li>
                        <li className="breadcrumb-item active">Account Settings</li>
                    </ol>
                </nav>
            </div>
            <section className="section profile">
                <div className="row">
                    <div className="col-xl-4 col-lg-4">
                        <div className="card">
                            <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
                                <img src={userInfo.image ? userInfo.image : "/img/no-avatar.png"} alt="Profile" className="rounded-circle" />
                                <h2>{userInfo.firstName + ' ' + userInfo.lastName}</h2>
                                <h3>@{userInfo.username}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-8 col-lg-8">
                        <div className="card">
                            <div className="card-body pt-3">
                                <div className="d-flex justify-content-end pt-4">
                                    <Link to={`${path.PROFILE}/${userInfo.username}`} className="btn btn-outline-info">View profile</Link>
                                </div>
                                <ul className="nav nav-tabs nav-tabs-bordered">
                                    <li className="nav-item">
                                        <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">Overview</button>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-edit">Edit Profile</button>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-change-password">Change Password</button>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-delete-account">Delete Account</button>
                                    </li>
                                </ul>
                                <div className="tab-content pt-2">
                                    <div className="tab-pane fade show active profile-overview" id="profile-overview">
                                        <h5 className="card-title">About</h5>
                                        <p className="small fst-italic">
                                            {userInfo.about ? userInfo.about : 'No bio yet.'}
                                        </p>
                                        <h5 className="card-title">Profile Details</h5>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 label ">Full Name</div>
                                            <div className="col-lg-9 col-md-8">{userInfo.firstName + ' ' + userInfo.lastName}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Username</div>
                                            <div className="col-lg-9 col-md-8">{userInfo.username}</div>
                                        </div>
                                        {userInfo.email && <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Email</div>
                                            <div className="col-lg-9 col-md-8">{userInfo.email}</div>
                                        </div>}
                                        {userInfo.address && <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Address</div>
                                            <div className="col-lg-9 col-md-8">{userInfo.address}</div>
                                        </div>}
                                        {userInfo.phone && <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Phone</div>
                                            <div className="col-lg-9 col-md-8">{userInfo.phone}</div>
                                        </div>}
                                    </div>
                                    <div className="tab-pane fade profile-edit pt-3" id="profile-edit">
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
                                                <button type="submit" className="btn btn-primary">Save Changes</button>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="tab-pane fade pt-3" id="profile-change-password">
                                        <form onSubmit={handleSubmitChangePassword(handleChangePassword)}>
                                            <div className="row mb-3">
                                                <label htmlFor="currentPassword" className="col-md-4 col-lg-3 col-form-label">Current Password</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input {...registerChangePassword('oldPassword')} required maxLength={30} minLength={6} autoComplete='off'
                                                        type="password" className="form-control" id="currentPassword" />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label htmlFor="newPassword" className="col-md-4 col-lg-3 col-form-label">New Password</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input {...registerChangePassword('newPassword')} required maxLength={30} minLength={6} autoComplete='off'
                                                        type="password" className="form-control" id="newPassword" />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label htmlFor="renewPassword" className="col-md-4 col-lg-3 col-form-label">Re-enter New Password</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input {...registerChangePassword('renewPassword')} required maxLength={30} minLength={6} autoComplete='off'
                                                        type="password" className="form-control" id="renewPassword" />
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <button type="submit" className="btn btn-primary">Change Password</button>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="tab-pane fade pt-3" id="profile-delete-account">
                                        <form onSubmit={handleSubmitDeleteAccount(handleDeleteAccount)}>
                                            <div className="row mb-3">
                                                <label htmlFor="deleteUsername" className="col-md-4 col-lg-3 col-form-label">Username</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input {...registerDeleteAccount('username')} required maxLength={30} minLength={6} autoComplete='off'
                                                        type="text" className="form-control" id="deleteUsername" />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label htmlFor="deletePassword" className="col-md-4 col-lg-3 col-form-label">Password</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input {...registerDeleteAccount('password')} required maxLength={30} minLength={6} autoComplete='off'
                                                        type="password" className="form-control" id="deletePassword" />
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <button type="submit" className="btn btn-danger">Delete Account</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
