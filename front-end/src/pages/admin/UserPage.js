import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { path } from '../../utils'
import { apiUsersDeleteAccountById, apiUsersGetListUsers } from '../../services'
import Pagination from '../../components/Pagination'
import { toast } from 'react-toastify'

export default function UserPage() {
    const [users, setUsers] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [numberOfPages, setNumberOfPages] = useState([])

    const fetchUsers = useCallback(async () => {
        const resp = await apiUsersGetListUsers({ page: pageNumber, limit: 10 })
        setUsers(resp.data.users)
        setNumberOfPages(new Array(resp.data.totalPage).fill(null).map((item, index) => ++index))
    }, [pageNumber])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handleDeleteUser = async id => {
        const res = await apiUsersDeleteAccountById(id)
        toast.success(res.data.message)
        fetchUsers()
    }

    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>User Management</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to={path.HOME}>Home</Link></li>
                        <li className="breadcrumb-item">Pages</li>
                        <li className="breadcrumb-item active">User Management</li>
                    </ol>
                </nav>
            </div>
            <section className="section profile">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Username</th>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Handle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr>
                                <th scope="row">{++index}</th>
                                <td>{user.username}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>
                                    {user.username !== 'admin' && (
                                        <>
                                            <button className='btn btn-sm btn-outline-danger' data-bs-toggle="modal" data-bs-target={`#deleteModal${user.id}`}>Delete</button>
                                            <div className="modal fade" id={`deleteModal${user.id}`} tabIndex="-1" aria-labelledby={`deleteModal${user.id}Label`} aria-hidden="true">
                                                <div className="modal-dialog modal-dialog-centered">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title" id={`deleteModal${user.id}Label`}>Delete user</h5>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div className="modal-body">
                                                            Are you sure you want to delete this user?
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-sm btn-secondary" data-bs-dismiss="modal">Close</button>
                                                            <button onClick={() => handleDeleteUser(user.id)} data-bs-dismiss="modal" type="button" className="btn btn-sm btn-danger">Delete</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination
                    numberOfPages={numberOfPages}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                />
            </section>
        </main>
    )
}
