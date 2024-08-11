import React, { createContext, useContext, useState } from 'react'

const LoadingContext = createContext({
    isLoading: false,
    setIsLoading: () => { },
})

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false)

    const value = { isLoading, setIsLoading }

    return (
        <LoadingContext.Provider value={value}>
            {children}
        </LoadingContext.Provider>
    )
}

export const useLoading = () => useContext(LoadingContext)
