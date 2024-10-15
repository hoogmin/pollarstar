"use client"

import { useAppSelector } from "@/lib/hooks"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import LoginIcon from "@mui/icons-material/Login"
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1"
import Link from "next/link"
import useUserInfo from "./utils/hooks/useUserInfo"
import UserDashboard from "./components/UserDashboard"

export default function Home() {
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
  const { userInfo } = useUserInfo(isLoggedIn)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {
        isLoggedIn ? (
          <UserDashboard id={userInfo?.id} username={userInfo?.username} email={userInfo?.email}/>
        ) : (
          <Stack spacing={2} alignItems="center" justifyContent="center">
            <Typography variant="h2" className="uppercase font-bold">PollarStar</Typography>
            <Typography variant="body1">
              Create and share polls freely.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="primary">
                <Link href="/login">
                  <LoginIcon fontSize="small" sx={{ marginRight: 1 }}/>
                  Login
                </Link>
              </Button>
              <Button variant="contained" color="secondary">
                <Link href="/register">
                  <PersonAddAlt1Icon fontSize="small" sx={{ marginRight: 1 }}/>
                  Register
                </Link>
              </Button>
            </Stack>
          </Stack>
        )
      }
    </main>
  );
}
