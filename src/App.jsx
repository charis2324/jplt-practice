import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import { onAuthStateChange } from './auth';
import QuestionInstruction from './components/QuestionInstruction ';
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
  if(!currentUser){
    return <HomePage/>
  }else{
    return <QuestionInstruction/>
  }
}
export default App;