"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { client } from "@/lib/client"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useUsername } from "@/hooks/use-username"

export default function VerifyPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.roomId as string
  const { username } = useUsername()

  const [passcode, setPasscode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleVerify = async () => {
    if (!passcode.trim() || passcode.length !== 6) {
      setError("Please enter a 6-digit passcode")
      return
    }

    setIsLoading(true)
    setError(null)

    const res = await client.room.verify(roomId, passcode.trim(), username)

    if (res.status === 200) {
      sessionStorage.setItem(`passcode:${roomId}`, passcode.trim())
      router.push(`/room/${roomId}`)
    } else if (res.status === 404) {
      router.push("/room?error=room-not-found")
    } else if (res.status === 403) {
      router.push("/room?error=room-full")
    } else {
      setError(res.error || "Invalid passcode")
    }

    setIsLoading(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[var(--background)] overflow-hidden relative">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Gradient background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-green-500">
            {">"}enter_passcode
          </h1>
          <p className="text-[var(--muted)] text-sm">
            This room is protected. Enter the passcode to join.
          </p>
        </div>

        <div className="border border-[var(--card-border)] bg-[var(--card-bg)] p-6 backdrop-blur-md">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="flex items-center text-[var(--muted)]">Room ID</label>
              <div className="bg-[var(--background)] border border-[var(--card-border)] p-3 text-sm text-[var(--muted)] font-mono truncate">
                {roomId}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-[var(--muted)]">Passcode</label>
              <input
                type="text"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                placeholder="Enter 6-digit passcode"
                maxLength={6}
                autoFocus
                className="w-full bg-[var(--background)] border border-[var(--card-border)] p-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] font-mono tracking-widest text-center focus:outline-none focus:border-[var(--muted)]"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              onClick={handleVerify}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-500 text-white p-3 text-sm font-bold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "VERIFYING..." : "JOIN ROOM"}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
