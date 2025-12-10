"use client"

import { useState, useEffect, useRef } from "react"
import { Zap, Bell, PencilLine } from "lucide-react"

export function RealTimeCard() {
  // 5 different conversation sets (10 messages each)
  const allConversations = [
    [
      { sender: "them", text: "Hey! You there?" },
      { sender: "you", text: "Yeah, just joined!" },
      { sender: "them", text: "Need to share something private" },
      { sender: "you", text: "This chat is totally secure 🔒" },
      { sender: "them", text: "Perfect. Here's the info..." },
      { sender: "you", text: "Got it! Thanks" },
      { sender: "them", text: "Delete after reading ok?" },
      { sender: "you", text: "Already on it 🗑️" },
      { sender: "them", text: "Great. Chat ends in 10 mins" },
      { sender: "you", text: "No traces left behind 💨" },
    ],
    [
      { sender: "them", text: "Did you get the files?" },
      { sender: "you", text: "Just downloading now" },
      { sender: "them", text: "Check the second folder" },
      { sender: "you", text: "Found it! Opening..." },
      { sender: "them", text: "Delete after reading please" },
      { sender: "you", text: "Will do! No traces left 🔐" },
      { sender: "them", text: "Make sure no one sees" },
      { sender: "you", text: "I'm the only one here" },
      { sender: "them", text: "Perfect, thanks!" },
      { sender: "you", text: "Chat vanishing now ✨" },
    ],
    [
      { sender: "you", text: "Meeting tomorrow at 3?" },
      { sender: "them", text: "Yep, confirmed ✅" },
      { sender: "you", text: "Secret location same as before" },
      { sender: "them", text: "Got it, see you there" },
      { sender: "you", text: "Bring the documents" },
      { sender: "them", text: "Already packed 📁" },
      { sender: "you", text: "Don't tell anyone else" },
      { sender: "them", text: "Of course. This is between us" },
      { sender: "you", text: "This chat will self-destruct 💥" },
      { sender: "them", text: "Good. See you tomorrow" },
    ],
    [
      { sender: "them", text: "Is this channel secure?" },
      { sender: "you", text: "End-to-end encrypted 🔒" },
      { sender: "them", text: "No logs? No traces?" },
      { sender: "you", text: "Nothing. Completely anonymous" },
      { sender: "them", text: "How long until it deletes?" },
      { sender: "you", text: "10 minutes after we leave" },
      { sender: "them", text: "No server stores anything?" },
      { sender: "you", text: "Zero. It's all ephemeral" },
      { sender: "them", text: "Exactly what I needed!" },
      { sender: "you", text: "Welcome to Phantom Chat 👻" },
    ],
    [
      { sender: "you", text: "Password for the vault?" },
      { sender: "them", text: "It's 847291" },
      { sender: "you", text: "Got it, thanks!" },
      { sender: "them", text: "Change it after you enter" },
      { sender: "you", text: "Will do right away" },
      { sender: "them", text: "Good. Stay safe! 🛡️" },
      { sender: "you", text: "Deleting this message now" },
      { sender: "them", text: "Smart move" },
      { sender: "you", text: "Chat vanishes in 10m" },
      { sender: "them", text: "Perfect. Talk later 👋" },
    ],
  ]
  
  const [chatMessages, setChatMessages] = useState(allConversations[0])
  const [visibleMessages, setVisibleMessages] = useState<number[]>([])
  const [isThemTyping, setIsThemTyping] = useState(false)
  const [inputText, setInputText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [visibleMessages, isThemTyping])
  
  useEffect(() => {
    let messageIndex = 0
    let timeoutId: NodeJS.Timeout
    let currentConversation = chatMessages
    
    const runConversation = () => {
      if (messageIndex >= currentConversation.length) {
        // Pick a random conversation and restart
        timeoutId = setTimeout(() => {
          const randomIndex = Math.floor(Math.random() * allConversations.length)
          currentConversation = allConversations[randomIndex]
          setChatMessages(currentConversation)
          setVisibleMessages([])
          setInputText("")
          setIsThemTyping(false)
          messageIndex = 0
          runConversation()
        }, 3000)
        return
      }
      
      const msg = currentConversation[messageIndex]
      const currentIndex = messageIndex
      
      if (msg.sender === 'them') {
        // Show typing indicator
        setIsThemTyping(true)
        
        timeoutId = setTimeout(() => {
          setIsThemTyping(false)
          setVisibleMessages(prev => [...prev, currentIndex])
          messageIndex++
          timeoutId = setTimeout(runConversation, 1500)
        }, 1200)
        
      } else {
        // Type in input box character by character
        let i = 0
        const text = msg.text
        
        const typeNextChar = () => {
          if (i <= text.length) {
            setInputText(text.substring(0, i))
            i++
            timeoutId = setTimeout(typeNextChar, 70)
          } else {
            // "Send" the message - animate button
            setIsSending(true)
            timeoutId = setTimeout(() => {
              setIsSending(false)
              setInputText("")
              setVisibleMessages(prev => [...prev, currentIndex])
              messageIndex++
              timeoutId = setTimeout(runConversation, 1500)
            }, 300)
          }
        }
        
        timeoutId = setTimeout(typeNextChar, 500)
      }
    }
    
    timeoutId = setTimeout(runConversation, 1000)
    
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div className="feature-card md:col-span-2 p-6 md:p-8 bg-card-bg/50 border border-card-border rounded-2xl hover:border-purple-500 transition-all duration-300 group relative overflow-hidden shadow-sm dark:shadow-none">
      <div className="relative z-10 grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-3">Real-Time Messaging</h3>
          <p className="text-muted text-sm mb-6">Instant message delivery with live typing indicators. See when others are composing their thoughts.</p>
          
          {/* Feature highlights */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 bg-transparent border border-green-200 dark:border-green-800 shadow-sm rounded-md text-green-600 dark:text-green-400 text-xs flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-yellow-500" /> Instant
            </span>
            <span className="px-3 py-1.5 bg-transparent border border-green-200 dark:border-green-800 shadow-sm rounded-md text-green-600 dark:text-green-400 text-xs flex items-center gap-1.5">
              <Bell className="w-3 h-3 text-blue-500" /> Notifications
            </span>
            <span className="px-3 py-1.5 bg-transparent border border-green-200 dark:border-green-800 shadow-sm rounded-md text-green-600 dark:text-green-400 text-xs flex items-center gap-1.5">
              <PencilLine className="w-3 h-3 text-purple-500" /> Typing indicator
            </span>
          </div>
        </div>
        
        {/* Chat simulation */}
        <div className="bg-card-border/50 border border-card-border/50 rounded-xl overflow-hidden flex flex-col h-[280px]">
          
          {/* Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto scrollbar-hide space-y-3"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {chatMessages.map((msg, i) => (
              visibleMessages.includes(i) && (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'you' ? 'items-end' : 'items-start'}`}
                >
                  <div className="max-w-[90%]">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className={`text-xs font-bold ${msg.sender === 'you' ? 'text-green-600 dark:text-green-500' : 'text-blue-500'}`}>
                        {msg.sender === 'you' ? 'YOU' : 'anonymous-hawk'}
                      </span>
                      <span className="text-[10px] text-muted">Just now</span>
                    </div>
                    <p className="text-sm text-foreground">{msg.text}</p>
                  </div>
                </div>
              )
            ))}
            
            {visibleMessages.length === 0 && !isThemTyping && (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted text-sm">Start a conversation...</p>
              </div>
            )}
          </div>
          
          {/* Typing indicator - fixed above input */}
          <div className="px-4 h-6 flex items-center">
            {isThemTyping && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-500">anonymous-hawk</span>
                <span className="text-xs text-muted">is typing</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            )}
          </div>
          
          {/* Input */}
          <div className="p-3 pt-0 border-t border-card-border/50 bg-muted/5">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-500">{">"}</span>
                <input
                  type="text"
                  value={inputText}
                  placeholder="Type message..."
                  readOnly
                  className="w-full bg-muted/10 border border-muted/20 rounded px-3 py-2 pl-7 text-sm text-foreground placeholder:text-muted"
                />
              </div>
              <button className={`px-4 py-2 text-xs font-bold transition-all duration-150 ${
                isSending 
                  ? 'bg-green-600 dark:bg-green-500 text-white scale-95' 
                  : inputText 
                    ? 'bg-green-700 dark:bg-green-600 text-white' 
                    : 'bg-muted text-muted-foreground'
              }`}>
                SEND
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
