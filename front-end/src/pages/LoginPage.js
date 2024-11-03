import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useLoading } from '../hooks'
import Loading from '../components/Loading'
import { path } from '../utils'
import { apiUsersLogin } from '../services'

export default function LoginPage() {
    const { register, handleSubmit } = useForm()
    const navigate = useNavigate()
    const { isLoading, setIsLoading } = useLoading()

    const onSubmit = async (data) => {
        try {
            setIsLoading(true)
            const res = await apiUsersLogin(data)
            if (res.status === 200) {
                window.localStorage.setItem('token', JSON.stringify(res.data.token))
                if (window.location.pathname === path.LOGIN) {
                    navigate(path.HOME)
                } else {
                    navigate(0)
                }
            }
        } catch (e) {
            toast.error(e.data.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main>
            {isLoading && <Loading />}
            <div className="container">
                <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-4 col-lg-6 col-md-8 d-flex flex-column align-items-center justify-content-center">
                                <div className="d-flex justify-content-center py-4">
                                    <Link to={path.HOME} className="logo d-flex align-items-center w-auto">
                                        <img src="/img/logo.png" alt="" />
                                        <span className="d-none d-lg-block">News</span>
                                    </Link>
                                </div>
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <div className="pt-4 pb-2">
                                            <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                                            <p className="text-center small">Enter your username & password to login</p>
                                        </div>
                                        <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
                                            <div className="col-12">
                                                <label htmlFor="yourUsername" className="form-label">Username</label>
                                                <div className="input-group">
                                                    <input {...register('username')} required maxLength={30} minLength={6} autoComplete='off'
                                                        type="text" className="form-control" id="yourUsername" />
                                                    <div className="invalid-feedback">Please enter your username.</div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="yourPassword" className="form-label">Password</label>
                                                <input {...register('password')} required maxLength={30} minLength={6} autoComplete='off'
                                                    type="password" className="form-control" id="yourPassword" />
                                                <div className="invalid-feedback">Please enter your password!</div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" name="" value="" id="rememberMe" />
                                                    <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <button className="btn btn-primary w-100" type="submit">Login</button>
                                            </div>
                                            <div className="col-12">
                                                <p className="small mb-0">Don't have account? <Link to={path.REGISTER}>Create an account</Link></p>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}
