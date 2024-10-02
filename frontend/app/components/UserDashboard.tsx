"use client"

import {
    Stack,
    Box,
    Typography
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
        >
            <Box sx={{ padding: 2 }}>
                <Typography variant="h3">
                    {props.username}
                </Typography>
            </Box>
            <Box sx={{ padding: 2 }}>
                <Typography variant="body1">
                    UID: {props.id}
                </Typography>
            </Box>
            <Box sx={{ padding: 2 }} display="flex" justifyContent="space-evenly" alignItems="center">
                <Typography variant="body1">
                    Polls Created: 0
                </Typography>
                <Typography variant="body1">
                    Deleted: 0
                </Typography>
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