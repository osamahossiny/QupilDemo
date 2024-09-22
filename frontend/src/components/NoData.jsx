import React from 'react';
import { Link } from 'react-router-dom';

const NoData = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">Sorry</h1>
            <p className="text-xl text-gray-600 mb-8">hmmm, There is no data to show.</p>
            
            <Link to="/home" className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors">
                Go Home
            </Link>
        </div>
    );
};

export default NoData;