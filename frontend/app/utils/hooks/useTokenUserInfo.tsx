/*
A custom hook for fetching user data from the locally stored
in-memory token. This information may not be the freshest or
the most reliable, but it is useful to have in some cases when
I don't want to hit the API too many times.
*/

import { useAppSelector } from "@/lib/hooks"
import { jwtDecode } from "jwt-decode"
import { useState, useEffect } from "react"

interface ITokenPayload {
    id: string,
    username: string,
    email: string,
    iat: number,
    exp: number
}

const useTokenUserInfo = () => {
    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
    const token = useAppSelector((state) => state.auth.authData.token)
    const [decodedToken, setDecodedToken] = useState<ITokenPayload | null>(null)

    useEffect(() => {
        if (!isLoggedIn) {
            setDecodedToken(null)
            return
        }

        if (token) {
            try {
                const decoded: ITokenPayload = jwtDecode(token)
                setDecodedToken(decoded)
            } catch (error) {
                console.error(`Failed to decode token: ${error}`)
                setDecodedToken(null)
            }
        }
        else {
            // If there is no token, reset the state.
            setDecodedToken(null)
        }
    }, [token, isLoggedIn]) // Re-run if token or auth status changes

    return decodedToken
}

export default useTokenUserInfo