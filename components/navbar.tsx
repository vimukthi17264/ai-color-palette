'use client'
import React, { useState } from "react"
import { Menu, X, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function PublicNavbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { setTheme } = useTheme()

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen)
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
                <NavLink href="/">Home</NavLink>
                <NavLink href="/features">Features</NavLink>
                <NavLink href="/pricing">Pricing</NavLink>
                <NavLink href="/about">About</NavLink>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/signin">
              <Button variant="outline">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
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

        {/* Mobile Menu Toggle Button */}
        <Button onClick={toggleMobileMenu} className="md:hidden" size={'icon'} variant={'ghost'}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink href="/" mobile onClick={toggleMobileMenu}>Home</NavLink>
            <NavLink href="/features" mobile onClick={toggleMobileMenu}>Features</NavLink>
            <NavLink href="/pricing" mobile onClick={toggleMobileMenu}>Pricing</NavLink>
            <NavLink href="/about" mobile onClick={toggleMobileMenu}>About</NavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <Button className="w-full" variant="outline" asChild>
                <Link href="/signin" onClick={toggleMobileMenu}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            </div>
            <div className="mt-3 px-2">
              <Button className="w-full" asChild>
                <Link href="/signup" onClick={toggleMobileMenu}>Sign Up</Link>
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