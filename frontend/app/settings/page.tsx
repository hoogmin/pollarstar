"use client"

import {
    Typography,
    Box,
    Stack,
    Button
} from "@mui/material"
import useUserInfo from "../utils/hooks/useUserInfo"
import Loading from "../components/Loading"
import PermIdentityIcon from "@mui/icons-material/PermIdentity"
import BadgeIcon from "@mui/icons-material/Badge"
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail"

const Settings = () => {
    const { userInfo, loading, error } = useUserInfo(true)

    if (loading) {
        return <Loading/>
    }

    if (error) {
        return <p>{error}</p>
    }
    
    return (
        <Stack
            spacing={2}
            p={2}
        >
            <Box sx={{ padding: 2 }}>
                <Typography variant="h3">
                    Settings
                </Typography>
            </Box>
            <Box sx={{ padding: 2 }}>
                <PermIdentityIcon fontSize="medium"/>
                <Typography variant="body1">
                    User ID: {userInfo?.id}
                </Typography>
            </Box>
            <Box sx={{ padding: 2 }}>
                <BadgeIcon fontSize="medium"/>
                <Typography variant="body1">
                    Username: {userInfo?.username}
                </Typography>
            </Box>
            <Box sx={{ padding: 2 }}>
                <AlternateEmailIcon fontSize="medium"/>
                <Typography variant="body1">
                    Current Email: {userInfo?.email}
                </Typography>
            </Box>
            <Box
            sx={{ padding: 2 }}>
                <Button variant="outlined" color="info" sx={{ 
                    marginRight: 1,
                    marginBottom: 1,
                }}>
                    Clear all login sessions
                </Button>
                <Button variant="outlined" color="error" sx={{
                    marginRight: 1,
                    marginBottom: 1,
                }}>
                    Delete my account
                </Button>
            </Box>
        </Stack>
    )
}

export default Settings