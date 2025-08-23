"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface User {
  name: string
  role: "student" | "professor"
  email: string
}

interface UserContextType {
  user: User
  setUser: (user: User) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({
    name: "John Doe",
    role: "student", // Change this to "professor" to test professor view
    email: "john.doe@university.edu",
  })

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}
