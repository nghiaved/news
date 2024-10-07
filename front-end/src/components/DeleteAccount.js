import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { apiUsersDeleteAccount } from '../services'

export default function DeleteAccount({ userInfo }) {
    const { register: registerDeleteAccount, handleSubmit: handleSubmitDeleteAccount } = useForm()
    const navigate = useNavigate()

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
                <button type="submit" className="btn btn-sm btn-danger">Delete Account</button>
            </div>
        </form>
    )
}
