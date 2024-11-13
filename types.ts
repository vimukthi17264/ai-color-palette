// types.ts
export interface User {
    id: string
    email?: string
    user_metadata: {
      avatar_url: string | null
    }
  }
  
  export interface Profile {
    username: string
  }
  
  export interface Tokens {
    balance: number
    purchased_tokens: number
    used_tokens: number
  }