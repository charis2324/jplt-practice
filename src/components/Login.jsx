import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

function Login() {
    const [loginMode, setLoginMode] = useState(true)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const {user, login, register} = useContext(AuthContext);
    const handleLoginOrRegister = async () => {
        if(loginMode){
            const { data, error } = await login(email, password)
            if(error){
                setErrorMessage(error.message)
            }
        }
        else{
            const { data, error } = await register(email, password)
            if(error){
                setErrorMessage(error.message)
            }
        }
    }

    useEffect(()=>setErrorMessage(''), [loginMode])


    if (user) {
        return <Navigate to="/quiz" replace />;
    }

    return (
        <div className="flex flex-col max-w-md min-w-[320px] mx-auto p-8 bg-white rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{loginMode ? "Log In" : "Register"}</h2>
                <a className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out text-sm font-semibold cursor-pointer" onClick={()=>setLoginMode(!loginMode)}>{loginMode ? "Register" : "Log In"}</a>
            </div>
            <div className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                    <input
                        id="email"
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Your Password</label>
                    <input
                        id="password"
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>
            <p className="text-red-800 text-xs font-bold" >{errorMessage}</p>
            <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out" onClick={handleLoginOrRegister}>
                {loginMode ? "Log In" : "Register"}
            </button>
        </div>
    );
}

export default Login;