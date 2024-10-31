"use client"

import {
    Typography,
    Paper,
    Stack,
    TextField,
    Button
} from "@mui/material"
import EditNoteIcon from "@mui/icons-material/EditNote"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import DynamicInputList from "@/app/components/DynamicInputList"
import useApiRequest from "@/app/utils/hooks/useApiRequest"
import { API_ROOT } from "@/app/utils/commonValues"
import { IPollData } from "@/app/utils/commonTypes"

const EditPollPage = ({ params }: { params: { id: string } }) => {
    const { id } = params
    const router = useRouter()
    const [options, setOptions] = useState<string[]>([''])
    const [poll, setPoll] = useState<IPollData | null>(null)
    const { apiRequest } = useApiRequest()
    const titleFieldRef = useRef<HTMLInputElement>(null)
    const [notifierTextColor, setNotifierTextColor] = useState<string>("red")
    const [notifierTextDisplay, setNotifierTextDisplay] = useState<string>("none")
    const [notifierText, setNotifierText] = useState<string>("Notifier Text")

    const handleOptionsChange = (newOptions: string[]) => {
        setOptions(newOptions)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Start by contstructing the new poll data for the backend.
        const pollTitle = titleFieldRef.current?.value

        if (pollTitle?.trim().length === 0) {
            setNotifierText("Poll title cannot be empty.")
            setNotifierTextDisplay("block")
            return
        }

        if (options.length <= 1) {
            setNotifierText("Must be at least two options on poll.")
            setNotifierTextDisplay("block")
            return
        }

        for (const o of options) {
            if (o.trim().length === 0) {
                setNotifierText("No option can be empty.")
                setNotifierTextDisplay("block")
                return
            }
        }

        // We have done basic validations on the options.
        // Now we can construct our payload and hit the API.
        const payloadOptions = options.map((o, _) => {
            return {
                text: o
            }
        })

        const newPollData = {
            question: pollTitle,
            options: payloadOptions
        }

        let newPollResp;

        try {
            newPollResp = await apiRequest(`${API_ROOT}/api/v1/poll`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newPollData)
            })
        } catch (error) {
            console.error(`Failed to create poll: ${error}`)
            setNotifierText("Failed to create poll, try again later.")
            setNotifierTextDisplay("block")
            return
        }

        // Succeeded, redirect to the newly created poll.
        router.push(`/poll/${newPollResp._id}`)
    }

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
            setOptions(data.options)
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
    }, [])

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
                        <EditNoteIcon fontSize="inherit" sx={{ marginRight: 1 }}/>
                        Edit Poll
                    </Typography>
                    <Typography variant="body1">
                        Poll Id: <span className="font-extrabold">{id}</span>
                    </Typography>
                    <Typography variant="body2" color={notifierTextColor} display={notifierTextDisplay}>
                        {notifierText}
                    </Typography>
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <TextField
                            inputRef={titleFieldRef}
                            variant="outlined"
                            label="Poll Title"
                            name="poll_title"
                            placeholder="e.g. Favorite cereal?"
                            // TODO: handle prepopulation of data.
                            error={false}
                            type="text"
                            InputLabelProps={{
                                style: { color: "white" },
                            }}
                            InputProps={{
                                style: { color: "white" },
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white', // Default outline color
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'aqua', // Outline color on hover
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'blue', // Outline color when focused
                                    },
                                },
                                input: {
                                    color: 'white', // Input text color
                                },
                                width: "100%"
                            }} />
                            <DynamicInputList 
                            optionsLimit={5}
                            onOptionsChange={handleOptionsChange}/>
                            <Button
                            variant="contained"
                            color="secondary"
                            type="submit"
                            sx={{ mt: 2 }}
                            >
                                Update
                            </Button>
                    </form>
                </Stack>
            </Paper>
        </div>
    )
}

export default EditPollPage