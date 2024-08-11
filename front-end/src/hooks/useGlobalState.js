import React, { createContext, useReducer, useContext } from 'react'

const defaultGlobalState = {
    fetchAgain: false,
    userConversation: null
}

export const globalStateContext = createContext(defaultGlobalState)
export const dispatchStateContext = createContext(undefined)

export const GlobalStateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(
        (state, newValue) => ({ ...state, ...newValue }),
        defaultGlobalState
    )
    return (
        <globalStateContext.Provider value={state}>
            <dispatchStateContext.Provider value={dispatch}>
                {children}
            </dispatchStateContext.Provider>
        </globalStateContext.Provider>
    )
}

export const useGlobalState = () => [
    useContext(globalStateContext),
    useContext(dispatchStateContext)
]