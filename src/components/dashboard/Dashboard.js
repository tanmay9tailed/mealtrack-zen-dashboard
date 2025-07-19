import React, { useState, useEffect, useMemo } from 'react';
import { doc, getDoc, setDoc, onSnapshot, collection, query } from 'firebase/firestore';
import { db, appId } from '../../firebase/config';
import { generateWeeklyReport } from '../../services/geminiService';

import Navbar from './Navbar';
import Summary from './Summary';
import Calendar from './Calendar';
import SettingsModal from './modals/SettingsModal';
import MealLogModal from './modals/MealLogModal';
import GeminiReportModal from './modals/GeminiReportModal';

const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const Dashboard = ({ user, onLogout }) => {
    const [settings, setSettings] = useState({ startDate: getLocalDateString(new Date()), mealTypes: ['Lunch', 'Dinner'] });
    const [mealData, setMealData] = useState({});
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isMealLogOpen, setIsMealLogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [weeklyReport, setWeeklyReport] = useState('');
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    useEffect(() => {
        if (!user) return;
        const fetchSettings = async () => {
            const settingsRef = doc(db, `artifacts/${appId}/users/${user.uid}/settings/config`);
            const docSnap = await getDoc(settingsRef);
            if (docSnap.exists()) { setSettings(docSnap.data()); } else { setIsSettingsOpen(true); }
            setIsLoading(false);
        };
        fetchSettings();
        const dataCollectionPath = `artifacts/${appId}/users/${user.uid}/meals`;
        const q = query(collection(db, dataCollectionPath));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = {};
            querySnapshot.forEach((doc) => { data[doc.id] = doc.data(); });
            setMealData(data);
        });
        return () => unsubscribe();
    }, [user]);
    
    const handleSettingsClose = (newSettings) => { if (newSettings) { setSettings(newSettings); } setIsSettingsOpen(false); };
    const handleDayClick = (dateStr) => { setSelectedDate(dateStr); setIsMealLogOpen(true); };
    const handleMealLogSave = async (date, dataToSave) => {
        if (!user) return;
        try {
            const docRef = doc(db, `artifacts/${appId}/users/${user.uid}/meals`, date);
            await setDoc(docRef, dataToSave, { merge: true });
            setIsMealLogOpen(false);
            setSelectedDate(null);
        } catch (error) { console.error("Error saving meal log:", error); }
    };

    const handleGenerateReport = async () => {
        setIsReportModalOpen(true);
        setIsGeneratingReport(true);
        setWeeklyReport('');

        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);

        const last7DaysData = Object.entries(mealData)
            .filter(([dateStr, _]) => {
                const d = new Date(dateStr);
                return d >= lastWeek && d <= today;
            })
            .map(([date, data]) => ({ date, ...data }));
        
        const report = await generateWeeklyReport(last7DaysData);
        setWeeklyReport(report);
        setIsGeneratingReport(false);
    };
    
    const summaryStats = useMemo(() => {
        let delivered = 0, missed = 0;
        Object.values(mealData).forEach(dayData => {
            settings.mealTypes.forEach(meal => {
                if (dayData[meal] === 'delivered') delivered++;
                if (dayData[meal] === 'not-delivered') missed++;
            });
        });
        const total = delivered + missed;
        const rate = total > 0 ? Math.round((delivered / total) * 100) : 0;
        return { delivered, missed, rate };
    }, [mealData, settings.mealTypes]);

    if (isLoading) { return <div className="flex justify-center items-center h-screen bg-slate-50 text-slate-500">Loading your dashboard...</div>; }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar user={user} onLogout={onLogout} />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
                        <p className="text-slate-500 mt-1">Here's your meal delivery overview.</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button onClick={() => setIsSettingsOpen(true)} className="px-4 py-2 bg-white border border-slate-300 text-slate-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors">Settings</button>
                        <button onClick={handleGenerateReport} className="px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                           ✨ Weekly Insights
                        </button>
                    </div>
                </div>
                <Summary stats={summaryStats} />
                <Calendar settings={settings} mealData={mealData} onDayClick={handleDayClick} />
            </main>
            {isSettingsOpen && <SettingsModal user={user} settings={settings} onClose={handleSettingsClose} />}
            {isMealLogOpen && <MealLogModal date={selectedDate} settings={settings} mealData={mealData} onClose={() => setIsMealLogOpen(false)} onSave={handleMealLogSave} />}
            {isReportModalOpen && <GeminiReportModal report={weeklyReport} isLoading={isGeneratingReport} onClose={() => setIsReportModalOpen(false)} />}
        </div>
    );
};

export default Dashboard;