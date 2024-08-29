"use client"

import Link from "next/link"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import HomeIcon from "@mui/icons-material/Home"

const NotFound = () => {
    return (
        <div>
            <Stack spacing={2} alignItems="center" justifyContent="center">
                <Typography variant="h3" className="uppercase font-bold">404 Not Found</Typography>
                <Typography variant="body1">
                    The page/resource you are looking for was not found.
                </Typography>
                <Link href="/" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 md:px-6 lg:px-8 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out">
                    <HomeIcon sx={{ mr: "3px" }}/>
                    Home
                </Link>
            </Stack>
        </div>
    )
}

export default NotFound