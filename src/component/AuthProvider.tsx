'use client'

import { createContext, useContext, useState } from 'react'
import { useRouter } from 'next/navigation'

interface UserData {
  uid: string
  email: string
}

interface AuthContextType {
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
  userData: UserData | null
  setUserData: (data: UserData | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const router = useRouter()

  const logout = () => {
    console.log('Logout function called')
    setIsAuthenticated(false)
    setUserData(null)
    console.log('Cleared authentication state and user data')
    console.log('Navigating to login page')
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userData, setUserData, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    console.error('useAuth must be used within an AuthProvider')
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}