"use client"

import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { increment, decrement } from "@/lib/features/counter/counterSlice"

export default function Home() {
  const count = useAppSelector(state => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-row space-x-5">
        <button onClick={() => dispatch(increment())}>Increment</button>
        <button onClick={() => dispatch(decrement())}>Decrement</button>
        <p>Count: {count}</p>
      </div>
    </main>
  );
}
