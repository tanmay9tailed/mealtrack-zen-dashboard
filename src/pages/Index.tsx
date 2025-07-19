// This page is now handled by the main App component
import React from 'react';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-slate-800">MealTrack Application</h1>
        <p className="text-xl text-slate-500">This page should not be visible - redirecting to main app...</p>
      </div>
    </div>
  );
};

export default Index;
