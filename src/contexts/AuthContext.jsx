import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import { supabase, get_user_profile } from '../db'
import debounce from 'lodash.debounce'

export const AuthContext = createContext()

const LOCALSTORAGE_PROFILE_KEY = 'app_user_profile'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId) => {
    try {
      const userProfile = await get_user_profile(userId)
      setProfile(userProfile)
      localStorage.setItem(LOCALSTORAGE_PROFILE_KEY, JSON.stringify(userProfile))
      return userProfile
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }, [])

  const debouncedFetchProfile = useMemo(
    () => debounce(fetchProfile, 300),
    [fetchProfile]
  )

  const clearLocalStorage = useCallback(() => {
    localStorage.removeItem(LOCALSTORAGE_PROFILE_KEY)
  }, [])

  const handleSession = useCallback((session) => {
    if (session) {
      setUser(session.user)
      
      const storedProfile = localStorage.getItem(LOCALSTORAGE_PROFILE_KEY)
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile)
        if (parsedProfile.user_id === session.user.id) {
          setProfile(parsedProfile)
        } else {
          debouncedFetchProfile(session.user.id)
        }
      } else {
        debouncedFetchProfile(session.user.id)
      }
    } else {
      setUser(null)
      setProfile(null)
      clearLocalStorage()
    }
  }, [debouncedFetchProfile, clearLocalStorage])

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
    clearLocalStorage()
    return { error }  
  }, [clearLocalStorage])

  const register = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user) {
      const updatedProfile = await fetchProfile(user.id)
      if (updatedProfile) {
        setProfile(updatedProfile)
        localStorage.setItem(LOCALSTORAGE_PROFILE_KEY, JSON.stringify(updatedProfile))
      }
      return updatedProfile
    }
    return null
  }, [user, fetchProfile])

  const value = useMemo(() => ({
    user,
    profile,
    login,
    logout,
    register,
    loading,
    refreshProfile,
    hasUserAndProfile: !!user && !!profile  
  }), [user, profile, login, logout, register, loading, refreshProfile])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}