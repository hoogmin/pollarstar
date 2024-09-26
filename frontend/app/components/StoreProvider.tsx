"use client"

import { ReactNode, useRef, useEffect, useState } from "react"
import { Provider } from "react-redux"
import { makeStore, AppStore } from "@/lib/store"
import { setToken } from "@/lib/features/auth/authSlice"
import Loading from "./Loading"

interface StoreProviderProps {
    children: ReactNode
}

const sessionStateKey = "reduxState"

// Function to load persisted state from sessionStorage
const loadState = () => {
    try {
        const serializedState = sessionStorage.getItem(sessionStateKey)

        if (!serializedState) {
            return undefined // No saved data
        }

        return JSON.parse(serializedState)
    } catch (error) {
        console.error("Could not load state", error)
        return undefined
    }
}

// Function to save the redux state to sessionStorage
const saveState = (state: any) => {
    try {
        const { token, isLoggedIn } = state.auth.authData
        const serializedState = JSON.stringify({ auth: { authData: { token, isLoggedIn } } })
        sessionStorage.setItem(sessionStateKey, serializedState)
    } catch (error) {
        console.error("Could not save state", error)
    }
}

export default function StoreProvider({ children }: StoreProviderProps) {
    const storeRef = useRef<AppStore>()
    const [loading, setLoading] = useState<boolean>(true)

    if (!storeRef.current) {
        // Create the store instance for the first time this renders
        storeRef.current = makeStore()
    }

    useEffect(() => {
        // When on the client, load any existing state if there is any.
        // Regardless, we create an event listener to save state to session upon any change.
        const preloadedState = loadState()

        if (preloadedState?.auth?.authData) {
            storeRef.current?.dispatch(setToken(preloadedState.auth.authData))
            console.log("Preloaded stored state.")
        }

        setLoading(false)
        
        storeRef.current?.subscribe(() => {
            const currentState = storeRef.current?.getState()

            saveState({
                auth: {
                    authData: {
                        token: currentState?.auth.authData.token,
                    },
                    isLoggedIn: currentState?.auth.isLoggedIn,
                },
            })
        })
    }, [])

    if (loading) {
        return <Loading/>
    }

    return (
        <Provider store={storeRef.current}>
            {children}
        </Provider>
    )
}