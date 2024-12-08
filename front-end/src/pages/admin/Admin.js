import React from 'react'
import { Outlet } from 'react-router-dom'
import BackToTop from '../../components/BackToTop'
import Loading from '../../components/Loading'
import Header from '../../components/admin/Header'
import Sidebar from '../../components/admin/Sidebar'
import { useLoading } from '../../hooks'

export default function Admin() {
    const { isLoading } = useLoading()

    return (
        <React.Fragment>
            <Header />
            <Sidebar />
            <Outlet />
            <BackToTop />
            {isLoading && <Loading />}
        </React.Fragment>
    )
}
