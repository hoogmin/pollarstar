"use client"

import Link from "next/link"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import HomeIcon from "@mui/icons-material/Home"

const NotFound = () => {
    return (
        <div className="h-[70vh] place-content-center">
            <Stack 
            spacing={2} 
            alignItems="center" 
            >
                <Typography variant="h3" className="uppercase font-bold">404 Not Found</Typography>
                <Typography variant="body1">
                    The page/resource you are looking for was not found.
                </Typography>
                <Button variant="contained" color="info">
                    <Link href="/">
                        <HomeIcon sx={{ mr: "3px" }}/>
                        Home
                    </Link>
                </Button>
            </Stack>
        </div>
    )
}

export default NotFound