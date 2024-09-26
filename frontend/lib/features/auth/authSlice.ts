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
            state.authData = action.payload

            // Set isLoggedIn to true if token is valid, otherwise false
            state.isLoggedIn = !!action.payload.token
        }
    }
})

export const { setToken } = authSlice.actions

export default authSlice.reducer