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
import { useRef } from "react"

const Register = () => {
    const emailFieldRef = useRef<HTMLInputElement>(null)
    const usernameFieldRef = useRef<HTMLInputElement>(null)
    const passwordFieldRef = useRef<HTMLInputElement>(null)
    const confirmPasswordFieldRef = useRef<HTMLInputElement>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        // Validate all form fields based on our app requirements for each field.
        const email = emailFieldRef.current?.value
        const username = usernameFieldRef.current?.value
        const password = passwordFieldRef.current?.value
        const confirmPassword = confirmPasswordFieldRef.current?.value

        if (!validateEmail(email)) {
            console.log(`EMAIL ERROR: ${email}`)
            return
        }

        if (!validateUsername(username)) {
            console.log(`USERNAME ERROR: ${username}`)
            return
        }

        if (!validatePassword(password)) {
            console.log(`PASSWORD ERROR: ${password}`)
            return
        }

        if (confirmPassword !== password) {
            console.log(`PASSWORDS DO NOT MATCH.`)
            return
        }

        // All validated, now we can register our user via fetch.

        // Names are important here. The API expects the body's fields to have particular keys.
        const newUserInfo = {
            username: username,
            email: email,
            password: password
        }

        await fetch(`${API_ROOT}/api/v1/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUserInfo)
        })
        .then(async (response) => {
            console.log(`User registered: ${await response.text()}`)
        })
        .catch((error) => {
            console.error("Failed to register user.")
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