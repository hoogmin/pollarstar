"use client"

import { configureStore } from "@reduxjs/toolkit"
import authReducer from "@/lib/features/auth/authSlice"

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authReducer
        },
        devTools: process.env.NODE_ENV !== "production"
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]