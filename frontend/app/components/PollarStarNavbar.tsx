"use client"

import { useState } from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import AccountCircle from "@mui/icons-material/AccountCircle"
import Link from "next/link"

const PollarStarNavbar = () => {
    const [auth, setAuth] = useState<boolean>(true)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <AppBar position="static" color="transparent" enableColorOnDark>
            <Toolbar>
                {/* Brand / Logo */}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link href="/">
                        PollarStar
                    </Link>
                </Typography>

                {/* Account Menu */}
                {auth && (
                    <div>
                        <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit">
                            <AccountCircle/>
                        </IconButton>
                        <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right"
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right"
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}>
                            <MenuItem onClick={handleClose}>
                                <Link href="/">Home</Link>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <Link href="/settings">Settings</Link>
                            </MenuItem>
                        </Menu>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default PollarStarNavbar