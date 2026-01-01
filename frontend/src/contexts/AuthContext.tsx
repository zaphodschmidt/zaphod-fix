import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { usersMeRetrieveOptions, usersLogoutCreateMutation } from '@/api/@tanstack/react-query.gen'
import type { User } from '@/api'

const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_USER_KEY = 'auth_user'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => Promise<void>
  checkAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Get token from sessionStorage
  const getStoredToken = () => {
    return sessionStorage.getItem(AUTH_TOKEN_KEY)
  }

  // Get stored user from sessionStorage
  const getStoredUser = (): User | null => {
    const stored = sessionStorage.getItem(AUTH_USER_KEY)
    return stored ? JSON.parse(stored) : null
  }

  // Store token and user in sessionStorage
  const storeAuth = (token: string, userData: User) => {
    sessionStorage.setItem(AUTH_TOKEN_KEY, token)
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData))
  }

  // Clear auth from sessionStorage
  const clearAuth = () => {
    sessionStorage.removeItem(AUTH_TOKEN_KEY)
    sessionStorage.removeItem(AUTH_USER_KEY)
  }

  // Check authentication status using /api/users/me/
  const { data: meData, isLoading: isCheckingAuth, error } = useQuery({
    ...usersMeRetrieveOptions({}),
    enabled: !!getStoredToken() && isInitialized,
    retry: false,
  })

  // Logout mutation
  const logoutMutation = useMutation({
    ...usersLogoutCreateMutation({}),
    onSuccess: () => {
      clearAuth()
      setUser(null)
      queryClient.clear()
      navigate({ to: '/login' })
    },
    onError: () => {
      // Even if logout f  ails on server, clear local state
      clearAuth()
      setUser(null)
      queryClient.clear()
      navigate({ to: '/login' })
    },
  })

  // Initialize auth state on mount
  useEffect(() => {
    const storedToken = getStoredToken()
    const storedUser = getStoredUser()

    if (storedToken && storedUser) {
      setUser(storedUser)
    }
    setIsInitialized(true)
  }, [])

  // Update user state when meData changes
  useEffect(() => {
    if (meData) {
      setUser(meData)
      const token = getStoredToken()
      if (token) {
        storeAuth(token, meData)
      }
    } else if (error && isInitialized) {
      // If we have a token but the request failed, user is not authenticated
      const storedToken = getStoredToken()
      if (storedToken) {
        clearAuth()
        setUser(null)
      }
    }
  }, [meData, error, isInitialized])

  const login = (token: string, userData: User) => {
    storeAuth(token, userData)
    setUser(userData)
    // Refetch to ensure we have the latest user data
    queryClient.invalidateQueries({ queryKey: usersMeRetrieveOptions({}).queryKey })
  }

  const logout = async () => {
    await logoutMutation.mutateAsync({ body: { username: user?.username ?? '' } })
  }

  const checkAuth = () => {
    const storedToken = getStoredToken()
    if (storedToken) {
      queryClient.invalidateQueries({ queryKey: usersMeRetrieveOptions({}).queryKey })
    }
  }

  const value: AuthContextType = {
    user,
    isLoading: isCheckingAuth || !isInitialized,
    isAuthenticated: !!user && !!getStoredToken(),
    login,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

