"use client"

import { FormEvent } from "react"
import {
    Box,
    TextField,
    Button,
    Typography
} from "@mui/material"
import {
    AccountCircle,
    EmailSharp
} from "@mui/icons-material"
import Link from "next/link"

const Register = () => {

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("SUBMITTED NO REFRESH");
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