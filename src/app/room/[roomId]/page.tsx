"use client"

import { useUsername } from "@/hooks/use-username"
import { useNotificationSound } from "@/hooks/use-notification-sound"
import { client } from "@/lib/client"
import { useRealtime } from "@/lib/realtime-client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { ShareModal } from "@/components/ShareModal"
import { ConfirmModal } from "@/components/ConfirmModal"

import { deriveKey, encryptMessage, decryptMessage } from "@/lib/crypto"

function formatTimeRemaining(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

const Page = () => {
  const params = useParams()
  const roomId = params.roomId as string

  const router = useRouter()
  const { username } = useUsername()
  const { playSound } = useNotificationSound()

  
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [otherTyping, setOtherTyping] = useState<string | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [passcode, setPasscode] = useState<string>("")
  const [showDestroyConfirm, setShowDestroyConfirm] = useState(false)

  const [, forceUpdate] = useState(0)

  // Load passcode from sessionStorage (if creator) or fetch from API
  useEffect(() => {
    const storedPasscode = sessionStorage.getItem(`passcode:${roomId}`)
    if (storedPasscode) {
      setPasscode(storedPasscode)
    } else {
      // Fetch passcode from API for authenticated users
      client.room.info(roomId).then((res) => {
        if (res.data?.passcode) {
          setPasscode(res.data.passcode)
        }
      })
    }
  }, [roomId])

  // Show toast if room was just created
  // Show toast if room was just created
  useEffect(() => {
    const storedPasscode = sessionStorage.getItem(`passcode:${roomId}`)
    if (storedPasscode) {
      // Clear it so toast doesn't show on refresh
      sessionStorage.removeItem(`passcode:${roomId}`)
      setPasscode(storedPasscode)
    }
  }, [roomId])

  // Force re-render every 30s to update relative timestamps
  useEffect(() => {
    const interval = setInterval(() => forceUpdate((n) => n + 1), 30000)
    return () => clearInterval(interval)
  }, [])

  const { data: ttlData } = useQuery({
    queryKey: ["ttl", roomId],
    queryFn: async () => {
      const res = await client.room.ttl(roomId)
      return res.data
    },
  })
  
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null)

  // Derive crypto key when passcode is available
  useEffect(() => {
    if (passcode && roomId) {
      deriveKey(passcode, roomId).then(setCryptoKey)
    }
  }, [passcode, roomId])

  useEffect(() => {
    if (ttlData?.ttl !== undefined) setTimeRemaining(ttlData.ttl)
  }, [ttlData])

  useEffect(() => {
    if (timeRemaining === null || timeRemaining < 0) return

    if (timeRemaining === 0) {
      router.push("/room?destroyed=true")
      return
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeRemaining, router])

  const { data: messages, refetch } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: async () => {
      const res = await client.messages.get(roomId)
      return res.data
    },
  })

  // Send typing indicator (debounced)
  const sendTyping = useCallback(
    (isTyping: boolean) => {
      client.typing.send(roomId, { sender: username, isTyping })
    },
    [roomId, username]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)

    // Send typing indicator
    sendTyping(true)

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(false)
    }, 2000)
  }



  const [decryptedMessages, setDecryptedMessages] = useState<Record<string, string>>({})

  // Decrypt new messages as they arrive
  useEffect(() => {
    if (!messages?.messages || !cryptoKey) return

    messages.messages.forEach(async (msg) => {
      // Skip if already decrypted or not encrypted (backwards compatibility)
      if (decryptedMessages[msg.id]) return

      // Try to decrypt if it looks like encrypted data (contains colon for IV:Ciphertext)
      if (msg.text.includes(":")) {
        try {
            const decrypted = await decryptMessage(msg.text, cryptoKey)
            setDecryptedMessages(prev => ({ ...prev, [msg.id]: decrypted }))
        } catch (e) {
            console.error("Failed to decrypt", e)
        }
      } else {
        // Mark plain text as decrypted as-is
        setDecryptedMessages(prev => ({ ...prev, [msg.id]: msg.text }))
      }
    })
  }, [messages?.messages, cryptoKey, decryptedMessages])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages?.messages, decryptedMessages, otherTyping])

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      let messageContent = text

      // Encrypt if we have a key
      if (cryptoKey) {
        messageContent = await encryptMessage(text, cryptoKey)
      }

      await client.messages.send(roomId, { sender: username, text: messageContent })
    },
  })

  useRealtime({
    channels: [roomId],
    events: ["chat.message", "chat.destroy", "chat.typing", "chat.join"],
    onData: ({ event, data }) => {
      if (event === "chat.message") {
        refetch()
        // Play sound for messages from others
        const msgData = data as { sender: string }
        if (msgData.sender !== username) {
          playSound()
        }
      }

      if (event === "chat.destroy") {
        router.push("/room?destroyed=true")
      }

      if (event === "chat.typing") {
        const typingData = data as { sender: string; isTyping: boolean }
        if (typingData.sender !== username) {
          if (typingData.isTyping) {
            setOtherTyping(typingData.sender)
          } else {
            setOtherTyping(null)
          }
        }
      }

      if (event === "chat.join") {
        // const joinData = data as { username: string }
        // if (joinData.username !== username) {
        //   toast(`${joinData.username} joined the room`, "info")
        // }
      }
    },
  })

  const { mutate: destroyRoom } = useMutation({
    mutationFn: async () => {
      await client.room.delete(roomId)
    },
  })





  return (
    <>
    <main className="flex flex-col h-screen max-h-screen overflow-hidden bg-[var(--background)]">
      <header className="border-b border-[var(--card-border)] p-3 sm:p-4 bg-[var(--card-bg)]">
        {/* Mobile Layout */}
        <div className="sm:hidden space-y-3">
          {/* Row 1: Room ID + Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-[var(--muted)] uppercase">Room ID</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-green-500 truncate">{roomId.slice(0, 10) + "..."}</span>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="text-xs bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-white transition-colors cursor-pointer font-bold"
                >
                  SHARE
                </button>
              </div>
            </div>
            <ThemeToggle />
          </div>

          {/* Row 2: Self-Destruct + Destroy Button */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-[var(--muted)] uppercase">Self-Destruct</span>
              <span
                className={`text-sm font-bold ${
                  timeRemaining !== null && timeRemaining < 60
                    ? "text-red-500"
                    : "text-amber-500"
                }`}
              >
                {timeRemaining !== null ? formatTimeRemaining(timeRemaining) : "--:--"}
              </span>
            </div>
            <button
              onClick={() => setShowDestroyConfirm(true)}
              className="text-xs bg-[var(--card-border)] hover:bg-red-600 px-3 py-1.5 rounded text-[var(--muted)] hover:text-white font-bold transition-all group flex items-center gap-2 cursor-pointer"
            >
              <span className="group-hover:animate-pulse">💣</span>
              DESTROY NOW
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-[var(--muted)] uppercase">Room ID</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-green-500 truncate">{roomId.slice(0, 10) + "..."}</span>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="text-[10px] bg-green-600 hover:bg-green-500 px-2 py-0.5 rounded text-white transition-colors cursor-pointer"
                >
                  SHARE
                </button>
              </div>
            </div>

            <div className="h-8 w-px bg-[var(--card-border)]" />

            <div className="flex flex-col">
              <span className="text-xs text-[var(--muted)] uppercase">Self-Destruct</span>
              <span
                className={`text-sm font-bold flex items-center gap-2 ${
                  timeRemaining !== null && timeRemaining < 60
                    ? "text-red-500"
                    : "text-amber-500"
                }`}
              >
                {timeRemaining !== null ? formatTimeRemaining(timeRemaining) : "--:--"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setShowDestroyConfirm(true)}
              className="text-xs bg-[var(--card-border)] hover:bg-red-600 px-3 py-1.5 rounded text-[var(--muted)] hover:text-white font-bold transition-all group flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span className="group-hover:animate-pulse">💣</span>
              DESTROY NOW
            </button>
          </div>
        </div>
      </header>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages?.messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-[var(--muted-foreground)] text-sm font-mono">
              No messages yet, start the conversation.
            </p>
          </div>
        )}

        {messages?.messages.map((msg) => {
          const isOwn = msg.sender === username

          return (
            <div key={msg.id} className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
              <div className="max-w-[80%] group">
                <div className="flex items-baseline gap-3 mb-1">
                  <span
                    className={`text-xs font-bold ${
                      isOwn ? "text-green-500" : "text-blue-500"
                    }`}
                  >
                    {isOwn ? "YOU" : msg.sender}
                  </span>

                  <span className="text-[10px] text-[var(--muted-foreground)]">
                    {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                  </span>
                </div>

                <p className="text-sm text-[var(--foreground)] leading-relaxed break-all">
                  {decryptedMessages[msg.id] || (msg.text.includes(":") ? "🔓 Decrypting..." : msg.text)}
                </p>
              </div>
            </div>
          )
        })}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator - fixed above input */}
      <div className="px-4 h-6 flex items-center border-t border-[var(--card-border)] bg-[var(--card-bg)]">
        {otherTyping && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-500">{otherTyping}</span>
            <span className="text-xs text-[var(--muted)]">is typing</span>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-[var(--muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-[var(--muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-[var(--muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </div>
        )}
      </div>

      <div className="p-3 md:p-4 border-t border-[var(--card-border)] bg-[var(--card-bg)]">
        <div className="flex gap-2 md:gap-4">
          <div className="flex-1 relative group">
            <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-green-500 animate-pulse">
              {">"}
            </span>
            <input
              ref={inputRef}
              autoFocus
              type="text"
              value={input}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  const textToSend = input
                  setInput("")
                  sendTyping(false)
                  if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current)
                  }
                  sendMessage({ text: textToSend })
                  inputRef.current?.focus()
                }
              }}
              placeholder="Type message..."
              onChange={handleInputChange}
              className="w-full bg-[var(--background)] border border-[var(--card-border)] focus:border-[var(--muted)] focus:outline-none transition-colors text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] py-2.5 md:py-3 pl-7 md:pl-8 pr-3 md:pr-4 text-sm"
            />
          </div>

          <button
            onClick={() => {
              if (input.trim()) {
                const textToSend = input
                setInput("")
                sendTyping(false)
                if (typingTimeoutRef.current) {
                  clearTimeout(typingTimeoutRef.current)
                }
                sendMessage({ text: textToSend })
                inputRef.current?.focus()
              }
            }}
            disabled={!input.trim() || isPending}
            className="bg-green-600 hover:bg-green-500 text-white px-4 md:px-6 text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            SEND
          </button>
        </div>
      </div>
    </main>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        roomId={roomId}
        passcode={passcode}
      />

      <ConfirmModal
        isOpen={showDestroyConfirm}
        onClose={() => setShowDestroyConfirm(false)}
        onConfirm={() => destroyRoom()}
        title="Destroy Room?"
        message="This will permanently delete all messages and end the chat session. This action cannot be undone."
        confirmText="DESTROY"
        cancelText="CANCEL"
      />
    </>
  )
}

export default Page
