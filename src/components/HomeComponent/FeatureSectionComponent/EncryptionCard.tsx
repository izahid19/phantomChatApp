"use client"

import { useState, useEffect } from "react"
import { Lock } from "lucide-react"

export function EncryptionCard() {
  const messages = [
    "Hey, meet me at 5pm?",
    "The password is 847291",
    "Don't tell anyone! 🤫",
    "This stays between us",
    "Delete after reading",
    "Top secret info inside",
  ]
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDecrypting, setIsDecrypting] = useState(true)
  const chars = "!@#$%^&*()_+-=[]{}|;:',.<>?/~`"
  
  useEffect(() => {
    const currentMessage = messages[currentMsgIndex]
    let revealedCount = 0
    let isRevealing = true
    let cancelled = false
    
    const generateScrambled = (revealed: number) => {
      return currentMessage.split('').map((char, i) => {
        if (char === ' ') return ' '
        if (i < revealed) return char
        return chars[Math.floor(Math.random() * chars.length)]
      }).join('')
    }
    
    // Start with scrambled
    setDisplayText(generateScrambled(0))
    setIsDecrypting(true)
    
    const interval = setInterval(() => {
      if (cancelled) return
      
      if (isRevealing) {
        revealedCount++
        setDisplayText(generateScrambled(revealedCount))
        
        if (revealedCount >= currentMessage.length) {
          isRevealing = false
          setIsDecrypting(false)
          setDisplayText(currentMessage)
          
          // Wait 2 seconds then start hiding
          setTimeout(() => {
            if (!cancelled) {
              const hideInterval = setInterval(() => {
                if (cancelled) {
                  clearInterval(hideInterval)
                  return
                }
                revealedCount--
                if (revealedCount <= 0) {
                  clearInterval(hideInterval)
                  // Move to next message
                  setCurrentMsgIndex((prev) => (prev + 1) % messages.length)
                } else {
                  setDisplayText(generateScrambled(revealedCount))
                  setIsDecrypting(true)
                }
              }, 40)
            }
          }, 2000)
        }
      }
    }, 60)
    
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [currentMsgIndex])

  return (
    <div className="feature-card p-6 md:p-8 bg-card-bg/50 border border-card-border rounded-2xl hover:border-purple-500 transition-all duration-300 group relative overflow-hidden shadow-sm dark:shadow-none">
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-foreground mb-3">End-to-End Encryption</h3>
        <p className="text-muted text-sm mb-6">Your messages are encrypted before leaving your device. Not even we can read them.</p>
        
        {/* Visual element - Live encryption/decryption */}
        <div className="bg-card-border/50 border border-card-border/50 rounded-xl p-4 mt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-muted/20 rounded-lg flex items-center justify-center">
              <Lock className={`w-5 h-5 transition-colors duration-300 ${isDecrypting ? 'animate-pulse text-yellow-500' : 'text-green-600 dark:text-green-500'}`} />
            </div>
            <div>
              <div className="text-foreground text-sm font-medium">AES-256 Encryption</div>
              <div className="text-muted text-xs flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isDecrypting ? 'bg-yellow-500 animate-pulse' : 'bg-green-600 dark:bg-green-500'}`} />
                {isDecrypting ? 'Decrypting...' : 'Decrypted'}
              </div>
            </div>
          </div>
          
          {/* Animated encrypted/decrypted message */}
          <div className="bg-muted/10 rounded-lg px-4 py-3 font-mono text-sm">
            <div className="text-muted text-xs mb-2">Message:</div>
            <div className={`transition-colors duration-300 ${isDecrypting ? 'text-green-400' : 'text-green-950 dark:text-foreground'}`}>
              {displayText}
            </div>
          </div>
          
          <div className="flex gap-2 mt-3">
            <span className="px-2 py-1 bg-transparent border border-green-200 dark:border-green-800 shadow-sm text-green-600 dark:text-green-400 text-sm flex items-center gap-1 rounded-md">
              <span className="w-1.5 h-1.5 bg-green-600 dark:bg-green-400 rounded-full" />
              Encrypted
            </span>
            <span className="px-2 py-1 bg-transparent border border-green-200 dark:border-green-800 shadow-sm text-green-600 dark:text-green-400 text-sm flex items-center gap-1 rounded-md">
              <span className="w-1.5 h-1.5 bg-green-600 dark:bg-green-400 rounded-full" />
              Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
