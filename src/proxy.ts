import { NextRequest, NextResponse } from "next/server"
import { redis } from "./lib/redis"

export const proxy = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname

  // Skip verify page
  if (pathname.match(/^\/room\/[^/]+\/verify$/)) {
    return NextResponse.next()
  }

  // Allow the /room lobby page itself
  if (pathname === "/room") {
    return NextResponse.next()
  }

  const roomMatch = pathname.match(/^\/room\/([^/]+)$/)
  if (!roomMatch) return NextResponse.redirect(new URL("/", req.url))

  const roomId = roomMatch[1]

  const meta = await redis.hgetall<{ connected: string[]; createdAt: number; passcode: string }>(
    `meta:${roomId}`
  )

  if (!meta) {
    return NextResponse.redirect(new URL("/room?error=room-not-found", req.url))
  }

  const existingToken = req.cookies.get("x-auth-token")?.value

  // USER IS ALREADY AUTHENTICATED FOR THIS ROOM
  if (existingToken && meta.connected?.includes(existingToken)) {
    return NextResponse.next()
  }

  // USER IS NOT AUTHENTICATED - REDIRECT TO VERIFY PAGE
  return NextResponse.redirect(new URL(`/room/${roomId}/verify`, req.url))
}

export const config = {
  matcher: "/room/:path*",
}
