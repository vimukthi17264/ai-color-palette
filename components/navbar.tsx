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
                <div className="hidden md:flex space-x-2 text-gray-100 text-xs">
                    <Link href="/features" className="hover:text-indigo-200">Features</Link>
                    <Link href="/pricing" className="hover:text-indigo-200">Pricing</Link>
                    <Link href="/about" className="hover:text-indigo-200">About</Link>
                    <Link href="/contact" className="hover:text-indigo-200">Contact</Link>
                    <Link href="/faq" className="hover:text-indigo-200">FAQ</Link>

                </div>



                {/* CTA Button for Buy Credits */}
                <div className="hidden md:block">
                    <Link href={'/pricing'}>
                        <Button className="px-4 py-2 text-black">
                            <PlusIcon />
                            Credits
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle Button */}
                <button onClick={toggleMobileMenu} className="md:hidden text-gray-100">
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
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