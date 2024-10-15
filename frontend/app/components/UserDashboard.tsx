"use client"

import {
    Stack,
    Box,
    Typography,
    Avatar,
    Tooltip
} from "@mui/material"
import { useEffect, useState } from "react"
import useApiRequest from "../utils/hooks/useApiRequest"
import { API_ROOT } from "../utils/commonValues"

interface IUserDashboardProps {
    id: string | null,
    username: string | null,
    email: string | null
}

interface IPollListable {
    _id: string,
    question: string,
    isLocked: boolean,
    updatedAt: Date
}

const UserDashboard = (props: IUserDashboardProps) => {
    const [pollList, setPollList] = useState<IPollListable[]>([])
    const { apiRequest } = useApiRequest()

    const fetchUserPolls = async () => {
        try {
            const data = await apiRequest(`${API_ROOT}/api/v1/poll?page=1`, { 
                method: "GET"
            })

            setPollList(data)
        } catch (error) {
            console.error(`Error fetching poll list: ${error}`)
            setPollList([])
        }
    }

    useEffect(() => {
        const execFetchPolls = async () => {
            await fetchUserPolls()
        }

        execFetchPolls()
    }, [apiRequest])

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
                    {`${pollList.length} Polls.`}
                </Typography>
            </Box>
        </Stack>
    )
}

export default UserDashboard