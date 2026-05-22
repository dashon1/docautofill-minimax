import { createClient } from '@supabase/supabase-js'

// Hardcoded Supabase configuration for production
const supabaseUrl = "https://ftxadlakjhklmrfznciq.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0eGFkbGFramhrbG1yZnpuY2lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MzQ5MzcsImV4cCI6MjA2ODIxMDkzN30.rTcXYr3sIL9qklUCVlg1c5A8U3KNHS_oePP6YqbQ0qk"

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
