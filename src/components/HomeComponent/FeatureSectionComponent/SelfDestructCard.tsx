"use client"

import { useState, useEffect } from "react"

export function SelfDestructCard() {
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 600 // Reset to 10 minutes
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  // Calculate progress percentage
  const progressPercent = (timeLeft / 600) * 100

  return (
    <div className="feature-card p-6 md:p-8 bg-card-bg/50 border border-card-border rounded-2xl hover:border-purple-500 transition-all duration-300 group relative overflow-hidden shadow-sm dark:shadow-none">
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-foreground mb-3">Self-Destructing Messages</h3>
        <p className="text-muted text-sm mb-6">Messages vanish after 10 minutes of inactivity. No server logs, no message history, no traces left behind.</p>
        
        {/* LIVE Timer Visual */}
        <div className="bg-card-border/90 border border-card-border/50 rounded-xl p-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted text-sm">Time Remaining</span>
            <span className="text-muted text-xs flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${timeLeft < 60 ? 'bg-red-500 animate-pulse' : 'bg-green-600 dark:bg-green-500 animate-pulse'}`} />
              {timeLeft < 60 ? 'Deleting soon!' : 'Auto-delete'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-3xl font-bold font-mono transition-colors duration-300 ${
              timeLeft < 60 ? 'text-red-400' : 'text-green-600 dark:text-green-400'
            }`}>
              {formatTime(timeLeft)}
            </span>
            <div className="flex-1 h-2 bg-muted/20 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                  timeLeft < 60 ? 'bg-red-500' : 'bg-green-600 dark:bg-green-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          
          {/* Message preview that fades as timer decreases */}
          <div className="mt-4 space-y-2">
            <div 
              className="bg-muted/10 rounded-lg px-3 py-2 text-muted text-sm transition-opacity duration-500"
              style={{ opacity: Math.min(progressPercent / 100, 1) }}
            >
              Hey, this message will self-destruct! 💨
            </div>
            <div 
              className="bg-muted/10 rounded-lg px-3 py-2 text-muted text-sm transition-opacity duration-500"
              style={{ opacity: Math.min((progressPercent - 20) / 80, 1) }}
            >
              No one can read it after the timer ends.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
