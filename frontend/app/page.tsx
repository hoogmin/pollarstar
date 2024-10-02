"use client"

import { useAppSelector } from "@/lib/hooks"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Link from "next/link"
import { useEffect, useState } from "react"
import useApiRequest from "./utils/hooks/useApiRequest"
import { API_ROOT } from "./utils/commonValues"
import UserDashboard from "./components/UserDashboard"

export default function Home() {
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
  const { apiRequest, loading, error } = useApiRequest()
  const [userInfo, setUserInfo] = useState<null | any>(null)

  const populateUserInfo = async () => {
    const getUserData = async () => {
      try {
        const data = await apiRequest(`${API_ROOT}/api/v1/user/me`, { method: "GET" })
        return data
      } catch (error) {
        console.error(`Error fetching data: ${error}`)
        return null
      }
    }

    const response = await getUserData()

    setUserInfo(response)
  }

  useEffect(() => {
    if (!isLoggedIn) {
      setUserInfo(null)
      return
    }

    // userInfo persists across re-renders, so let's only refetch if there isn't already data stored
    // within it. I chose to fetch instead of storing in state as I always want the freshest data here.
    if (!userInfo) {
      populateUserInfo()
    }
  }, [isLoggedIn, apiRequest])

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
              <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 md:px-6 lg:px-8 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out">
                Login
              </Link>
              <Link href="/register" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 md:px-6 lg:px-8 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out">
                Register
              </Link>
            </Stack>
          </Stack>
        )
      }
    </main>
  );
}
