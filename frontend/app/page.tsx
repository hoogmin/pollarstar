"use client"

import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { increment, decrement } from "@/lib/features/counter/counterSlice"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Link from "next/link"

export default function Home() {
  const count = useAppSelector(state => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
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
    </main>
  );
}
