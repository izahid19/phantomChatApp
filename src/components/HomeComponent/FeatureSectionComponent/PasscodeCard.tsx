"use client"

import { useState, useEffect } from "react"

export function PasscodeCard() {
  const [passcodeDigits, setPasscodeDigits] = useState<string[]>(['', '', '', '', '', ''])
  const [passcodeComplete, setPasscodeComplete] = useState(false)
  const [passcodeWrong, setPasscodeWrong] = useState(false)
  const [passcodeIndex, setPasscodeIndex] = useState(0)
  const [passcodeAttempt, setPasscodeAttempt] = useState(0)
  const [passcodePhase, setPasscodePhase] = useState<'typing' | 'complete' | 'wrong' | 'waiting'>('waiting')
  
  useEffect(() => {
    let timeout: NodeJS.Timeout
    
    if (passcodePhase === 'waiting') {
      // Start typing after delay
      timeout = setTimeout(() => {
        setPasscodePhase('typing')
        setPasscodeIndex(0)
        setPasscodeDigits(['', '', '', '', '', ''])
        setPasscodeComplete(false)
        setPasscodeWrong(false)
      }, 500)
    } else if (passcodePhase === 'typing') {
      if (passcodeIndex < 6) {
        // Type next digit
        timeout = setTimeout(() => {
          const digit = Math.floor(Math.random() * 10).toString()
          setPasscodeDigits(prev => {
            const newDigits = [...prev]
            newDigits[passcodeIndex] = digit
            return newDigits
          })
          setPasscodeIndex(prev => prev + 1)
        }, 250 + Math.random() * 150)
      } else {
        // Alternate between success and wrong (every other attempt)
        if (passcodeAttempt % 2 === 0) {
          setPasscodeComplete(true)
          setPasscodePhase('complete')
        } else {
          setPasscodeWrong(true)
          setPasscodePhase('wrong')
        }
        setPasscodeAttempt(prev => prev + 1)
      }
    } else if (passcodePhase === 'complete') {
      // Reset after showing success
      timeout = setTimeout(() => {
        setPasscodePhase('waiting')
      }, 2500)
    } else if (passcodePhase === 'wrong') {
      // Reset after showing error
      timeout = setTimeout(() => {
        setPasscodePhase('waiting')
      }, 1500)
    }
    
    return () => clearTimeout(timeout)
  }, [passcodePhase, passcodeIndex, passcodeAttempt])

  return (
    <div className="feature-card p-6 md:p-8 bg-card-bg/50 border border-card-border rounded-2xl hover:border-purple-500 transition-all duration-300 group relative overflow-hidden shadow-sm dark:shadow-none">
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-foreground mb-3">Passcode Protected</h3>
        <p className="text-muted text-sm mb-6">6-digit passcode ensures only invited users can join your private room.</p>
        
        {/* Visual element - Animated Passcode */}
        <div className="bg-card-border/50 border border-card-border/50 rounded-xl p-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted text-sm">Enter Passcode</span>
            {passcodeComplete && (
              <span className="text-green-600 dark:text-green-400 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-600 dark:bg-green-400 rounded-full" />
                Access Granted
              </span>
            )}
            {passcodeWrong && (
              <span className="text-red-400 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                Access Denied
              </span>
            )}
          </div>
          <div className={`flex items-center justify-center gap-2 md:gap-3 ${passcodeWrong ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
            {passcodeDigits.map((digit, i) => (
              <div 
                key={i} 
                className={`w-8 h-10 md:w-10 md:h-12 bg-muted/10 border rounded-lg flex items-center justify-center transition-all duration-200 ${
                  passcodeComplete 
                    ? 'border-green-500 bg-green-500/10' 
                    : passcodeWrong
                      ? 'border-red-500 bg-red-500/10'
                      : digit 
                        ? 'border-blue-500 bg-blue-500/5' 
                        : 'border-muted'
                }`}
              >
                {digit ? (
                  <span className={`text-lg font-mono font-bold ${
                    passcodeComplete ? 'text-green-400' : passcodeWrong ? 'text-red-400' : 'text-foreground'
                  }`}>{digit}</span>
                ) : (
                  <span className="w-2 h-0.5 bg-muted-foreground/50 rounded" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
