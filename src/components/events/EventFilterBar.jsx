import React, { useState } from 'react';
import {
    Search,
    Tag,
    Monitor,
    Calendar,
    ChevronDown,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const COLLEGE_EVENT_TYPES = [
    'Seminar', 'Guest Lecture', 'Workshop', 'Symposium', 'Technical Event', 'Club Event', 'Department Event', 'Alumni Interaction', 'Other'
];

const ALUMNI_EVENT_TYPES = [
    'Hackathon', 'Coding Competition', 'Case Study Competition', 'Innovation Challenge', 'Technical Challenge', 'Company Workshop', 'Hiring Challenge', 'Industry Competition', 'Other'
];

const EventFilterBar = ({
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedMode,
    setSelectedMode,
    selectedStatus,
    setSelectedStatus,
    selectedDate,
    setSelectedDate
}) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [calendarViewDate, setCalendarViewDate] = useState(new Date());

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const handlePrevMonth = () => {
        setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 1));
    };

    const handleSelectDay = (dayNumber) => {
        const picked = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth(), dayNumber);
        setSelectedDate(picked);
        setSelectedStatus('custom');
        setIsCalendarOpen(false);
    };

    const handleClearDate = () => {
        setSelectedDate(null);
        setSelectedStatus('upcoming');
        setIsCalendarOpen(false);
    };

    const handleSelectShortcut = (type) => {
        setSelectedDate(null);
        setSelectedStatus(type);
        setIsCalendarOpen(false);
    };

    return (
        <div className="event-filters-bar mb-8">
            <div className="event-filters-grid">
                
                {/* Search Input */}
                <div className="search-control-container">
                    <Search size={20} className="absolute left-[18px] top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none z-10" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title, company, organizer, or venue..."
                        className="search-control-input"
                    />
                </div>

                {/* Type Dropdown */}
                <div className="filter-control-wrapper">
                    <Tag size={20} className={`absolute left-[18px] top-1/2 -translate-y-1/2 pointer-events-none z-10 ${selectedType !== 'All' ? 'text-[#2563EB]' : 'text-[#64748B]'}`} strokeWidth={1.8} />
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className={`filter-control-select ${selectedType !== 'All' ? 'active-filter' : ''}`}
                    >
                        <option value="All">Type: All</option>
                        <optgroup label="Industry Competitions">
                            {ALUMNI_EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </optgroup>
                        <optgroup label="College Events">
                            {COLLEGE_EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </optgroup>
                    </select>
                    <ChevronDown size={18} className={`absolute right-[18px] top-1/2 -translate-y-1/2 pointer-events-none z-10 ${selectedType !== 'All' ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
                </div>

                {/* Mode Dropdown */}
                <div className="filter-control-wrapper">
                    <Monitor size={20} className={`absolute left-[18px] top-1/2 -translate-y-1/2 pointer-events-none z-10 ${selectedMode !== 'All' ? 'text-[#2563EB]' : 'text-[#64748B]'}`} strokeWidth={1.8} />
                    <select
                        value={selectedMode}
                        onChange={(e) => setSelectedMode(e.target.value)}
                        className={`filter-control-select ${selectedMode !== 'All' ? 'active-filter' : ''}`}
                    >
                        <option value="All">Mode: All</option>
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                    <ChevronDown size={18} className={`absolute right-[18px] top-1/2 -translate-y-1/2 pointer-events-none z-10 ${selectedMode !== 'All' ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
                </div>

                {/* Interactive Calendar Date Picker */}
                <div className="filter-control-wrapper relative">
                    <button
                        type="button"
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                        className={`h-[56px] w-full pl-[48px] pr-[18px] bg-[#F8FAFC] border rounded-[14px] text-[16px] text-left transition-all box-border flex items-center justify-between cursor-pointer hover:bg-slate-100/70 ${
                            selectedDate || selectedStatus !== 'upcoming' 
                                ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB] font-semibold' 
                                : 'border-[#E2E8F0] text-[#0F172A] font-normal'
                        }`}
                    >
                        <Calendar size={20} className={`absolute left-[18px] top-1/2 -translate-y-1/2 pointer-events-none ${selectedDate || selectedStatus !== 'upcoming' ? 'text-[#2563EB]' : 'text-[#64748B]'}`} strokeWidth={1.8} />
                        <span className="truncate">
                            {selectedDate
                                ? selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                : selectedStatus === 'today'
                                    ? 'Today'
                                    : selectedStatus === 'this_week'
                                        ? 'This Week'
                                        : selectedStatus === 'past'
                                            ? 'Past Events'
                                            : selectedStatus === 'all'
                                                ? 'All Dates'
                                                : 'Select date'}
                        </span>
                    </button>

                    {/* Calendar Popover */}
                    {isCalendarOpen && (
                        <div className="absolute top-[64px] right-0 z-50 bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xl w-80 animate-fade-in">
                            <div className="flex items-center justify-between mb-3 px-1">
                                <button
                                    type="button"
                                    onClick={handlePrevMonth}
                                    className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <span className="font-bold text-sm text-[#0F172A]">
                                    {calendarViewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleNextMonth}
                                    className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#64748B] mb-2">
                                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                {Array.from({ length: getFirstDayOfMonth(calendarViewDate.getFullYear(), calendarViewDate.getMonth()) }).map((_, idx) => (
                                    <div key={`blank-${idx}`} className="h-8"></div>
                                ))}

                                {Array.from({ length: getDaysInMonth(calendarViewDate.getFullYear(), calendarViewDate.getMonth()) }).map((_, idx) => {
                                    const dayNum = idx + 1;
                                    const cellDate = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth(), dayNum);
                                    const today = new Date();
                                    const isToday = cellDate.toDateString() === today.toDateString();
                                    const isSelected = selectedDate && cellDate.toDateString() === selectedDate.toDateString();

                                    return (
                                        <button
                                            key={dayNum}
                                            type="button"
                                            onClick={() => handleSelectDay(dayNum)}
                                            className={`h-8 w-8 mx-auto rounded-lg flex items-center justify-center font-medium transition-all text-xs ${
                                                isSelected
                                                    ? 'bg-[#2563EB] text-white font-bold shadow-xs'
                                                    : isToday
                                                        ? 'border border-[#2563EB] text-[#2563EB] font-bold bg-blue-50/50'
                                                        : 'text-[#0F172A] hover:bg-blue-50 hover:text-[#2563EB]'
                                            }`}
                                        >
                                            {dayNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => handleSelectShortcut('today')}
                                        className="px-2 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-md text-[11px] font-medium transition-colors"
                                    >
                                        Today
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSelectShortcut('this_week')}
                                        className="px-2 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-md text-[11px] font-medium transition-colors"
                                    >
                                        This Week
                                    </button>
                                </div>

                                {(selectedDate || selectedStatus !== 'upcoming') && (
                                    <button
                                        type="button"
                                        onClick={handleClearDate}
                                        className="text-[11px] text-red-600 font-semibold hover:underline"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default EventFilterBar;
