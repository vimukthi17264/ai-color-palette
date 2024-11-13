'use client'

import React, { useState, useEffect } from "react"
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import AuthNavbar from './auth-navbar'
import PublicNavbar from './navbar'

export function NavbarSwitcherComponent() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return <div className="h-16 border-b bg-background/95 backdrop-blur"></div> // Placeholder while loading
  }

  return user ? <AuthNavbar /> : <PublicNavbar />
}