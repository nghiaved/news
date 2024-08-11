import React from 'react'
import { Link } from 'react-router-dom'

export default function Pagination({ numberOfPages, pageNumber, setPageNumber }) {
    return (
        numberOfPages.length > 0 && (
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                    <li className={pageNumber === 1 ? "page-item disabled" : "page-item"}>
                        <Link onClick={() => setPageNumber(pageNumber - 1)} className="page-link" to="#" tabIndex="-1" aria-disabled="true">Previous</Link>
                    </li>
                    {numberOfPages.map((item) => {
                        return <li key={item} onClick={() => setPageNumber(item)} className="page-item">
                            <Link className={pageNumber === item ? "page-link active" : "page-link"} to="#">{item}</Link>
                        </li>
                    })}
                    <li className={pageNumber === numberOfPages.length ? "page-item disabled" : "page-item"}>
                        <Link onClick={() => setPageNumber(pageNumber + 1)} className="page-link" to="#">Next</Link>
                    </li>
                </ul>
            </nav>
        )
    )
}
