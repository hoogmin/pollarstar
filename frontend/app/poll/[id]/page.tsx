"use client"

import {
    Typography,
    Paper,
    Stack
} from "@mui/material"
import PollIcon from "@mui/icons-material/Poll"
import useApiRequest from "@/app/utils/hooks/useApiRequest"
import { API_ROOT } from "@/app/utils/commonValues"
import { useState, useEffect } from "react"

interface IOptionData {
    _id: string,
    text: string,
    votes: number
}

interface IVoterData {
    _id: string,
    userId: string,
    option: string
}

interface IPollData {
    _id: string,
    question: string,
    options: IOptionData[],
    owner: string,
    isLocked: boolean,
    voters: IVoterData[],
    createdAt: Date,
    updatedAt: Date
}

const PollPage = ({ params }: { params: { id: string } }) => {
    const { id } = params
    const { apiRequest } = useApiRequest()
    const [poll, setPoll] = useState<IPollData | null>(null)

    const fetchPoll = async () => {
        try {
            const data = await apiRequest(`${API_ROOT}/api/v1/poll/${id}`, {
                method: "GET"
            })

            // Despite the interface, dates won't be auto-converted to
            // Date objects, we have to do that ourselves.
            data.createdAt = new Date(data.createdAt)
            data.updatedAt = new Date(data.updatedAt)

            setPoll(data)
        } catch (error) {
            console.error(`Error fetching poll: ${error}`)
            setPoll(null)
        }
    }

    useEffect(() => {
        const execFetchPoll = async () => {
            await fetchPoll()
        }

        execFetchPoll()
    }, [apiRequest])

    return (
        <div>
            <Paper variant="outlined" sx={{
                maxWidth: "960px",
                margin: "0 auto",
                padding: 2,
                width: "100%"
            }}>
                <Stack spacing={2}>
                    <Typography variant="h4" className="text-center">
                        <PollIcon fontSize="inherit" sx={{ marginRight: 1 }}/>
                        Poll {id}
                    </Typography>
                    <Typography variant="h6">
                        {poll?.question}
                    </Typography>
                </Stack>
            </Paper>
        </div>
    )
}

export default PollPage