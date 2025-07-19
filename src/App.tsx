import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from './firebase/config';

import Dashboard from './components/dashboard/Dashboard';
import Login from './components/auth/Login';

export default function App() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Google login failed:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50">
                <p className="text-lg text-slate-500">Loading Application...</p>
            </div>
        );
    }

    return user ? <Dashboard user={user} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />;
}
