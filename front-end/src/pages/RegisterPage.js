import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { path } from '../utils'
import { apiUsersRegister } from '../services'
import { useLoading } from '../hooks'
import Loading from '../components/Loading'
import { toast } from 'react-toastify'

export default function RegisterPage() {
    const { register, handleSubmit } = useForm()
    const { isLoading, setIsLoading } = useLoading()

    const onSubmit = async (data) => {
        try {
            setIsLoading(true)
            const res = await apiUsersRegister(data)
            if (res.status === 200) {
                toast.success(res.data.message)
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
                                            <h5 className="card-title text-center pb-0 fs-4">Create an Account</h5>
                                            <p className="text-center small">Enter your personal details to create account</p>
                                        </div>
                                        <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
                                            <div className="col-12">
                                                <label htmlFor="firstName" className="form-label">First Name</label>
                                                <input {...register('firstName')} required maxLength={30} autoComplete='off'
                                                    type="text" className="form-control" id="firstName" />
                                                <div className="invalid-feedback">Please, enter your name!</div>
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                                <input {...register('lastName')} required maxLength={30} autoComplete='off'
                                                    type="text" className="form-control" id="lastName" />
                                                <div className="invalid-feedback">Please enter a valid Email adddress!</div>
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="yourUsername" className="form-label">Username</label>
                                                <div className="input-group">
                                                    <span className="input-group-text" id="inputGroupPrepend">@</span>
                                                    <input {...register('username')} required maxLength={30} minLength={6} autoComplete='off'
                                                        type="text" className="form-control" id="yourUsername" />
                                                    <div className="invalid-feedback">Please choose a username.</div>
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
                                                    <input className="form-check-input" name="" type="checkbox" value="" id="acceptTerms" required />
                                                    <label className="form-check-label" htmlFor="acceptTerms">I agree and accept the <Link to="#">terms and conditions</Link></label>
                                                    <div className="invalid-feedback">You must agree before submitting.</div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <button className="btn btn-primary w-100" type="submit">Create Account</button>
                                            </div>
                                            <div className="col-12">
                                                <p className="small mb-0">Already have an account? <Link to={path.LOGIN}>Log in</Link></p>
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
