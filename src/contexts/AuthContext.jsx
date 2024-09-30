import { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../db'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleSession = useCallback((session) => {
    if (session) {
      setUser(session.user)
    } else {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      handleSession(session)
      setLoading(false)
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(event)
        handleSession(session)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [handleSession])

  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }, [])

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }, [])

  const register = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }, [])

  const value = useMemo(() => ({
    user,
    login,
    logout,
    register,
    loading,
  }), [user, login, logout, register, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}