"use client"

import { createSlice } from "@reduxjs/toolkit"

interface IAuthData {
    token: null | string
}

const initialData: IAuthData = {
    token: null
}

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        authData: initialData,
        isLoggedIn: false
    },
    reducers: {
        setToken: (state, action: { type: string, payload: IAuthData }) => {
            const isTokenValid = action.payload.token !== null && action.payload.token !== undefined && action.payload.token !== ""

            // Only update `isLoggedIn` if the validity of the token has changed
            if (isTokenValid !== state.isLoggedIn) {
                state.isLoggedIn = isTokenValid
            }

            state.authData = action.payload
        }
    }
})

export const { setToken } = authSlice.actions

export default authSlice.reducer