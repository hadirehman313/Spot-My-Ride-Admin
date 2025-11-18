'use client'

import { useAuth } from '@/component/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Cookies from 'js-cookie'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const uid = Cookies.get('uid')
    if (!uid || !isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Redirecting to login...</div>
  }

  return <>{children}</>
}