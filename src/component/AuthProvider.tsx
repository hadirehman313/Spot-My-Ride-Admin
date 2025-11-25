'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

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

  useEffect(() => {
    const uid = Cookies.get('uid')
    const email = Cookies.get('email')

    if (uid && email) {
      setIsAuthenticated(true)
      setUserData({ uid, email })
    } else {
      setIsAuthenticated(false)
      setUserData(null)
      if (window.location.pathname !== '/login') {
        router.replace('/login')
      }
    }
  }, [router])

  const logout = () => {
    Cookies.remove('uid')
    Cookies.remove('email')
    setIsAuthenticated(false)
    setUserData(null)
    router.replace('/login')
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
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}