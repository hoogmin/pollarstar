"use client"

import {
    Box,
    TextField,
    Button,
    Typography
} from "@mui/material"
import Link from "next/link"
import { API_ROOT } from "../utils/commonValues"
import { validateUsername, validateEmail, validatePassword } from "../utils/validators"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/lib/hooks"
import { setToken } from "@/lib/features/auth/authSlice"

const Register = () => {
    const emailFieldRef = useRef<HTMLInputElement>(null)
    const usernameFieldRef = useRef<HTMLInputElement>(null)
    const passwordFieldRef = useRef<HTMLInputElement>(null)
    const confirmPasswordFieldRef = useRef<HTMLInputElement>(null)
    const [notifierTextColor, setNotifierTextColor] = useState<string>("red")
    const [notifierTextDisplay, setNotifierTextDisplay] = useState<string>("none")
    const [notifierText, setNotifierText] = useState<string>("Notifier Text")
    const router = useRouter()
    const dispatch = useAppDispatch()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        // Validate all form fields based on our app requirements for each field.
        const email = emailFieldRef.current?.value
        const username = usernameFieldRef.current?.value
        const password = passwordFieldRef.current?.value
        const confirmPassword = confirmPasswordFieldRef.current?.value

        if (!validateEmail(email)) {
            setNotifierText("Email must be of the format example@example.com")
            setNotifierTextColor("red")
            setNotifierTextDisplay("block")
            return
        }

        if (!validateUsername(username)) {
            console.log(`USERNAME ERROR: ${username}`)
            setNotifierText("Username: only alphanumeric characters (A-Z, a-z, 0-9), with a max length of 15-20 characters.")
            setNotifierTextColor("red")
            setNotifierTextDisplay("block")
            return
        }

        if (!validatePassword(password)) {
            console.log(`PASSWORD ERROR: ${password}`)
            setNotifierText("Password must be a minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.")
            setNotifierTextColor("red")
            setNotifierTextDisplay("block")
            return
        }

        if (confirmPassword !== password) {
            console.log(`PASSWORDS DO NOT MATCH.`)
            setNotifierText("Passwords do not match.")
            setNotifierTextColor("red")
            setNotifierTextDisplay("block")
            return
        }

        // All validated, now we can register our user via fetch.

        // Names are important here. The API expects the body's fields to have particular keys.
        const newUserInfo = {
            username: username,
            email: email,
            password: password
        }

        let registered = false

        await fetch(`${API_ROOT}/api/v1/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUserInfo)
        })
        .then(async (response) => {
            if (!response.ok) {
                let errorMessage = "Unknown error."

                switch (response.status) {
                    case 500:
                        errorMessage = "Could not create user. User already exists or backend error occurred."
                        break
                    case 400:
                        errorMessage = "FE: Body sent in invalid format."
                        break
                    default:
                        errorMessage = "Unknown error."
                        break
                }

                throw new Error(errorMessage)
            }

            console.log(`User registered: ${await response.text()}`)
            registered = true
        })
        .catch((error) => {
            registered = false
            setNotifierText(`${error.message}`)
            setNotifierTextColor("red")
            setNotifierTextDisplay("block")
        })

        if (!registered) {
            return
        }

        // If all went well with registration, then log the user in and redirect home.
        // Once again, names of fields within objects sent to the API are important.
        // If changed, the API must be modified as well to expect them in the new format.
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
                Create an account
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
                        inputRef={usernameFieldRef}
                        label="Username"
                        name="username"
                        placeholder="e.g. testusername9"
                        error={false}
                        type="text"
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
                    <TextField
                        inputRef={confirmPasswordFieldRef}
                        label="Confirm Password"
                        name="confirmpassword"
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
                            Register
                        </Button>
                        <Typography className="py-5">
                            Already have an account? Login <Link className="text-blue-500 underline" href="/login">here.</Link>
                        </Typography>
                    </div>
                </Box>
            </form>
        </div>
    )
}

export default Register