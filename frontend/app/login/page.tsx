"use client"

import {
    Box,
    TextField,
    Button,
    Typography
} from "@mui/material"
import Link from "next/link"
import { API_ROOT } from "../utils/commonValues"
import { useRef, useState } from "react"
import { validateEmail, validatePassword } from "../utils/validators"
import { useAppDispatch } from "@/lib/hooks"
import { setToken } from "@/lib/features/auth/authSlice"
import { useRouter } from "next/navigation"

const Login = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const emailFieldRef = useRef<HTMLInputElement>(null)
    const passwordFieldRef = useRef<HTMLInputElement>(null)
    const [notifierTextColor, setNotifierTextColor] = useState<string>("red")
    const [notifierTextDisplay, setNotifierTextDisplay] = useState<string>("none")
    const [notifierText, setNotifierText] = useState<string>("Notifier Text")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        // Validate input values before doing anything else.
        const email = emailFieldRef.current?.value
        const password = passwordFieldRef.current?.value

        if (!validateEmail(email)) {
            console.log("Invalid email.")
            setNotifierText("Email must be of the format example@example.com")
            setNotifierTextColor("red")
            setNotifierTextDisplay("block")
            return
        }

        if (!validatePassword(password)) {
            console.log("Invalid password.")
            setNotifierText("Password must be a minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.")
            setNotifierTextColor("red")
            setNotifierTextDisplay("block")
            return
        }

        // All validated, log the user in via fetch. The access token for our API
        // should be store in-memory using Redux state. The longer-living
        // refresh token is stored in an HTTP only secure cookie to keep it
        // away from malicious code that may be executing.

        // Names are important here. The API expects the body's fields to have particular keys.
        const userLoginInfo = {
            usernameOrEmail: email,
            password: password
        }

        await fetch(`${API_ROOT}/api/v1/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userLoginInfo),
            credentials: "include"
        })
        .then(async (response) => {
            if (!response.ok) {
                let errorMessage = "Unknown error"

                switch (response.status) {
                    case 401:
                        errorMessage = "Invalid email or password."
                        break
                    case 500:
                        errorMessage = "Internal error, please try again later."
                        break
                    default:
                        errorMessage = "Unknown error"
                        break
                }

                throw new Error(errorMessage)
            }

            // Store token in-memory (Redux store).
            const respObject = await response.json().catch((error) => {
                console.error(`Failed to parse response body: ${error}`)
                throw new Error("Failed to login.")
            })

            dispatch(setToken({ token: respObject.accessToken }))

            // Redirect to home page as user is now logged in (cookie and token present).
            router.push("/")
        })
        .catch((error) => {
            setNotifierText(`${error.message}`)
            setNotifierTextColor("red")
            setNotifierTextDisplay("block")
        })
    }

    return (
        <div>
            <Typography variant="h2" className="p-5 text-center font-bold">
                Login
            </Typography>
            <form onSubmit={handleSubmit} autoComplete="off" className="max-w-lg mx-auto w-full">
                <Box
                    display="flex"
                    flexDirection="column"
                    gap="20px"
                    padding="20px"
                    maxWidth="600px"
                    borderRadius={1}
                    sx={{
                        backgroundColor: "transparent"
                    }}>
                    <Typography variant="body2" color={notifierTextColor} display={notifierTextDisplay}>
                        {notifierText}
                    </Typography>
                    <TextField
                        inputRef={emailFieldRef}
                        variant="outlined"
                        label="Email"
                        name="email"
                        placeholder="john@contoso.com"
                        error={false}
                        type="email"
                        InputLabelProps={{
                            style: { color: "white" },
                        }}
                        InputProps={{
                            style: { color: "white" },
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'white', // Default outline color
                                },
                                '&:hover fieldset': {
                                    borderColor: 'aqua', // Outline color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'blue', // Outline color when focused
                                },
                            },
                            input: {
                                color: 'white', // Input text color
                            },
                        }} />
                    <TextField
                        inputRef={passwordFieldRef}
                        label="Password"
                        name="password"
                        error={false}
                        type="password"
                        InputLabelProps={{
                            style: { color: "white" },
                        }}
                        InputProps={{
                            style: { color: "white" },
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'white', // Default outline color
                                },
                                '&:hover fieldset': {
                                    borderColor: 'aqua', // Outline color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'blue', // Outline color when focused
                                },
                            },
                            input: {
                                color: 'white', // Input text color
                            },
                        }} />
                    <div>
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            color="primary"

                        >
                            Login
                        </Button>
                        <Typography className="py-5">
                            Don't have an account? Register <Link className="text-blue-500 underline" href="/register">here.</Link>
                        </Typography>
                    </div>
                </Box>
            </form>
        </div>
    )
}

export default Login