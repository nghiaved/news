import React from 'react'
import { Link } from 'react-router-dom'
import { path } from '../utils'

export default function SavedPosts() {
    return (
        <main id='main'>
            <div className="pagetitle">
                <h1>Saved Posts</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to={path.HOME}>Home</Link></li>
                        <li className="breadcrumb-item">Pages</li>
                        <li className="breadcrumb-item active">Saved Posts</li>
                    </ol>
                </nav>
            </div>
            <section className="section">
                <div className='d-flex justify-content-center mt-5'>
                    <div className='p-4 text-center' style={{ border: '1px dashed grey', borderRadius: 10, width: 'fit-content' }}>
                        <h5 className='mb-3'>No posts saved yet</h5>
                        <Link to={path.HOME}>
                            <button className='btn btn-sm btn-warning'>Explore</button>
                        </Link>
                    </div>
                </div>
            </section>
        </main >
    )
}
