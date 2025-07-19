import React from 'react';
import Spinner from '../../common/Spinner';

const GeminiReportModal = ({ report, isLoading, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-center text-slate-800">✨ Weekly Insights Report</h2>
                {isLoading ? (
                    <div className="flex justify-center items-center h-48 text-slate-500"><Spinner /> <span className="ml-4">Generating your report...</span></div>
                ) : (
                    <div className="prose max-w-none text-slate-600 whitespace-pre-wrap bg-slate-50 p-4 rounded-lg">{report}</div>
                )}
                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="px-6 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors">Close</button>
                </div>
            </div>
        </div>
    );
};

export default GeminiReportModal;