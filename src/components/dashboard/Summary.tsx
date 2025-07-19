import React from 'react';

const Summary = ({ stats }: { stats: { delivered: number; missed: number; rate: number } }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-center items-center transform hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-md font-semibold text-slate-500 mb-2">Total Delivered</h3>
                <p className="text-5xl font-bold text-emerald-500">{stats.delivered}</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-center items-center transform hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-md font-semibold text-slate-500 mb-2">Total Missed</h3>
                <p className="text-5xl font-bold text-rose-500">{stats.missed}</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-center items-center transform hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-md font-semibold text-slate-500 mb-2">Delivery Rate</h3>
                <p className="text-5xl font-bold text-sky-500">{stats.rate}%</p>
            </div>
        </div>
    );
};

export default Summary;