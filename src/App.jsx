import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import { onAuthStateChange } from './auth';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(null)
  console.log(currentUser)
  useEffect(
    () => {
      const unsubscribe = onAuthStateChange((user) => {
        setCurrentUser(user)
        setLoading(false)
      })
      return () => unsubscribe()
    }, []
  )
  return (
    !currentUser && <HomePage />
  )
}
export default App;