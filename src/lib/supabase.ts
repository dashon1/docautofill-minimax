import { createClient } from '@supabase/supabase-js'

// Hardcoded Supabase configuration for production
const supabaseUrl = "https://db.aimicrotechlink.com"
const supabaseAnonKey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc3NDk4MzI0MCwiZXhwIjo0OTMwNjU2ODQwLCJyb2xlIjoiYW5vbiJ9.rnJ-NTkbn0wkOXIudW6RdlWto61bAunBR8PbORDngUY"

// Create Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Never demo mode - always use real Supabase
export const isDemoMode = false

// Auth helper functions
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting user:', error)
    return null
  }
  return user
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.protocol}//${window.location.host}/auth/callback`
    }
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}
