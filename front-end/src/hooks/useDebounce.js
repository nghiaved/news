import { useState, useEffect } from 'react'

export default function useDebounce(value, delay) {
    const [debounceValue, setDebounceValue] = useState(value)

    useEffect(() => {
        const handle = setTimeout(() => setDebounceValue(value), delay)

        return () => clearTimeout(handle)
    }, [value, delay])

    return debounceValue
}
