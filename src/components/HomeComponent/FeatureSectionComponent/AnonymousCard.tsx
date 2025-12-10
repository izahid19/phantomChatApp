"use client"

import { useState, useEffect } from "react"

export function AnonymousCard() {
  const usernames = [
    "anonymous-wolf-x7k2m",
    "anonymous-hawk-p3n9q",
    "anonymous-bear-j5t8w",
    "anonymous-shark-r2v6y",
  ]
  const [currentUsernameIndex, setCurrentUsernameIndex] = useState(0)
  const [typedName, setTypedName] = useState("")
  const [isTypingName, setIsTypingName] = useState(true)
  
  useEffect(() => {
    let charIndex = 0
    let usernameIndex = 0
    let isDeleting = false
    let cancelled = false
    
    const typeChar = () => {
      if (cancelled) return
      
      const current = usernames[usernameIndex]
      
      if (!isDeleting) {
        // Typing
        if (charIndex <= current.length) {
          setTypedName(current.slice(0, charIndex))
          setIsTypingName(charIndex < current.length)
          charIndex++
          setTimeout(typeChar, 80 + Math.random() * 40)
        } else {
          // Finished typing, wait then delete
          setIsTypingName(false)
          setTimeout(() => {
            isDeleting = true
            typeChar()
          }, 2000)
        }
      } else {
        // Deleting
        if (charIndex > 0) {
          charIndex--
          setTypedName(current.slice(0, charIndex))
          setIsTypingName(true)
          setTimeout(typeChar, 40)
        } else {
          // Finished deleting, move to next username
          isDeleting = false
          usernameIndex = (usernameIndex + 1) % usernames.length
          setCurrentUsernameIndex(usernameIndex)
          setTimeout(typeChar, 300)
        }
      }
    }
    
    const timeout = setTimeout(typeChar, 500)
    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="feature-card p-6 md:p-8 bg-card-bg/50 border border-card-border rounded-2xl hover:border-purple-500 transition-all duration-300 group relative overflow-hidden shadow-sm dark:shadow-none">
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-foreground mb-3">Completely Anonymous</h3>
        <p className="text-muted text-sm mb-6">No accounts, no sign-ups, no tracking. Your identity is randomly generated for each session.</p>
        
        {/* Visual element - Username Generator */}
        <div className="bg-card-border/50 border border-card-border/50 rounded-xl p-4 mt-4">
          {/* Username input simulation */}
          <div className="mb-4">
            <div className="text-muted text-xs mb-2">Your generated identity</div>
            <div className="bg-muted/10 rounded-lg px-4 py-3">
              <div className="flex items-center h-6">
                <span className="text-foreground font-medium font-mono">{typedName}</span>
                {isTypingName && (
                  <span className="w-0.5 h-5 bg-blue-400 ml-0.5 animate-pulse" />
                )}
              </div>
            </div>
          </div>
          
          {/* Feature badges */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-transparent border border-green-200 dark:border-green-800 shadow-sm text-green-600 dark:text-green-400 text-xs font-medium rounded-md">
              <span className="w-1.5 h-1.5 bg-green-600 dark:bg-green-400 rounded-full" />
              No Sign-up
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-transparent border border-green-200 dark:border-green-800 shadow-sm text-green-600 dark:text-green-400 text-xs font-medium rounded-md">
              <span className="w-1.5 h-1.5 bg-green-600 dark:bg-green-400 rounded-full" />
              No Tracking
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-transparent border border-green-200 dark:border-green-800 shadow-sm text-green-600 dark:text-green-400 text-xs font-medium rounded-md">
              <span className="w-1.5 h-1.5 bg-green-600 dark:bg-green-400 rounded-full" />
              No Cookies
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
