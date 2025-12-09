"use client"

import { useState } from "react"
import { client } from "@/lib/client"
import { useRouter } from "next/navigation"
import { useUsername } from "@/hooks/use-username"

interface JoinRoomModalProps {
  isOpen: boolean
  onClose: () => void
}

export function JoinRoomModal({ isOpen, onClose }: JoinRoomModalProps) {
  const router = useRouter()
  const { username } = useUsername()
  const [roomId, setRoomId] = useState("")
  const [passcode, setPasscode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleJoin = async () => {
    if (!roomId.trim() || !passcode.trim()) {
      setError("Please enter both Room ID and Passcode")
      return
    }

    if (passcode.length !== 6) {
      setError("Passcode must be 6 digits")
      return
    }

    setIsLoading(true)
    setError(null)

    const res = await client.room.verify(roomId.trim(), passcode.trim(), username)

    if (res.status === 200) {
      router.push(`/room/${roomId.trim()}`)
      onClose()
    } else {
      setError(res.error || "Failed to join room")
    }

    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[var(--foreground)]">Join a Room</h2>
          <button
            onClick={onClose}
            className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-[var(--muted)]">Room ID</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID"
              className="w-full bg-[var(--background)] border border-[var(--card-border)] p-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--muted)]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[var(--muted)]">Passcode</label>
            <input
              type="text"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="6-digit passcode"
              maxLength={6}
              className="w-full bg-[var(--background)] border border-[var(--card-border)] p-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--muted)] font-mono tracking-widest text-center"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleJoin}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-500 text-white p-3 text-sm font-bold transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "JOINING..." : "JOIN ROOM"}
          </button>
        </div>
      </div>
    </div>
  )
}
