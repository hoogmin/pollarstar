import { createTheme } from "@mui/material/styles"

const theme = createTheme({
    palette: {
        mode: "dark",
        background: {
            paper: "#424242"
        },
        text: {
            primary: "#FFFFFF"
        }
    },
    components: {
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: "#333333",
                    color: "#FFFFFF",
                    padding: "20px"
                }
            }
        }
    }
})

export default theme