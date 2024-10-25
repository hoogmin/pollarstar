"use client"

import {
    Typography,
    Paper,
    Stack,
    TextField
} from "@mui/material"
import PollIcon from "@mui/icons-material/Poll"
import { useRouter } from "next/navigation"

const NewPollPage = () => {
    const router = useRouter()

    const handleSubmit = () => {

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
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <TextField
                            //inputRef={}
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
                    </form>
                </Stack>
            </Paper>
        </div>
    )
}

export default NewPollPage