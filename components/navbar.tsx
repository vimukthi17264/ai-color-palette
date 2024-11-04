'use client'
import React, { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { PlusIcon } from "@radix-ui/react-icons"

export default function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav>
      <div className="container mx-auto p-4 flex justify-between items-center">

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-2 text-xs">

          <Link href="/" className="hover:underline">Home</Link>
          
          <Link href="/pricing" className="hover:underline"></Link>
          <Link href="/faq" className="hover:underline">FAQ</Link>
        </div>
        {/* CTA Button for Buy Credits */}
        <div className="hidden md:block space-x-2">
          <Link href={'/pricing'} hidden>
            <Button>
              <PlusIcon />
              Credits
            </Button>
          </Link>
          <ModeToggle />
        </div>

        {/* Mobile Menu Toggle Button */}
        <Button onClick={toggleMobileMenu} className="md:hidden" size={'icon'} variant={'ghost'}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white bg-opacity-90 backdrop-blur-lg shadow-md border-t">
          <div className="container mx-auto p-4 space-y-4 text-gray-800">
            <Link href="/features" onClick={toggleMobileMenu} className="block hover:text-indigo-600">Features</Link>
            <Link href="/pricing" onClick={toggleMobileMenu} className="block hover:text-indigo-600">Pricing</Link>
            <Link href="/about" onClick={toggleMobileMenu} className="block hover:text-indigo-600">About</Link>
            <Link href="/contact" onClick={toggleMobileMenu} className="block hover:text-indigo-600">Contact</Link>
            <Button className="w-full">
              <Link href="/buy-credits" onClick={toggleMobileMenu}>Buy Credits</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}

import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
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
