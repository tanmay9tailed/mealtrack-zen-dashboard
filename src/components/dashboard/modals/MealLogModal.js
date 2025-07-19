import React, { useState, useEffect, useMemo } from 'react';
import { generateComplaintDraft } from '../../../services/geminiService';
import Spinner from '../../common/Spinner';

const MealLogModal = ({ date, settings, mealData, onClose, onSave }) => {
    const [log, setLog] = useState({});
    const [notes, setNotes] = useState('');
    const [generatedDraft, setGeneratedDraft] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const initialLog = mealData[date] || {};
        const populatedLog = {};
        settings.mealTypes.forEach(meal => {
            populatedLog[meal] = initialLog[meal] || null;
        });
        setLog(populatedLog);
        setNotes(initialLog.notes || '');
        setGeneratedDraft('');
    }, [date, mealData, settings]);

    const handleStatusChange = (meal, status) => {
        setLog(prevLog => ({ ...prevLog, [meal]: status }));
    };

    const handleSave = () => {
        onSave(date, { ...log, notes });
    };
    
    const handleGenerateDraft = async () => {
        if (!notes) {
            alert("Please provide some notes about the issue first.");
            return;
        }
        setIsGenerating(true);
        setGeneratedDraft('');

        const missedMeals = Object.entries(log)
            .filter(([_, status]) => status === 'not-delivered')
            .map(([meal, _]) => meal)
            .join(', ');

        const draft = await generateComplaintDraft(formattedDate, missedMeals, notes);
        setGeneratedDraft(draft);
        setIsGenerating(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedDraft).then(() => {
             alert('Draft copied to clipboard!');
        });
    };

    const formattedDate = useMemo(() => {
        const d = new Date(date + 'T00:00:00');
        return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }, [date]);

    const showAIAssistant = useMemo(() => Object.values(log).some(status => status === 'not-delivered'), [log]);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h3 className="text-2xl font-bold mb-6 text-center text-slate-800">{formattedDate}</h3>
                <div className="space-y-6">
                    {settings.mealTypes.map(meal => (
                        <div key={meal}>
                            <label className="text-lg font-semibold text-slate-700">{meal}</label>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <label className={`flex items-center justify-center p-4 rounded-lg cursor-pointer border-2 transition-all ${log[meal] === 'delivered' ? 'bg-emerald-50 border-emerald-500' : 'bg-slate-50 border-slate-200'}`}>
                                    <input type="radio" name={meal} value="delivered" checked={log[meal] === 'delivered'} onChange={() => handleStatusChange(meal, 'delivered')} className="sr-only" />
                                    <span className={`font-semibold ${log[meal] === 'delivered' ? 'text-emerald-700' : 'text-slate-600'}`}>✓ Delivered</span>
                                </label>
                                <label className={`flex items-center justify-center p-4 rounded-lg cursor-pointer border-2 transition-all ${log[meal] === 'not-delivered' ? 'bg-rose-50 border-rose-500' : 'bg-slate-50 border-slate-200'}`}>
                                    <input type="radio" name={meal} value="not-delivered" checked={log[meal] === 'not-delivered'} onChange={() => handleStatusChange(meal, 'not-delivered')} className="sr-only" />
                                    <span className={`font-semibold ${log[meal] === 'not-delivered' ? 'text-rose-700' : 'text-slate-600'}`}>✗ Not Delivered</span>
                                </label>
                            </div>
                        </div>
                    ))}
                    <div>
                        <label htmlFor="notes" className="text-md font-semibold text-slate-700">Notes (for missed meals)</label>
                        <textarea id="notes" rows="3" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full mt-2 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"></textarea>
                    </div>
                    {showAIAssistant && (
                        <div className="border-t border-slate-200 pt-4">
                            <button onClick={handleGenerateDraft} disabled={isGenerating} className="w-full flex justify-center items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none">
                                {isGenerating ? <Spinner /> : <span>✨ Suggest Complaint Draft</span>}
                            </button>
                            {generatedDraft && (
                                <div className="mt-4 p-4 bg-slate-100 rounded-lg">
                                    <h4 className="font-semibold mb-2 text-slate-700">Generated Draft:</h4>
                                    <p className="text-sm whitespace-pre-wrap text-slate-600">{generatedDraft}</p>
                                    <button onClick={copyToClipboard} className="mt-3 text-sm text-teal-600 hover:underline font-semibold">Copy to Clipboard</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                    <button onClick={onClose} className="px-6 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors">Save Log</button>
                </div>
            </div>
        </div>
    );
};

export default MealLogModal;