import { useContext, useState } from 'react';
import { setDisplayName } from '../db';
import { AuthContext } from '../contexts/AuthContext';
import LoadingIndicator from './LoadingIndicator';

function UsernameInput() {
  const [displayName, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { user, refreshProfile } = useContext(AuthContext)
  const handleSubmit = async () => {
    if (displayName.trim() !== '' && user.id) {
      try {
        setIsLoading(true)
        await setDisplayName(displayName.trim());
        await refreshProfile();
      }
      catch (error) {
        setErrorMessage(error.message)
      } finally {
        setIsLoading(false)
      }
    } else {
      setErrorMessage("Username cannot be empty")
    }
  };

  return (
    <div className="font-sans max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Enter Your Username</h1>
      <div>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-red-800 text-xs font-bold mb-4">{errorMessage}</p>
        {!isLoading ?
          (<button
            onClick={handleSubmit}
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Submit
          </button>) : (<LoadingIndicator />)
        }
      </div>
    </div>
  );
}

export default UsernameInput;