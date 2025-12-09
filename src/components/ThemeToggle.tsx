"use client"

import { useTheme } from "@/hooks/use-theme"

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()

  if (!mounted) {
    return (
      <button className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center">
        <span className="opacity-0">🌙</span>
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-8 h-8 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  )
}
