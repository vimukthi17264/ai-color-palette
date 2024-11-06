'use client'
import { createClient } from '@/utils/supabase/client'
import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
      <button formAction={signOut}>Signout</button>
    </form>
  )
}
async function signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
  }
  