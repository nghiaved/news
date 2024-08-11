import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import HeadlessTippy from '@tippyjs/react/headless'
import { useDebounce } from '../hooks'
import { apiUsersList } from '../services'
import { path } from '../utils'

export default function SearchUser({ userId }) {
    const [searchValue, setSearchValue] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [showResult, setShowResult] = useState(false)
    const debouncedValue = useDebounce(searchValue, 500)

    useEffect(() => {
        if (!debouncedValue.trim()) {
            setSearchResult([])
            return
        }

        const fetchApi = async () => {
            try {
                const res = await apiUsersList(debouncedValue)
                setSearchResult(res.data.users)
            } catch (error) {
                setSearchResult([])
            }
        }

        fetchApi()
    }, [debouncedValue])

    const handleChange = e => {
        const searchValue = e.target.value
        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue)
        }
    }

    return (
        <div className="search-bar">
            <HeadlessTippy
                interactive
                visible={showResult && searchResult.length > 0}
                render={() => (
                    <ul className='list-group search-group'>
                        {searchResult?.length > 0 && searchResult.map((item, index) => {
                            if (item.id === userId) return ""
                            return <Link key={index} to={`${path.PROFILE}/${item.username}`}
                                onClick={() => setShowResult(false)}
                                className="list-group-item list-group-item-action">
                                <div className="d-flex align-items-center my-1">
                                    <img src={item.image ? item.image : "/img/no-avatar.png"} alt="Profile" className="rounded-circle img-in-search" />
                                    <div className='ms-3'>
                                        <h6 className="mb-0">@{item.username}</h6>
                                        <p className="mb-0">{item.firstName} {item.lastName}</p>
                                    </div>
                                </div>
                            </Link>
                        })}
                    </ul>
                )}
                onClickOutside={() => setShowResult(false)}
            >
                <form onClick={e => e.preventDefault()} className="search-form d-flex align-items-center" method="POST" action="#">
                    <input value={searchValue} onChange={handleChange} onFocus={() => setShowResult(true)}
                        autoComplete='off' spellCheck={false} type="text" name="query" placeholder="Search" title="Enter search keyword" />
                    <button type="submit" title="Search"><i className="bi bi-search"></i></button>
                </form>
            </HeadlessTippy>
        </div>
    )
}
