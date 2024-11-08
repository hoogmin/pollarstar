"use client"

import {
    Typography,
    Paper,
    Stack,
    Box,
    Button,
    Switch,
    FormControlLabel
} from "@mui/material"
import PollIcon from "@mui/icons-material/Poll"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import LayersClearIcon from "@mui/icons-material/LayersClear"
import useApiRequest from "@/app/utils/hooks/useApiRequest"
import { API_ROOT } from "@/app/utils/commonValues"
import { useState, useEffect, ChangeEvent, Fragment } from "react"
import formatDate from "@/app/utils/formatDate"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/hooks"
import { IPollData } from "@/app/utils/commonTypes"
import useTokenUserInfo from "@/app/utils/hooks/useTokenUserInfo"
import OptionList from "@/app/components/OptionList"
import { toast } from "react-toastify"

const PollPage = ({ params }: { params: { id: string } }) => {
    const { id } = params
    const { apiRequest } = useApiRequest()
    const [poll, setPoll] = useState<IPollData | null>(null)
    const [lockChecked, setLockChecked] = useState<boolean>(false)
    const router = useRouter()
    const loggedIn = useAppSelector((state) => state.auth.isLoggedIn)
    const decodedToken = useTokenUserInfo()

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
            setLockChecked(data.isLocked)
        } catch (error) {
            console.error(`Error fetching poll: ${error}`)
            setPoll(null)
        }
    }

    const handleDelete = async () => {
        try {
            await apiRequest(`${API_ROOT}/api/v1/poll/${id}`, {
                method: "DELETE"
            })

            toast.success("Poll deleted!")
        } catch (error) {
            console.error(`Error deleting poll: ${error}`)
            toast.error("Failed to delete poll!")
            return
        }

        router.push('/')
    }

    const handleLockingPoll = async (e: ChangeEvent<HTMLInputElement>) => {
        if (lockChecked) {
            try {
                await apiRequest(`${API_ROOT}/api/v1/poll/${poll?._id}/unlock`, {
                    method: "PATCH"
                })
            } catch (error) {
                console.error(`Error unlocking poll: ${error}`)
                return
            }

            setLockChecked(false)
            console.log("POLL UNLOCKED")
        } else {
            try {
                await apiRequest(`${API_ROOT}/api/v1/poll/${poll?._id}/lock`, {
                    method: "PATCH"
                })
            } catch (error) {
                console.error(`Error locking poll: ${error}`)
                return
            }

            setLockChecked(true)
            console.log("POLL LOCKED")
        }
    }

    const handleClearVote = async () => {
        try {
            await apiRequest(`${API_ROOT}/api/v1/poll/${id}/clearvote`, {
                method: "DELETE"
            })

            toast.success("Vote cleared!")
        } catch (error) {
            console.error(`Error clearing vote on poll: ${error}`)
            toast.error("Failed to clear vote!")
            return
        }
    }

    const findVotedFor = () => {
        const voteRecord = poll?.voters.find((v) => v.userId === decodedToken?.id)

        if (voteRecord) {
            return voteRecord.option
        }

        return undefined
    }

    useEffect(() => {
        const execFetchPoll = async () => {
            await fetchPoll()
        }

        execFetchPoll()
    }, [apiRequest, lockChecked])

    return (
        <div>
            <Paper variant="outlined" sx={{
                maxWidth: "960px",
                margin: "0 auto",
                padding: 2,
                width: "100%"
            }}>
                <Stack spacing={2}>
                    <Typography variant="h4">
                        <PollIcon fontSize="inherit" sx={{ marginRight: 1 }} />
                        {poll?.question}
                    </Typography>
                    <Typography variant="body1">
                        Poll Id: <span className="font-extrabold">{id}</span>
                    </Typography>
                    <Typography variant="body1">
                        Created by: <span className="font-extrabold">{poll?.owner.username}</span>
                    </Typography>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row"
                    }}>
                        <Typography variant="body1">
                            Created: <span className="font-extrabold">{formatDate(poll?.createdAt)}</span>
                        </Typography>
                        &nbsp;
                        <Typography variant="body1">
                            Updated: <span className="font-extrabold">{formatDate(poll?.updatedAt)}</span>
                        </Typography>
                    </Box>
                    {
                        loggedIn && (
                            <Box sx={{
                                display: "flex",
                                flexDirection: "row"
                            }}>
                                <Button 
                                variant="contained" 
                                color="info" 
                                onClick={async () => {
                                    await handleClearVote()
                                    await fetchPoll()
                                }} 
                                sx={{ mr: 1 }}>
                                    <LayersClearIcon fontSize="inherit" sx={{ mr: 1 }} />
                                    Clear my vote
                                </Button>
                                {
                                    decodedToken?.id === poll?.owner._id && (
                                        <Fragment>
                                            <Button variant="contained" color="secondary" sx={{ mr: 1 }}>
                                                <Link href={`/poll/${poll?._id}/edit`}>
                                                    <EditIcon fontSize="inherit" sx={{ mr: 1 }} />
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button variant="contained" color="error" onClick={handleDelete} sx={{ mr: 1 }}>
                                                <DeleteIcon fontSize="inherit" sx={{ mr: 1 }} />
                                                Delete
                                            </Button>
                                            <FormControlLabel
                                                control={<Switch checked={lockChecked} onChange={handleLockingPoll}/>}
                                                label={poll?.isLocked ? "Locked" : "Unlocked"} />
                                        </Fragment>
                                    )
                                }
                            </Box>
                        )
                    }
                    <OptionList
                    pollId={poll?._id ? poll._id : ""} 
                    options={poll?.options ? poll.options : []}
                    votedFor={findVotedFor()}
                    fetchCallback={fetchPoll}/>
                </Stack>
            </Paper>
        </div>
    )
}

export default PollPage