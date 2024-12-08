import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { path, socket } from '../../utils'

export default function Header() {
    const token = JSON.parse(window.localStorage.getItem('token'))
    const userInfo = token ? jwtDecode(token) : {}
    const navigate = useNavigate()

    const handleToggleSidebar = () => {
        document.querySelector('body').classList.toggle('toggle-sidebar')
    }

    const handleToggleSearchBar = () => {
        document.querySelector('.search-bar').classList.toggle('search-bar-show')
    }

    const handleLogout = () => {
        socket.disconnect()
        window.localStorage.removeItem('token')
        navigate(0)
    }

    return (
        <header id="header" className="header fixed-top d-flex align-items-center">
            <div className="d-flex align-items-center justify-content-between">
                <Link to={path.HOME} className="logo d-flex align-items-center">
                    <img src="/img/logo.png" alt="" />
                    <span className="d-none d-lg-block">News</span>
                </Link>
                <i onClick={handleToggleSidebar} className="bi bi-list toggle-sidebar-btn"></i>
            </div>
            <nav className="header-nav ms-auto">
                <ul className="d-flex align-items-center">
                    <li className="nav-item d-block d-md-none">
                        <Link onClick={handleToggleSearchBar} className="nav-link nav-icon search-bar-toggle" to="#search">
                            <i className="bi bi-search"></i>
                        </Link>
                    </li>
                    <li className="nav-item dropdown pe-3">
                        <Link className="nav-link nav-profile d-flex align-items-center pe-0" to="/" data-bs-toggle="dropdown">
                            <img src={userInfo.image ? userInfo.image : "/img/no-avatar.png"} alt="Profile" className="rounded-circle" />
                            <span className="d-none d-md-block dropdown-toggle ps-2">{userInfo.firstName}</span>
                        </Link>
                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                            <li className="dropdown-header">
                                <h6>{userInfo.firstName + ' ' + userInfo.lastName}</h6>
                                <span>@{userInfo.username}</span>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <Link className="dropdown-item d-flex align-items-center" to={path.USER_MANAGEMENT}>
                                    <i className="bi bi-people"></i>
                                    <span>User Management</span>
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <Link className="dropdown-item d-flex align-items-center" to={path.POST_MANAGEMENT}>
                                    <i className="bi bi-sticky"></i>
                                    <span>Post Management</span>
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <Link className="dropdown-item d-flex align-items-center" to={path.ACCOUNT_SETTINGS}>
                                    <i className="bi bi-gear"></i>
                                    <span>Account Settings</span>
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li onClick={handleLogout}>
                                <Link className="dropdown-item d-flex align-items-center" to="#">
                                    <i className="bi bi-box-arrow-right"></i>
                                    <span>Sign Out</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </header>
    )
}
