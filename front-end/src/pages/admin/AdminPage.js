import React from 'react'
import { Link } from 'react-router-dom'
import { path } from '../../utils'

export default function AdminPage() {
    return (
        <main id="main" className="main">
            <div className='d-flex gap-3'>
                <div className="card" style={{ maxWidth: 500 }}>
                    <div className="card-body">
                        <h5 className="card-title">User Management</h5>
                        <div>
                            <b>List</b>: Display a complete list of all users in the system.
                        </div>
                        <p>
                            <b>Delete</b>: Remove a specific user from the system by their unique identifier.
                        </p>
                        <Link className='btn btn-sm btn-outline-primary' to={path.USER_MANAGEMENT}>Manage</Link>
                    </div>
                </div>
                <div className="card" style={{ maxWidth: 500 }}>
                    <div className="card-body">
                        <h5 className="card-title">Post Management</h5>
                        <div>
                            <b>List</b>: Display all posts, optionally filtered by their approval status.
                        </div>
                        <div>
                            <b>Approve</b>: Enable an administrator or moderator to review and approve posts for publication.
                        </div>
                        <p>
                            <b>Delete</b>: Remove a specific post from the system permanently.
                        </p>
                        <Link className='btn btn-sm btn-outline-primary' to={path.POST_MANAGEMENT}>Manage</Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
