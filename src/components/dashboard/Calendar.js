import React, { useState, useMemo } from 'react';

const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const Calendar = ({ settings, mealData, onDayClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const today = useMemo(() => new Date(), []);
    const todayStr = getLocalDateString(today);
    const startDate = useMemo(() => settings.startDate ? new Date(settings.startDate + 'T00:00:00') : null, [settings.startDate]);

    const calendarGrid = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) { days.push({ key: `blank-${i}`, type: 'blank' }); }
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDate = new Date(year, month, day);
            const dateStr = getLocalDateString(dayDate);
            const isFuture = dayDate > today;
            const isBeforeStart = startDate && dayDate < startDate;
            const isDisabled = isFuture || isBeforeStart;
            days.push({ key: dateStr, type: 'day', day, dateStr, isDisabled, isToday: dateStr === todayStr, data: mealData[dateStr] });
        }
        return days;
    }, [currentDate, mealData, startDate, today, todayStr]);
    
    const changeMonth = (offset) => { setCurrentDate(prev => { const newDate = new Date(prev); newDate.setMonth(newDate.getMonth() + offset); return newDate; }); };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-200/80">
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">&lt;</button>
                <h2 className="text-xl font-bold text-slate-700">{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">&gt;</button>
            </div>
            <div className="grid grid-cols-7 text-center text-sm font-semibold text-slate-500 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7">
                {calendarGrid.map(cell => {
                    if (cell.type === 'blank') {
                        return <div key={cell.key} className="border-t border-l border-slate-100 h-28"></div>;
                    }
                    return (
                        <div 
                            key={cell.key} 
                            onClick={() => !cell.isDisabled && onDayClick(cell.dateStr)} 
                            className={`h-28 border-t border-l border-slate-100 p-2 flex flex-col relative transition-all duration-200 ${cell.isDisabled ? 'bg-slate-50 text-slate-400' : 'hover:bg-sky-50 cursor-pointer'}`}
                        >
                            <span className={`font-semibold text-sm ${cell.isToday ? 'bg-teal-500 text-white rounded-full w-7 h-7 flex items-center justify-center' : 'text-slate-600'}`}>{cell.day}</span>
                            {!cell.isDisabled && cell.data && (
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex justify-center items-end flex-wrap gap-1">
                                    {settings.mealTypes.map(meal => {
                                        const status = cell.data[meal];
                                        if (!status) return null;
                                        return (<span key={meal} className={`w-2.5 h-2.5 rounded-full ${status === 'delivered' ? 'bg-emerald-500' : 'bg-rose-500'}`} title={meal}></span>);
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;