// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, getProfile } from '../db'; // Import getProfile
import debounce from 'lodash.debounce';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // Add profile state
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const userProfile = await getProfile()
      setProfile(userProfile)
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

  const handleSession = useCallback((session) => {
    if (session) {
      setUser(session.user);
      // Fetch the profile after setting the user
      try {
        debouncedFetchProfile()
      } catch (error) {
        console.error('Error fetching profile:', error);
        setUser(null);
        setProfile(null);
      }
    } else {
      setUser(null);
      setProfile(null);
    }
  }, [debouncedFetchProfile]);

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        // For some reason an async version of handleSession with get stuck without throwing error at getProfile
        handleSession(session);
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(event);
        try {
          handleSession(session);
        } catch (error) {
          console.error('Error handling auth state change:', error);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [handleSession]);

  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  }, []);

  const register = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      try {
        const profileData = await getProfile();
        if (profileData) {
          setProfile(profileData);
        }
        return profileData;
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    }
    return null;
  }, [user]);

  const value = useMemo(() => ({
    user,
    profile,
    login,
    logout,
    register,
    refreshProfile,
    loading,
    hasUserAndProfile: !!user && !!profile
  }), [user, profile, login, logout, register, refreshProfile, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};