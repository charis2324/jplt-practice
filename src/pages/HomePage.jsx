import {React, useState} from 'react';
import LoginCard from "../components/LoginCard";

function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-red-100 to-white px-4 sm:px-0">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-red-800 mb-2">日本語能力試験対策</h1>
                <p className="text-xl text-gray-700">JLPT Preparation App</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md w-full sm:w-[calc(100%-2rem)] md:w-full max-w-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Start Your JLPT Journey</h2>
                <p className="text-gray-600 mb-6">Prepare for success with our comprehensive practice tools and resources.</p>
                <LoginCard />
            </div>

            <div className="mt-8 text-center">
                <p className="text-gray-600">Available JLPT levels: N5, N4</p>
                <p className="text-gray-500 mt-2">By Charis</p>
            </div>

            <div className="absolute top-0 left-0 w-16 h-16 m-4">
                <svg viewBox="0 0 100 100" className="text-red-800 opacity-20">
                    <path d="M20,50 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0" fill="currentColor" />
                </svg>
            </div>
        </div>
    );
}

export default HomePage;