import React from 'react'

export default function Overview({ userInfo }) {
    return (
        <>
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
        </>
    )
}
