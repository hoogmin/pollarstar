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
        <Typography variant="h2">PollarStar</Typography>
        <Typography variant="body1">
          Create and share polls freely.
        </Typography>
        <Stack direction="row" spacing={2}>
          <Link href="#">Login</Link>
          <Link href="#">Register</Link>
        </Stack>
      </Stack>
    </main>
  );
}
