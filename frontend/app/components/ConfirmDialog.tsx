"use client"

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button
} from "@mui/material"
import { Fragment } from "react"

interface IConfirmDialogProps {
    title: string,
    desc: string | null | undefined,
    open: boolean,
    onConfirm: () => void,
    onClose: () => void
}

const ConfirmDialog = (props: IConfirmDialogProps) => {
    return (
        <Fragment>
            <Dialog
            open={props.open}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description">
                <DialogTitle id="confirm-dialog-title">
                    {props.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        {props.desc}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                    onClick={props.onConfirm} 
                    variant="contained"
                    color="error">Confirm</Button>
                    <Button
                    onClick={props.onClose}
                    variant="contained"
                    color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}

export default ConfirmDialog