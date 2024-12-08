import React from 'react'
import { NavLink } from 'react-router-dom'
import { path } from '../../utils'

export default function Admin() {
    return (
        <main id="sidebar" className="sidebar">

            <ul className="sidebar-nav" id="sidebar-nav">

                <li className="nav-heading">Pages</li>

                <li className="nav-item">
                    <NavLink className="nav-link collapsed" to={path.HOME}>
                        <i className="bi bi-house"></i>
                        <span>Home</span>
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink className="nav-link collapsed" to={path.USER_MANAGEMENT}>
                        <i className="bi bi-people"></i>
                        <span>User Management</span>
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink className="nav-link collapsed" to={path.POST_MANAGEMENT}>
                        <i className="bi bi-sticky"></i>
                        <span>Post Management</span>
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink className="nav-link collapsed" to={path.ACCOUNT_SETTINGS}>
                        <i className="bi bi-gear"></i>
                        <span>Account Settings</span>
                    </NavLink>
                </li>

            </ul >

        </main >
    )
}
