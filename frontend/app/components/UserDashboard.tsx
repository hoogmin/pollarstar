"use client"

import {
    Stack,
    Box,
    Typography,
    Avatar,
    Tooltip,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Button,
    ButtonGroup,
    Pagination
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from "@mui/icons-material/Refresh"
import PollIcon from "@mui/icons-material/Poll"
import LockIcon from "@mui/icons-material/Lock"
import LockOpen from "@mui/icons-material/LockOpen"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import Link from "next/link"
import { Fragment, useEffect, useState } from "react"
import useApiRequest from "../utils/hooks/useApiRequest"
import { API_ROOT } from "../utils/commonValues"
import formatDate from "../utils/formatDate"
import { deepPurple } from "@mui/material/colors"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"

interface IUserDashboardProps {
    id: string | null,
    username: string | null,
    email: string | null,
    profilePic: string | null
}

interface IPollListable {
    _id: string,
    question: string,
    isLocked: boolean,
    updatedAt: Date
}

interface IUserStats {
    pollsCount: number
}

const UserDashboard = (props: IUserDashboardProps) => {
    const [pollList, setPollList] = useState<IPollListable[]>([])
    const [userStats, setUserStats] = useState<IUserStats>({ pollsCount: 0 })
    const [page, setPage] = useState<number>(1)
    const [numberOfPages, setNumberOfPages] = useState<number>(1)
    const { apiRequest } = useApiRequest()
    const router = useRouter()

    const fetchUserPolls = async () => {
        try {
            const data = await apiRequest(`${API_ROOT}/api/v1/poll?page=${page}`, {
                method: "GET"
            })

            const statsData = await apiRequest(`${API_ROOT}/api/v1/user/me/stats`, {
                method: "GET"
            })

            // Despite the interface, dates won't be auto-converted to
            // Date objects, we have to do that ourselves. Take this
            // opportunity to sort our data as well.
            const parsedData: IPollListable[] = data.map((poll: IPollListable) => ({
                ...poll,
                updatedAt: new Date(poll.updatedAt)
            }))

            const noPages = Math.ceil(statsData.pollsCount / 25) <= 0 ? 1 : Math.ceil(statsData.pollsCount / 25)
            setNumberOfPages(noPages)
            setUserStats(statsData)
            setPollList(parsedData)
        } catch (error) {
            console.error(`Error fetching poll list: ${error}`)
            setPollList([])
        }
    }

    const setPageNumber = (pageNumber: number) => {
        if (pageNumber <= 0 || !Number.isInteger(pageNumber)) return

        setPage(pageNumber)
    }

    const handleDelete = async (id: string) => {
        try {
            await apiRequest(`${API_ROOT}/api/v1/poll/${id}`, {
                method: "DELETE"
            })

            await fetchUserPolls()
            toast.success("Poll deleted!")
        } catch (error) {
            console.error(`Error deleting poll: ${error}`)
            toast.error("Failed to delete poll!")
            return
        }
    }

    const handleLockingPoll = async (poll: IPollListable) => {
        if (poll.isLocked) {
            try {
                await apiRequest(`${API_ROOT}/api/v1/poll/${poll._id}/unlock`, {
                    method: "PATCH"
                })

                await fetchUserPolls()
                toast.success("Poll unlocked.")
            } catch (error) {
                console.error(`Error unlocking poll: ${error}`)
                toast.error("Failed to unlock poll!")
                return
            }
        } else {
            try {
                await apiRequest(`${API_ROOT}/api/v1/poll/${poll._id}/lock`, {
                    method: "PATCH"
                })

                await fetchUserPolls()
                toast.success("Poll locked")
            } catch (error) {
                console.error(`Error locking poll: ${error}`)
                toast.error("Failed to lock poll!")
                return
            }
        }
    }

    useEffect(() => {
        const execFetchPolls = async () => {
            await fetchUserPolls()
        }

        execFetchPolls()
    }, [apiRequest, page])

    return (
        <Stack
            spacing={2}
            textAlign="center"
            alignItems="center"
        >
            <Box sx={{ padding: 2 }}>
                <Tooltip title={`${props.username}'s Profile`} placement="top">
                    <Avatar
                        src={props.profilePic ? props.profilePic : ""}
                        alt="User profile"
                        sx={{
                            bgcolor: deepPurple[500],
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
                <Button variant="outlined" color="info" sx={{ margin: 1 }}>
                    <Link href="/poll/new">
                        <AddIcon fontSize="small" sx={{ marginRight: 1 }} />
                        New Poll
                    </Link>
                </Button>
                <Button onClick={fetchUserPolls} variant="outlined" color="secondary">
                    <RefreshIcon fontSize="small" sx={{ marginRight: 1 }} />
                    Refresh List
                </Button>
            </Box>
            <Box sx={{ padding: 2 }}>
                <Typography
                    variant="h6"
                    sx={{
                        padding: 2,
                        fontWeight: "700"
                    }}>
                    {`${pollList.length} Polls`}
                </Typography>
                <Pagination
                    count={numberOfPages <= 0 ? 1 : numberOfPages}
                    color="secondary"
                    variant="outlined" />
            </Box>
            <Box sx={{
                padding: 2,
                width: "100%",
                bgcolor: "background.paper",
                borderRadius: "5px"
            }}>
                {
                    pollList.length === 0 ? (
                        <Typography variant="body1">
                            No Polls
                        </Typography>
                    ) : (
                        <Fragment>
                            <List>
                                {
                                    pollList.map((poll, index) => (
                                        <ListItem key={index} disablePadding>
                                            <Link href={`/poll/${poll._id}`} key={index} className="w-[100%]">
                                                <ListItemButton>
                                                    {
                                                        poll.isLocked ? (
                                                            <ListItemIcon>
                                                                <LockIcon />
                                                            </ListItemIcon>
                                                        ) : (
                                                            <ListItemIcon>
                                                                <PollIcon />
                                                            </ListItemIcon>
                                                        )
                                                    }
                                                    <ListItemText
                                                        primary={poll.question}
                                                        secondary={`Updated: ${formatDate(poll.updatedAt)}`} />
                                                </ListItemButton>
                                            </Link>
                                            <ButtonGroup
                                                variant="outlined"
                                                aria-label="Quick poll operations button group"
                                                sx={{ ml: "auto" }}>
                                                <Button onClick={() => router.push(`/poll/${poll?._id}/edit`)}>
                                                    <EditIcon fontSize="inherit" />
                                                </Button>
                                                <Button onClick={async () => {
                                                    await handleDelete(poll._id)
                                                }}>
                                                    <DeleteIcon fontSize="inherit" />
                                                </Button>
                                                <Button onClick={async () => {
                                                    await handleLockingPoll(poll)
                                                }}>
                                                    {
                                                        poll?.isLocked ? (
                                                            <LockIcon fontSize="inherit" />
                                                        ) : (
                                                            <LockOpen fontSize="inherit" />
                                                        )
                                                    }
                                                </Button>
                                            </ButtonGroup>
                                        </ListItem>
                                    ))
                                }
                            </List>
                        </Fragment>
                    )
                }
            </Box>
            <ToastContainer
                theme="dark" />
        </Stack>
    )
}

export default UserDashboard