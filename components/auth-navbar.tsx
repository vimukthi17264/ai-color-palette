'use client'

import React, { useState, useEffect } from "react"
import { Menu, X, PlusCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

export default function AuthNavbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const { setTheme } = useTheme()
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen)
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error logging out:", error)
      return
    }
    window.location.reload()
  }

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <img
                className="rounded-lg"
                src="https://static.vecteezy.com/system/resources/thumbnails/046/923/957/small_2x/cube-logo-geometric-design-black-and-white-box-logotype-company-trendy-techno-emblem-in-isometric-3d-style-vector.jpg"
                alt="Logo"
                width={32}
                height={32}
              />
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <NavLink href="/">Generate</NavLink>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/pricing">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Buy Credits
              </Button>
            </Link>
            <UserMenu user={user} signOut={signOut} />
            <ModeToggle />
          </div>
          <div className="md:hidden flex items-center">
            <Button onClick={toggleMobileMenu} size="icon" variant="ghost">
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink href="/" mobile onClick={toggleMobileMenu}>Dashboard</NavLink>
            <NavLink href="/projects" mobile onClick={toggleMobileMenu}>Projects</NavLink>
            <NavLink href="/analytics" mobile onClick={toggleMobileMenu}>Analytics</NavLink>
            <NavLink href="/settings" mobile onClick={toggleMobileMenu}>Settings</NavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <Avatar>
                  <AvatarImage src={user?.user_metadata.avatar_url} />
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium">{user?.user_metadata.full_name || user?.email}</div>
                <div className="text-sm font-medium text-gray-500">{user?.email}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Button className="w-full justify-start" variant="ghost" asChild>
                <Link href="/profile" onClick={toggleMobileMenu}>Your Profile</Link>
              </Button>
              <Button className="w-full justify-start" variant="ghost" asChild>
                <Link href="/settings" onClick={toggleMobileMenu}>Settings</Link>
              </Button>
              <Button className="w-full justify-start" variant="ghost" onClick={() => { signOut(); toggleMobileMenu(); }}>
                Sign out
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLink({ href, children, mobile, onClick }: { href: string; children: React.ReactNode; mobile?: boolean; onClick?: () => void }) {
  const baseClasses = "text-sm font-medium transition-colors hover:text-primary"
  const mobileClasses = "block px-3 py-2 rounded-md text-base font-medium"
  const desktopClasses = "text-muted-foreground hover:text-primary"

  return (
    <Link
      href={href}
      className={mobile ? `${baseClasses} ${mobileClasses}` : `${baseClasses} ${desktopClasses}`}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

function UserMenu({ user, signOut }: { user: User | null; signOut: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata.avatar_url} alt={user?.email || ''} />
            <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem asChild>
          <Link href="/account">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.user_metadata.full_name || user?.email}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}