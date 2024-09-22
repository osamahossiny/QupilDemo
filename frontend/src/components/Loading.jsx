import React from 'react';

const Loading = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
            <p className="text-gray-600">Please wait a moment</p>
        </div>
    );
};

export default Loading;
