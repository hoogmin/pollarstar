"use client"

import { CircularProgress, Typography } from "@mui/material"

const Loading = () => {
    return (
        <div className="place-content-center text-center w-[100vw] h-[100vh]">
            <CircularProgress color="primary" size="3rem"/>
            <br/>
            <Typography variant="h6" color="primary">Loading</Typography>
        </div>
    )
}

export default Loading