import React, { createContext, useState, useEffect, useCallback } from 'react'
import { supabase, get_user_profile } from '../db'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userLoading, setUserLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)

  const fetchProfile = async () => {
    if (user) {
      // console.log('Update profile')
      try {
        setProfileLoading(true);
        const userProfile = await get_user_profile(user.id)
        setProfile(userProfile)
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }finally{
        setProfileLoading(false);
      }
    } else {
      setProfile(null)
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setUserLoading(false)
    }

    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // console.log(event)
        const currentUser = session?.user
        setUser(currentUser ?? null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [user])

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
    profile,
    login,
    logout,
    register,
    fetchProfile,
    loading: userLoading || profileLoading,
    hasUserAndProfile: !!user && !!profile  
  }

  // useEffect(()=>{console.log(user)}, [user])
  // useEffect(()=>{console.log(profile)}, [profile])
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}