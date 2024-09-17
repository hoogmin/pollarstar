import { createSlice } from "@reduxjs/toolkit"

interface AuthDataLayout {
    token: null | string
}

const initialData: AuthDataLayout = {
    token: null
}

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        authData: initialData,
        isLoggedIn: false
    },
    reducers: {
        setToken: (state, action: { type: string, payload: AuthDataLayout }) => {
            state.authData = action.payload
            state.isLoggedIn = true
        }
    }
})

export const { setToken } = authSlice.actions

export default authSlice.reducer