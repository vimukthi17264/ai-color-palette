import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function PrivatePage() {
  const supabase = await createClient()

  // Check if the user is authenticated
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData?.user) {
    console.error("Authentication error:", authError)
    redirect('/login')
    return null  // Exit early since the user is not authenticated
  }

  // Fetch the username from the profiles table
  let username = null
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('username')
      .eq('user_id', authData.user.id)    // Use user_id to match the authenticated user's ID
      .single()

    if (profileError) {
      console.error("Profile fetch error:", profileError)
    } else {
      username = profile?.username
      console.log("Fetched username:", username)
    }
  } catch (error) {
    console.error("Unexpected error fetching username:", error)
  }

  return (
    <>
      <p>Hello {authData.user.email}</p>
      <p>{username ? `Username: ${username}` : 'No username found'}</p>
    </>
  )
}
