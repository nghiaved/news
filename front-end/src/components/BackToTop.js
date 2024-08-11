import React, { useEffect, useRef } from 'react'

export default function BackToTop() {
    const backToTopBtn = useRef()

    useEffect(() => {
        if (backToTopBtn && backToTopBtn.current) {
            const toggleBackToTop = () => {
                if (window.scrollY > 100) {
                    backToTopBtn.current.classList.add('active')
                } else {
                    backToTopBtn.current.classList.remove('active')
                }
            }
            window.addEventListener('load', toggleBackToTop)
            document.addEventListener('scroll', toggleBackToTop)
        }
    }, [])

    return (
        <a ref={backToTopBtn} href="#top" className="back-to-top d-flex align-items-center justify-content-center">
            <i className="bi bi-arrow-up-short"></i>
        </a>
    )
}
