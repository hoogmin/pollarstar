"use client"

import {
    Stack,
    Box,
    Typography,
    Avatar,
    Tooltip
} from "@mui/material"

interface UserDashboardProps {
    id: string | null,
    username: string | null,
    email: string | null
}

const UserDashboard = (props: UserDashboardProps) => {
    return (
        <Stack
            spacing={2}
            textAlign="center"
            alignItems="center"
        >
            <Box sx={{ padding: 2 }}>
                <Tooltip title={`${props.username}'s Profile`} placement="top">
                    <Avatar 
                    alt="User profile"
                    sx={{ 
                        bgcolor: "blue",
                        width: 120,
                        height: 120
                    }}>
                        {props.username?.at(0)}
                    </Avatar>
                </Tooltip>
            </Box>
            <Box sx={{ padding: 2 }}>
                <Tooltip title="Your User ID" placement="left">
                    <Typography variant="body1" fontWeight="bold">
                        {props.id}
                    </Typography>
                </Tooltip>
            </Box>
            <Box sx={{ padding: 2 }}>
                <Typography variant="body1">
                    Poll List...
                </Typography>
            </Box>
        </Stack>
    )
}

export default UserDashboard