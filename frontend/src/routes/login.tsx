import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { usersGoogleInitiateRetrieveOptions } from '@/api/@tanstack/react-query.gen'
import { Button } from '@/components/ui/button'
import { IconBrandGoogle } from '@tabler/icons-react'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    // If already authenticated, redirect to home
    const token = sessionStorage.getItem('auth_token')
    if (token) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: Login,
})

function Login() {
  const { isAuthenticated } = useAuth()
  const { isLoading, error, refetch } = useQuery({
    ...usersGoogleInitiateRetrieveOptions({}),
    enabled: false, // Don't fetch automatically
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/'
    }
  }, [isAuthenticated])

  const handleLogin = async () => {
    try {
      const result = await refetch()
      if (result.data && 'authorization_url' in result.data) {
        // Redirect to Google OAuth
        window.location.href = (result.data as any).authorization_url
      }
    } catch (err) {
      console.error('Failed to initiate Google OAuth:', err)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <IconBrandGoogle className="w-10 h-10 text-primary" stroke={1.5} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            <span className="text-gradient">Welcome Back</span>
          </h1>
          <p className="text-muted-foreground">
            Sign in with your Google account to continue tracking your streaks
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              Failed to initiate login. Please try again.
            </div>
          )}

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-12 text-base font-medium"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <IconBrandGoogle className="w-5 h-5 mr-2" />
                Sign in with Google
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By signing in, you agree to our terms of service and privacy policy
          </p>
        </div>
      </div>
    </div>
  )
}