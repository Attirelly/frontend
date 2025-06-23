'use client'
import { useEffect } from 'react'
import { useRouter , useSearchParams } from 'next/navigation'
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function InstagramCallback() {
  const router = useRouter()

  useEffect(() => {
    const searchParams = useSearchParams();
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    const authenticate = async () => {
      try {
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/instagram`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, instagram_url: state })
        })

        if (!response.ok) throw new Error('Authentication failed')

        const { user_id } = await response.json()
        router.push(`/profile/${user_id}`)
      } catch (error: any) {
        console.error('Authentication error:', error)
        router.push(`/?error=${encodeURIComponent(error.message)}`)
      }
    }

    if (code && state) {
      authenticate()
    } else{
      router.push('/')
    }
  }, [router])

  return (
    <div className="loading-screen">
      <LoadingSpinner/>
      <h2>Authenticating with Instagram...</h2>
    </div>
  )
}
