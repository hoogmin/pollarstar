"use client"

import React, { useState } from "react"
import {
    Button,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton
} from "@mui/material"
import { useEffect } from "react"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import CheckIcon from "@mui/icons-material/Check"
import { IOptionData } from "../utils/commonTypes"
import { toast } from "react-toastify"
import { API_ROOT } from "../utils/commonValues"
import useApiRequest from "../utils/hooks/useApiRequest"

interface IOptionListProps {
    pollId: string,
    options: IOptionData[],
    votedFor?: string,
    fetchCallback: () => Promise<void>
}

const OptionList: React.FC<IOptionListProps> = ({ pollId, options, votedFor, fetchCallback }) => {
    const { apiRequest } = useApiRequest()

    const handleVote = async (optionId: string) => {
        const payload = {
            optionId: optionId
        }

        try {
            await apiRequest(`${API_ROOT}/api/v1/poll/${pollId}/vote`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })

            toast.success("Voted!")
        } catch (error) {
            console.error(`Failed to vote on poll: ${error}`)
            toast.error("Failed to vote on poll!")
            return
        }
    }

    return (
        <Box>
            <Typography variant="h6" sx={{ padding: 2 }}>
                Options
            </Typography>
            <List>
                {
                    options.map((option) => (
                        <ListItem
                        key={option._id}
                        secondaryAction={
                            <IconButton
                            disabled={votedFor === option._id}
                            edge="end"
                            color="primary"
                            onClick={async () => {
                                await handleVote(option._id)
                                await fetchCallback()
                            }}>
                                {
                                    votedFor === option._id ? (
                                        <CheckIcon color="primary"/>
                                    ) : (
                                        <ThumbUpIcon color="secondary"/>
                                    )
                                }
                            </IconButton>
                        }>
                            <ListItemText
                            primary={option.text}
                            secondary={`Votes: ${option.votes}`}/>
                        </ListItem>
                    ))
                }
            </List>
        </Box>
    )
}

export default OptionList