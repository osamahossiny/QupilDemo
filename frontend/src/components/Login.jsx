import React, { useEffect, useState } from 'react';
import { useLogin } from '../hooks/useLogin'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { login, isLoading, error, setError } = useLogin()
    const navigate = useNavigate()


    const handleSubmit = (e) => {
        e.preventDefault();
        const request = async () => {
            const logedIn = await login(username, password)
            console.log(logedIn);
            if (logedIn) {
                navigate('/home')
            }
          }
          request()
    };

    useEffect(()=>{
        if (error != ""){
            setError("")
        }
    },[username,password])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Login
                    </button>
                </form>
                {error && 
                    <label className="block text-sm mt-2 text-center font-medium text-red-700">{error}</label>
                }
            </div>
        </div>
    );
};

export default Login;
