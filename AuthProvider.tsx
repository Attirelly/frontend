// components/auth-provider.tsx
'use client'

import { useEffect } from 'react'
import useAuthStore from './store/auth'


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore(state => state.initializeAuth)

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return <>{children}</>
}