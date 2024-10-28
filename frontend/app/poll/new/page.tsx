"use client"

import {
    Typography,
    Paper,
    Stack,
    TextField,
    Button
} from "@mui/material"
import PollIcon from "@mui/icons-material/Poll"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import DynamicInputList from "@/app/components/DynamicInputList"
import useApiRequest from "@/app/utils/hooks/useApiRequest"

const NewPollPage = () => {
    const router = useRouter()
    const [options, setOptions] = useState<string[]>([''])
    const { apiRequest } = useApiRequest()
    const titleFieldRef = useRef<HTMLInputElement>(null)
    const [notifierTextColor, setNotifierTextColor] = useState<string>("red")
    const [notifierTextDisplay, setNotifierTextDisplay] = useState<string>("none")
    const [notifierText, setNotifierText] = useState<string>("Notifier Text")

    const handleOptionsChange = (newOptions: string[]) => {
        setOptions(newOptions)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Start by contstructing the new poll data for the backend.
        const pollTitle = titleFieldRef.current?.value

        if (options.length <= 0) {
            // TODO: Validate the options here before sending.
        }
    }

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
                        New Poll
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
                                Submit
                            </Button>
                    </form>
                </Stack>
            </Paper>
        </div>
    )
}

export default NewPollPage