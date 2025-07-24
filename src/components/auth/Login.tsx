import React from 'react';

const Login = ({ onLogin }: { onLogin: () => void }) => {
    console.log("API KEY:", import.meta.env.VITE_API_KEY);
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-12">
                    <div className="inline-block p-4 bg-teal-500 rounded-full mb-4">
                        <span className="text-4xl text-white">🍽️</span>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-800">MealTrack</h1>
                    <p className="text-lg text-slate-500 mt-2">Log meals, get insights.</p>
                </div>
                
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-semibold text-slate-700 text-center mb-6">Welcome Back!</h2>
                    <button
                        onClick={onLogin}
                        className="w-full flex items-center justify-center px-6 py-3 bg-white border-2 border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300"
                    >
                        <div className="w-6 h-6 mr-4 flex items-center justify-center">
                           <span className="text-xl">G</span>
                        </div>
                        <span className="font-semibold text-slate-600">Sign in with Google</span>
                    </button>
                </div>

                <p className="text-center text-slate-400 text-sm mt-8">
                    Your privacy is important to us.
                </p>
            </div>
        </div>
    );
};

export default Login;