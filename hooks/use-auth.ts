import { useState, useEffect, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const getUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }, [supabase.auth])

  useEffect(() => {
    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (event === 'SIGNED_OUT') {
        router.push('/signin')
      } else if (event === 'SIGNED_IN' && !user) {
        router.push('/account')
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [getUser, router, supabase.auth, user]) // Added user to the dependency array

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    setLoading(false)
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    setLoading(false)
  }

  const signOut = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setLoading(false)
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
}
