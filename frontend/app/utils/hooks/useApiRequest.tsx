/*
This custom hook will handle authenticated API requests.
If the access token is expired, fetch a new one and store it.
If the refresh token is expired/invalid, the user must log in again.
This should all happen seamlessly, without any of the user's knowledge.
At most they may notice that at times some requests take longer than others,
but that is not a big deal.
*/


import { useState, useCallback } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { API_ROOT } from "../commonValues"
import { useRouter } from "next/navigation"
import { setToken } from "@/lib/features/auth/authSlice"


export const refreshAccessToken = async () => {
    let newAccessToken = null

    await fetch(`${API_ROOT}/api/v1/user/refresh`, {
        method: "GET",
        credentials: "include",
        cache: "no-store", // Important to prevent loading cached responses in security-critical scenarios.
    }).then(async (response) => {
        if (!response.ok) {
            let errorMessage = "Unknown error refreshing access token."

            switch (response.status) {
                case 401:
                    errorMessage = "Invalid refresh token."
                    break
                case 403:
                    errorMessage = "Expired refresh token."
                    break
                case 500:
                    errorMessage = "Server-side error."
                    break
                default:
                    errorMessage = "Unknown error refreshing access token."
                    break
            }

            throw new Error(errorMessage)
        }

        const respObject = await response.json()
        newAccessToken = respObject.accessToken
    }).catch((error) => {
        console.error(`${error.message}`)
        newAccessToken = null
    })

    return newAccessToken
}

export const invalidateCurrentRefreshToken = async () => {
    await fetch(`${API_ROOT}/api/v1/user/logout`, {
        method: "DELETE",
        credentials: "include"
    }).then(async (response) => {
        if (!response.ok) {
            let errorMessage = "Unknown error invalidating refresh token."

            switch (response.status) {
                case 401:
                    errorMessage = "Invalid refresh token."
                    break
                case 403:
                    errorMessage = "Expired refresh token."
                    break
                case 500:
                    errorMessage = "Server-side error."
                    break
                default:
                    errorMessage = "Unknown error invalidating refresh token."
                    break
            }

            console.error(`Session invalidation failed: ${errorMessage}`)
        }
    }).catch((error) => {
        console.error(`${error.message}`)
    })
}

// Custom hook itself
const useApiRequest = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<null | string>(null)
    const token = useAppSelector(state => state.auth.authData.token)
    const dispatch = useAppDispatch()
    const router = useRouter()

    const redirectToLoginForReauth = async () => {
        await invalidateCurrentRefreshToken()
        dispatch(setToken({ token: null }))
        router.push("/login")
    }

    const apiRequest = useCallback(async (url: string, options: RequestInit) => {
        setLoading(true)
        setError(null)

        // First attempt at API request.
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            })

            if (response.status === 403) {
                const newToken = await refreshAccessToken()

                if (!newToken) {
                    // Refresh token is likely invalid. Clear auth data and redirect to login page.
                    setLoading(false)
                    setError("Failed to fetch new access token.")
                    await redirectToLoginForReauth()
                    throw new Error("Failed to fetch new access token.")
                }

                // Retry the original request with new token.
                const retryResponse = await fetch(url, {
                    ...options,
                    headers: {
                        ...options.headers,
                        Authorization: `Bearer ${newToken}`,
                    },
                    credentials: "include",
                })

                setLoading(false)

                if (retryResponse.status === 403) {
                    setLoading(false)
                    setError(retryResponse.statusText)
                    await redirectToLoginForReauth()
                    throw new Error(`Failed after token refresh retry: ${await retryResponse.text()}`)
                } else if (!retryResponse.ok) {
                    setError(retryResponse.statusText)
                    throw new Error(`Failed after token refresh retry: ${retryResponse.statusText}`)
                }

                dispatch(setToken({ token: newToken }))

                return await retryResponse.json()
            } else if (!response.ok) {
                setError(response.statusText)
                throw new Error(`API request failed: ${response.statusText}`)
            }

            setLoading(false)
            return await response.json()
        } catch (error: any) {
            throw error
        }
    }, [])

    return { apiRequest, loading, error }
}

export default useApiRequest