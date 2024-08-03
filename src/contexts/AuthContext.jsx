import React, { createContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../db'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user
        setUser(currentUser ?? null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (!error) {
      setUser(data.user)
    }
    return { data, error }
  }, [])
  
  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
    }
    return { error }  
  }, [])

  const register = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }, [])

  const value = {
    user,
    login,
    logout,
    register,
    loading,
  }

  useEffect(()=>{console.log(user)}, [user])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}