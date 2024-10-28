"use client"

import React, { useState } from "react"
import {
    TextField,
    Button,
    Box,
    Typography
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"

interface DynamicInputListProps {
    optionsLimit?: number,
    onOptionsChange: (options: string[]) => void
}

const DynamicInputList: React.FC<DynamicInputListProps> = ({ optionsLimit = 10, onOptionsChange }) => {
    const [options, setOptions] = useState<string[]>([''])

    const handleChange = (index: number, value: string) => {
        const updatedOptions = [...options]
        updatedOptions[index] = value
        setOptions(updatedOptions)
        onOptionsChange(updatedOptions) // Callback to send updated options to the parent.
    }

    const handleAddOption = () => {
        if (options.length < optionsLimit) {
            setOptions([...options, ''])
        }
    }

    const handleRemoveOption = (index: number) => {
        const updatedOptions = options.filter((_, i) => i !== index)
        setOptions(updatedOptions)
        onOptionsChange(updatedOptions) // Update parent with new options list
    }

    return (
        <Box>
            <Typography variant="h6" sx={{ padding: 2 }}>
                Poll Options
            </Typography>
            {
                options.map((option, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={2}>
                        <TextField
                        variant="outlined"
                        label={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => handleChange(index, e.target.value)}
                        fullWidth
                        />
                        <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleRemoveOption(index)}
                        disabled={options.length <= 1}
                        sx={{ ml: 1 }}>
                            <DeleteIcon fontSize="inherit" sx={{ marginRight: 1 }}/>
                            Remove
                        </Button>
                    </Box>
                ))
            }
            {
                options.length < optionsLimit && (
                    <Button variant="contained" color="primary" onClick={handleAddOption}>
                        <AddIcon fontSize="inherit" sx={{ marginRight: 1 }}/>
                        Add Option
                    </Button>
                )
            }
        </Box>
    )
}

export default DynamicInputList