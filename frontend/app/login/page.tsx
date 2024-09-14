"use client"

import {
    Box,
    TextField,
    Button,
    Typography
} from "@mui/material"
import Link from "next/link"
import { API_ROOT } from "../utils/commonValues"
import { useRef } from "react"
import { validateEmail, validatePassword } from "../utils/validators"

const Login = () => {
    const emailFieldRef = useRef<HTMLInputElement>(null)
    const passwordFieldRef = useRef<HTMLInputElement>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        // Validate input values before doing anything else.
        const email = emailFieldRef.current?.value
        const password = passwordFieldRef.current?.value

        if (!validateEmail(email)) {
            console.log("Invalid email.")
            return
        }

        if (!validatePassword(password)) {
            console.log("Invalid password.")
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
            // TODO: Store token in-memory.
            console.log(`Successfully logged in: ${await response.text()}`)
        })
        .catch((error) => {
            console.error(`Failed to log in: ${error}`)
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