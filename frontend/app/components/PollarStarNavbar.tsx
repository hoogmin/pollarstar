"use client"

import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Link from "next/link"

const PollarStarNavbar = () => {
    return (
        <AppBar position="static" color="transparent" enableColorOnDark>
            <Toolbar>
                <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}>
                    <MenuIcon/>
                </IconButton>

                {/* Brand / Logo */}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    PollarStar
                </Typography>

                {/* Navigation Button(s) */}
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    )
}

export default PollarStarNavbar