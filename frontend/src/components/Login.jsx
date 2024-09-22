import React, { useEffect, useState } from 'react';
import { useLogin } from '../hooks/useLogin'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login, isLoading, error, setError } = useLogin()
    const navigate = useNavigate()


    const handleSubmit = (e) => {
        e.preventDefault();
        const request = async () => {
            const logedIn = await login(email, password)
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
    },[email,password])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                <Link to="/register" className=" text-blue-700 mt-2 block text-right hover:text-gray-500 hover:underline">
                    create an account
                </Link>
                {error && 
                    <label className="block text-sm mt-2 text-center font-medium text-red-700">{error}</label>
                }
            </div>
        </div>
    );
};

export default Login;
