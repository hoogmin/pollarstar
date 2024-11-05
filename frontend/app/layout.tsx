"use client"

import StoreProvider from "./components/StoreProvider"
import PollarStarNavbar from "./components/PollarStarNavbar"
import { Roboto } from "next/font/google"
import "./globals.css"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import "react-toastify/dist/ReactToastify.css"
import theme from "./theme"
import { ThemeProvider } from "@mui/material"
import { ToastContainer } from "react-toastify"

const roboto = Roboto({ subsets: ["latin"], weight: "400" })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ThemeProvider theme={theme}>
          <StoreProvider>
            <PollarStarNavbar/>
            {children}
            <ToastContainer
                theme="dark" />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
