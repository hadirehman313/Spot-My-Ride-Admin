'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Check localStorage when the app loads
  useEffect(() => {
    const uid = localStorage.getItem('uid')
    const email = localStorage.getItem('email')
    console.log('Checking localStorage on app load:', { uid, email })
    if (uid && email) {
      console.log('Data found in localStorage, setting isAuthenticated to true')
      setIsAuthenticated(true)
    } else {
      console.log('No valid data found in localStorage')
      setIsAuthenticated(false)
    }
  }, [])

  const logout = () => {
    console.log('Logout function called')
    setIsAuthenticated(false)
    console.log('Removing uid and email from localStorage')
    localStorage.removeItem('uid')
    localStorage.removeItem('email')
    console.log('Navigating to login page')
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
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