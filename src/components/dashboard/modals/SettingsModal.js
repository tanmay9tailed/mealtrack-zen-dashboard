import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, appId } from '../../../firebase/config';

const SettingsModal = ({ user, settings, onClose }) => {
    const [startDate, setStartDate] = useState(settings.startDate || '');
    const [mealTypes, setMealTypes] = useState(settings.mealTypes || ['Lunch', 'Dinner']);
    const [customMeal, setCustomMeal] = useState('');

    const handleAddMeal = () => {
        if (customMeal && !mealTypes.includes(customMeal)) {
            setMealTypes([...mealTypes, customMeal]);
            setCustomMeal('');
        }
    };

    const handleRemoveMeal = (mealToRemove) => {
        setMealTypes(mealTypes.filter(meal => meal !== mealToRemove));
    };

    const handleSave = async () => {
        if (!user) return;
        const settingsToSave = { startDate, mealTypes };
        try {
            const settingsRef = doc(db, `artifacts/${appId}/users/${user.uid}/settings/config`);
            await setDoc(settingsRef, settingsToSave);
            onClose(settingsToSave);
        } catch (error) {
            console.error("Error saving settings:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Settings</h2>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="startDate" className="block text-md font-semibold text-slate-700 mb-2">Subscription Start Date</label>
                        <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" />
                    </div>
                    <div>
                        <label className="block text-md font-semibold text-slate-700 mb-2">Tracked Meals</label>
                        <div className="space-y-2">{mealTypes.map(meal => (<div key={meal} className="flex items-center justify-between bg-slate-100 p-3 rounded-lg">
                            <span className="font-semibold text-slate-600">{meal}</span>
                            <button onClick={() => handleRemoveMeal(meal)} className="text-rose-500 hover:text-rose-700 font-bold text-xl">&times;</button>
                        </div>))}</div>
                        <div className="flex items-center space-x-2 mt-4">
                            <input type="text" value={customMeal} onChange={(e) => setCustomMeal(e.target.value)} placeholder="Add new meal type..." className="flex-grow p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" />
                            <button onClick={handleAddMeal} className="px-4 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-bold text-xl">+</button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                    <button onClick={() => onClose(null)} className="px-6 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors">Save Settings</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;