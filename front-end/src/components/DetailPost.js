import React from 'react'
import ReactQuill from 'react-quill'

export default function DetailPost({ data }) {
    return (
        <div className="modal fade view-modal" id="viewModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Detail</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body d-flex flex-wrap justify-content-center">
                        {data.image && <img style={{ maxHeight: '200px', width: 'auto', objectFit: 'cover' }} src={data.image} className="card-img border" alt="..." />}
                        <div className='flex-fill'>
                            <ReactQuill value={data.status} theme="bubble" readOnly={true} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
