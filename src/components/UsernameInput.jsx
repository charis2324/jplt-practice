import React, { useContext, useState } from 'react';
import { update_user_profile } from '../db';
import { AuthContext } from '../contexts/AuthContext';

function UsernameInput() {
  const [displayName, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const {user, fetchProfile} = useContext(AuthContext)
  const handleSubmit = async () => {
    if (displayName.trim() !== '' && user.id) {
      const {data, error} = await update_user_profile({
        display_name: displayName
      }, user.id);
      if(error){
        setErrorMessage(error.message)
      }else{
        await fetchProfile()
      }
    }else{
      setErrorMessage("Username cannot be empty")
    }
  };

  return (
    <div className="font-sans max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Enter Your Username</h1>
        <div>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-red-800 text-xs font-bold">{errorMessage}</p>
          <button 
            onClick={handleSubmit}
            className="w-full py-2 px-4 mt-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Submit
          </button>
        </div>
    </div>
  );
}

export default UsernameInput;