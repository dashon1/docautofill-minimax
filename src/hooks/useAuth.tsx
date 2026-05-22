import { useState, useEffect, createContext, useContext } from 'react'
import { 
  LocalUser, 
  getCurrentUser, 
  loginUser, 
  logoutUser, 
  createUser 
} from '../lib/storage'

interface AuthContextType {
  user: LocalUser | null
  loading: boolean
  isDemoMode: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, name?: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    const user = loginUser(email, password)
    if (user) {
      setUser(user)
      return { error: null }
    }
    return { error: 'Invalid email or password' }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const user = createUser(email, password, name || email.split('@')[0])
      setUser(user)
      return { error: null }
    } catch (err) {
      return { error: 'Failed to create account' }
    }
  }

  const signOut = async () => {
    logoutUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, isDemoMode: false, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
