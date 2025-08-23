import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display } from "next/font/google"
import { Source_Sans_3 } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { getUser } from '@/lib/dal'
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
})

export const metadata: Metadata = {
  title: "EduManage - Classroom Management System",
  description: "A comprehensive platform for students and professors to manage classrooms, activities, and grades",
  generator: "v0.app",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getUser()
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        <AuthProvider initialUser={user}>{children}</AuthProvider>
      </body>
    </html>
  )
}
