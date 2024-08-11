import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { GlobalStateProvider, LoadingProvider } from './hooks'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'boxicons/css/boxicons.min.css'
import 'remixicon/fonts/remixicon.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'
import './scss/index.scss'
import App from './App'
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <GlobalStateProvider>
            <BrowserRouter>
                <LoadingProvider>
                    <App />
                </LoadingProvider>
                <ToastContainer />
            </BrowserRouter>
        </GlobalStateProvider>
    </React.StrictMode>
)