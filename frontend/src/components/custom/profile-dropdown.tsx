'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  User,
  Settings,
  LogOut,
  User2,
  Bell,
  Shield,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'

export function ProfileDropdown() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) return null

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Avatar className="size-8 cursor-pointer">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </Button>
      </DropdownMenuTrigger>
      <AnimatePresence>
        <DropdownMenuContent align="end" className="w-56">
          {/* User Info Section */}
          <div className="px-2 py-1.5">
            <p className="text-sm font-semibold text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>

          <DropdownMenuSeparator />

          {/* Menu Items */}
          <DropdownMenuItem className="cursor-pointer gap-2">
            <User2 className="size-4" />
            <span>View Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer gap-2">
            <Settings className="size-4" />
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer gap-2">
            <Bell className="size-4" />
            <span>Notifications</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer gap-2">
            <Shield className="size-4" />
            <span>Security</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer gap-2 text-red-600 focus:bg-red-500/10 focus:text-red-600"
          >
            <LogOut className="size-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </AnimatePresence>
    </DropdownMenu>
  )
}
