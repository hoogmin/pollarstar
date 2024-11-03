"use client"

import { useState } from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import AccountCircle from "@mui/icons-material/AccountCircle"
import Settings from "@mui/icons-material/Settings"
import LogoutIcon from "@mui/icons-material/Logout"
import ListItemIcon from "@mui/material/ListItemIcon"
import DashboardIcon from "@mui/icons-material/Dashboard"
import HomeIcon from "@mui/icons-material/Home"
import LoginIcon from "@mui/icons-material/Login"
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1"
import Link from "next/link"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setToken } from "@/lib/features/auth/authSlice"
import { useRouter } from "next/navigation"
import useApiRequest from "../utils/hooks/useApiRequest"
import { API_ROOT } from "../utils/commonValues"
import useTokenUserInfo from "../utils/hooks/useTokenUserInfo"
import Avatar from "@mui/material/Avatar"
import { deepPurple } from "@mui/material/colors"

const PollarStarNavbar = () => {
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const { apiRequest, loading, error } = useApiRequest()
    const dispatch = useAppDispatch()
    const router = useRouter()
    const decodedToken = useTokenUserInfo()

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleLogout = async () => {
        const invokeLogout = async () => {
            try {
                const data = await apiRequest(`${API_ROOT}/api/v1/user/logout`, { method: "DELETE" })
            } catch (error) {
                console.error(`Error logging user out: ${error}`)
            }
        }

        await invokeLogout()

        // After we invalidate the refresh token via API, let's clear our local access token.
        dispatch(setToken({ token: null }))
        router.push('/')
        handleClose()
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
                {isLoggedIn ? (
                    <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit">
                            <Avatar
                            src={decodedToken?.profilePic} 
                            sx={{
                                bgcolor: deepPurple[500],
                                width: 40,
                                height: 40
                            }}>
                                {decodedToken?.username.at(0)}
                            </Avatar>
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
                                <Link href="/">
                                    <ListItemIcon>
                                        <DashboardIcon fontSize="small" />
                                    </ListItemIcon>
                                    Dashboard
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <Link href="/settings">
                                    <ListItemIcon>
                                        <Settings fontSize="small" />
                                    </ListItemIcon>
                                    Settings
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </div>
                ) : (
                    <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit">
                            <AccountCircle />
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
                                <Link href="/">
                                    <ListItemIcon>
                                        <HomeIcon fontSize="small" />
                                    </ListItemIcon>
                                    Home
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <Link href="/login">
                                    <ListItemIcon>
                                        <LoginIcon fontSize="small" />
                                    </ListItemIcon>
                                    Log In
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <Link href="/register">
                                    <ListItemIcon>
                                        <PersonAddAlt1Icon fontSize="small" />
                                    </ListItemIcon>
                                    Register
                                </Link>
                            </MenuItem>
                        </Menu>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default PollarStarNavbar