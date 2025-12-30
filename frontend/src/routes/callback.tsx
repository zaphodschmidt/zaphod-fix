import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { usersMeRetrieveOptions } from '@/api/@tanstack/react-query.gen'
import { useAuth } from '@/contexts/AuthContext'

export const Route = createFileRoute('/callback')({
  component: Callback,
})

function Callback() {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  // After backend redirects here, the session cookie is set
  // So we can call /api/users/me/ to get the user info
  const { data: userData, error, isLoading } = useQuery({
    ...usersMeRetrieveOptions({}),
    retry: false,
  })

  useEffect(() => {
    if (userData) {
      // Store a session token (using a simple indicator since backend uses cookies)
      const token = `session_${Date.now()}`
      login(token, userData)
      // Redirect to home page
      navigate({ to: '/' })
    } else if (error) {
      // Redirect to login on error
      navigate({ to: '/login' })
    }
  }, [userData, error, login, navigate])

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        {isLoading ? (
          <>
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Completing authentication...</p>
          </>
        ) : error ? (
          <>
            <p className="text-destructive mb-4">Authentication failed</p>
            <p className="text-muted-foreground">Redirecting to login...</p>
          </>
        ) : (
          <>
            <p className="text-muted-foreground">Redirecting...</p>
          </>
        )}
      </div>
    </div>
  )
}

