"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getUser } from "./dal"

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
  const [user, setUser] = useState<User | null>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const userData = await getUser()
      setUser(userData)
    }
   fetch()
   setIsLoading(false)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}