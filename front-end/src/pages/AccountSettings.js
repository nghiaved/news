import React from 'react'
import { jwtDecode } from 'jwt-decode'
import { Link } from 'react-router-dom'
import { path } from '../utils'
import UpdateInfo from '../components/UpdateInfo'
import ChangePassword from '../components/ChangePassword'
import DeleteAccount from '../components/DeleteAccount'
import Overview from '../components/Overview'

export default function AccountSettings() {
    const token = JSON.parse(window.localStorage.getItem('token'))
    const userInfo = jwtDecode(token)

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
                                    <Link to={`${path.PROFILE}/${userInfo.username}`} className="btn btn-sm btn-outline-info">View profile</Link>
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
                                        <Overview userInfo={userInfo} />
                                    </div>
                                    <div className="tab-pane fade profile-edit pt-3" id="profile-edit">
                                        <UpdateInfo userInfo={userInfo} />
                                    </div>
                                    <div className="tab-pane fade pt-3" id="profile-change-password">
                                        <ChangePassword userInfo={userInfo} />
                                    </div>
                                    <div className="tab-pane fade pt-3" id="profile-delete-account">
                                        <DeleteAccount userInfo={userInfo} />
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
