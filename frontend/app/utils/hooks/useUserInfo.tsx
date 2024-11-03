/*
Custom hook for fetching user information from
the API. This ensures reusability and less code duplication
for components that need user info. It acts as a wrapper for
the regular authenticated API request hook `useApiRequest`. 
I'm not storing userInfo in state as I always want the 
freshest data for this app.
*/

import { useState, useEffect } from "react"
import useApiRequest from "./useApiRequest"
import { API_ROOT } from "../commonValues"

interface IUserInfo {
    id: string | null,
    username: string | null,
    email: string | null,
    profilePic: string | null
}

const useUserInfo = (shouldFetch: boolean) => {
    const [userInfo, setUserInfo] = useState<IUserInfo>({
        id: null,
        username: null,
        email: null,
        profilePic: null
    })
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const { apiRequest } = useApiRequest()

    const getUserData = async () => {
        setLoading(true)

        try {
            const data = await apiRequest(`${API_ROOT}/api/v1/user/me`, { method: "GET" })
            setUserInfo(data)
            setLoading(false)
            return data
        } catch (error) {
            console.error(`Error fetching data: ${error}`)
            setError("Failed to fetch user data.")
            setLoading(false)
            return null
        }
    }

    useEffect(() => {
        // Useful for only getting data if user is logged in.
        if (shouldFetch) {
            getUserData()
        }
    }, [shouldFetch])

    return {
        userInfo,
        loading,
        error,
        refetch: getUserData // Manually trigger an update on userInfo.
    }
}

export default useUserInfo