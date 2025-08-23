"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

import { getUser } from '@/lib/dal'

interface AuthContextType {
  user: User | null
  isLoading: boolean
}
interface User {
  id: string,
  username: string,
  email: string,
  role: string,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
    }
    setIsLoading(false)
  }, [])
  

  return <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>
}
