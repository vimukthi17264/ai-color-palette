import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

// Define the font object, specifying weights, subsets, or styles as needed
import { Inter } from 'next/font/google'
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import FeedbackCollector from "@/components/feedback-collector";
 
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export const metadata: Metadata = {
  title: "Tables | table generator",
  description: "Generate any type of table of your need for free",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
         >
        <Navbar/>
        {children}
        </ThemeProvider>
        <Toaster/>
      </body>
    </html>
  );
}
