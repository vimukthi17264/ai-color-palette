// components/Footer.tsx

import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="py-6">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-muted-foreground ">

                {/* Logo */}
                <div className="mb-4 md:mb-0 flex flex-row space-x-3">
                    <Link href="/">
                        <img
                            className="rounded-lg"
                            src="https://static.vecteezy.com/system/resources/thumbnails/046/923/957/small_2x/cube-logo-geometric-design-black-and-white-box-logotype-company-trendy-techno-emblem-in-isometric-3d-style-vector.jpg"
                            alt="Logo"
                            width={32}
                            height={32}
                        />
                    </Link>
                    {/* Copyright */}
                    <div className="text-sm py-2">
                        &copy; {new Date().getFullYear()} My Company. All rights reserved.
                    </div>
                </div>
                {/* Social Media Icons */}
                <div className="flex space-x-4">
                    
                </div>
                {/* Links */}
                <div className="flex space-x-6 mb-4 md:mb-0 text-xs">
                    <Link href="/policy" className="hover:underline">
                        Privacy policy
                    </Link>
                    <Link href="/terms" className="hover:underline">
                        Terms & conditions
                    </Link>
                </div>
            </div>
        </footer>
    );
}