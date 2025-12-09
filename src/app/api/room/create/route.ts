import { redis } from "@/lib/redis"
import { nanoid } from "nanoid"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const ROOM_TTL_SECONDS = 60 * 10 // 10 minutes

export async function POST() {
  try {
    const roomId = nanoid()
    // Generate a simple 6-digit numeric passcode
    const passcode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Generate token for the creator
    const token = nanoid()

    await redis.hset(`meta:${roomId}`, {
      connected: [token], // Add creator's token immediately
      createdAt: Date.now(),
      passcode,
    })

    await redis.expire(`meta:${roomId}`, ROOM_TTL_SECONDS)

    // Set cookie for the creator
    const cookieStore = await cookies()
    cookieStore.set("x-auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    })

    return NextResponse.json({ roomId, passcode })
  } catch (error) {
    console.error("Create room error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
