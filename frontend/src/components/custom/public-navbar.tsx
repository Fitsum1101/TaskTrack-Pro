'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

export function PublicNavbar() {
  const { theme, setTheme } = useTheme()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center group-hover:shadow-lg transition-shadow">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="font-bold text-lg text-foreground hidden sm:inline">TaskTrack</span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Documentation Link */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-secondary/50"
            >
              Docs
            </Link>
          </motion.div>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="size-5" />
            ) : (
              <Sun className="size-5 text-yellow-500" />
            )}
          </motion.button>

          {/* Login Button */}
          <Link href="/login">
            <Button 
              variant="ghost"
              className="text-sm"
            >
              Sign in
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
