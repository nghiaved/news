import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { apiUsersChangePassword } from '../services'

export default function ChangePassword({ userInfo }) {
    const { register: registerChangePassword, handleSubmit: handleSubmitChangePassword } = useForm()

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

    return (
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
                <button type="submit" className="btn btn-sm btn-primary">Change Password</button>
            </div>
        </form>
    )
}
