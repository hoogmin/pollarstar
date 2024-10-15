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
import { useAppDispatch } from "@/lib/hooks"
import { setToken } from "@/lib/features/auth/authSlice"
import useApiRequest from "../utils/hooks/useApiRequest"
import { API_ROOT } from "../utils/commonValues"
import { useRouter } from "next/navigation"
import ConfirmDialog from "../components/ConfirmDialog"
import { useState } from "react"

const Settings = () => {
    const { userInfo, loading, error } = useUserInfo(true)
    const { apiRequest } = useApiRequest()
    const dispatch = useAppDispatch()
    const router = useRouter()
    const [showClearSessionDialog, setShowClearSessionDialog] = useState<boolean>(false)
    const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState<boolean>(false)

    if (loading) {
        return <Loading/>
    }

    if (error) {
        return <p>{error}</p>
    }

    const clearAllSessionsAndLogout = async () => {
        try {
            const data = await apiRequest(`${API_ROOT}/api/v1/user/logout/all`, { method: "DELETE" })
            dispatch(setToken({ token: null }))
            router.push('/')
        } catch (error) {
            console.error(`Error clearing sessions: ${error}`)
        }
    }

    const deleteUserAccount = async () => {
        // TODO: Do modal confirm
        try {
            const data = await apiRequest(`${API_ROOT}/api/v1/user`, { method: "DELETE" })
            dispatch(setToken({ token: null }))
            router.push('/')
        } catch (error) {
            console.error(`Error deleting user: ${error}`)
        }
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
                <Button 
                onClick={() => setShowClearSessionDialog(true)}
                variant="outlined" 
                color="info" 
                sx={{ 
                    marginRight: 1,
                    marginBottom: 1,
                }}>
                    Clear all login sessions
                </Button>
                <ConfirmDialog
                title="Clear all sessions?"
                desc="This will log you out of all devices. Continue?"
                open={showClearSessionDialog}
                onConfirm={clearAllSessionsAndLogout}
                onClose={() => setShowClearSessionDialog(false)}/>
                <Button 
                onClick={() => setShowDeleteAccountDialog(true)}
                variant="outlined" 
                color="error" 
                sx={{
                    marginRight: 1,
                    marginBottom: 1,
                }}>
                    Delete my account
                </Button>
                <ConfirmDialog
                title="Delete your account?"
                desc="This action cannot be undone. All your polls will be gone. Are you sure?"
                open={showDeleteAccountDialog}
                onConfirm={deleteUserAccount}
                onClose={() => setShowDeleteAccountDialog(false)}/>
            </Box>
        </Stack>
    )
}

export default Settings