import React from 'react'
import ReactQuill from 'react-quill'

export default function DetailPost({ data, modalId }) {
    return (
        <div className="modal fade view-modal" id={modalId} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Detail</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className='d-flex flex-wrap'>
                            {data.image && <div style={{ flex: '50%', maxWidth: '50%', padding: 10 }}>
                                <img
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    src={data.image}
                                    className="card-img border"
                                    alt="..."
                                />
                            </div>}
                            {data.image2 && <div style={{ flex: '50%', maxWidth: '50%', padding: 10 }}>
                                <img
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    src={data.image2}
                                    className="card-img border"
                                    alt="..."
                                />
                            </div>}
                            {data.image3 && <div style={{ flex: '50%', maxWidth: '50%', padding: 10 }}>
                                <img
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    src={data.image3}
                                    className="card-img border"
                                    alt="..."
                                />
                            </div>}
                            {data.image4 && <div style={{ flex: '50%', maxWidth: '50%', padding: 10 }}>
                                <img
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    src={data.image4}
                                    className="card-img border"
                                    alt="..."
                                />
                            </div>}
                            {data.video && <div style={{ padding: 10 }}>
                                <video controls autoPlay
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                                    <source src={data.video} />
                                    Your browser does not support the video tag.
                                </video>
                            </div>}
                        </div>
                        <div className='flex-fill'>
                            <ReactQuill value={data.status} theme="bubble" readOnly={true} />
                        </div>
                        <div className='mt-4 d-flex flex-wrap'>
                            {data.hashtags?.split(',').map(item => (
                                <div key={item} className='btn btn-sm text-secondary'>{item}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
