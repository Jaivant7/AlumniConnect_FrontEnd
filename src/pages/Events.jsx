import { useState, useContext, useEffect } from 'react';
import api from '../utils/api';
import {
    Calendar,
    Plus,
    Sparkles,
    GraduationCap,
    Award,
    RotateCcw
} from 'lucide-react';
import AuthContext from '../context/AuthContext';

import EventCard from '../components/events/EventCard';
import EventFilterBar from '../components/events/EventFilterBar';
import EventDetailsModal from '../components/events/EventDetailsModal';
import EventFormModal from '../components/events/EventFormModal';

const COLLEGE_EVENT_TYPES = [
    'Seminar', 'Guest Lecture', 'Workshop', 'Symposium', 'Technical Event', 'Club Event', 'Department Event', 'Alumni Interaction', 'Other'
];
const ALUMNI_EVENT_TYPES = [
    'Hackathon', 'Coding Competition', 'Case Study Competition', 'Innovation Challenge', 'Technical Challenge', 'Company Workshop', 'Hiring Challenge', 'Industry Competition', 'Other'
];

const Events = () => {
    const { user } = useContext(AuthContext);

    // Main Events State
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter Controls State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedMode, setSelectedMode] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('upcoming');
    const [selectedDate, setSelectedDate] = useState(null);

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingEventId, setEditingEventId] = useState(null);
    const [selectedEventDetails, setSelectedEventDetails] = useState(null);

    // Form State for Event Creation / Editing
    const defaultCategory = user.role === 'alumni' ? 'INDUSTRY' : 'COLLEGE';
    const defaultTypes = user.role === 'alumni' ? ALUMNI_EVENT_TYPES : COLLEGE_EVENT_TYPES;

    const [formCategory, setFormCategory] = useState(defaultCategory);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventType: defaultTypes[0],
        organizerName: user.role === 'student' ? `${user.name}'s Dept` : '',
        companyName: user.company || '',
        companyLogo: '',
        bannerImageUrl: '',
        eventDate: '',
        startTime: '',
        endTime: '',
        location: '',
        mode: 'Offline',
        eligibilityYears: ['All'],
        eligibilityDepts: ['Any Department'],
        minCgpa: '',
        otherEligibility: '',
        skillsRequired: '',
        maxParticipants: '',
        registrationDeadline: '',
        registrationLink: '',
        contactInformation: user.email || '',
    });

    useEffect(() => {
        fetchEvents();
    }, [selectedCategory, selectedType, selectedMode, selectedStatus, selectedDate]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const params = new URLSearchParams();

            if (selectedCategory !== 'all') params.append('category', selectedCategory);
            if (selectedType !== 'All') params.append('eventType', selectedType);
            if (selectedMode !== 'All') params.append('mode', selectedMode);

            if (selectedDate) {
                const year = selectedDate.getFullYear();
                const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const day = String(selectedDate.getDate()).padStart(2, '0');
                params.append('date', `${year}-${month}-${day}`);
            } else if (selectedStatus !== 'all') {
                params.append('status', selectedStatus);
            }

            const res = await api.get(`/api/events?${params.toString()}`, config);
            setEvents(res.data);
        } catch (error) {
            console.error("Error fetching events", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSelectedType('All');
        setSelectedMode('All');
        setSelectedStatus('upcoming');
        setSelectedDate(null);
    };

    const handleOpenCreateModal = () => {
        setEditingEventId(null);
        const cat = user.role === 'alumni' ? 'INDUSTRY' : 'COLLEGE';
        const types = cat === 'INDUSTRY' ? ALUMNI_EVENT_TYPES : COLLEGE_EVENT_TYPES;
        setFormCategory(cat);
        setFormData({
            title: '',
            description: '',
            eventType: types[0],
            organizerName: user.role === 'student' ? `${user.name}'s Dept` : '',
            companyName: user.company || '',
            companyLogo: '',
            bannerImageUrl: '',
            eventDate: '',
            startTime: '',
            endTime: '',
            location: '',
            mode: 'Offline',
            eligibilityYears: ['All'],
            eligibilityDepts: ['Any Department'],
            minCgpa: '',
            otherEligibility: '',
            skillsRequired: '',
            maxParticipants: '',
            registrationDeadline: '',
            registrationLink: '',
            contactInformation: user.email || '',
        });
        setIsCreateModalOpen(true);
    };

    const handleOpenEditModal = (ev) => {
        setEditingEventId(ev._id);
        setFormCategory(ev.eventCategory || 'COLLEGE');
        setFormData({
            title: ev.title || '',
            description: ev.description || '',
            eventType: ev.eventType || 'Other',
            organizerName: ev.organizerName || '',
            companyName: ev.companyName || '',
            companyLogo: ev.companyLogo || '',
            bannerImageUrl: ev.bannerImageUrl || '',
            eventDate: ev.eventDate ? new Date(ev.eventDate).toISOString().split('T')[0] : '',
            startTime: ev.startTime || '',
            endTime: ev.endTime || '',
            location: ev.location || '',
            mode: ev.mode || 'Offline',
            eligibilityYears: ev.eligibility?.years || ['All'],
            eligibilityDepts: ev.eligibility?.departments || ['Any Department'],
            minCgpa: ev.eligibility?.minCgpa ? String(ev.eligibility.minCgpa) : '',
            otherEligibility: ev.eligibility?.otherRequirements || '',
            skillsRequired: Array.isArray(ev.skillsRequired) ? ev.skillsRequired.join(', ') : '',
            maxParticipants: ev.maxParticipants ? String(ev.maxParticipants) : '',
            registrationDeadline: ev.registrationDeadline ? new Date(ev.registrationDeadline).toISOString().split('T')[0] : '',
            registrationLink: ev.registrationLink || '',
            contactInformation: ev.contactInformation || '',
        });
        setIsCreateModalOpen(true);
    };

    const handleFormSubmitSuccess = (savedEvent, isEdit) => {
        if (isEdit) {
            setEvents(events.map(ev => ev._id === savedEvent._id ? savedEvent : ev));
            if (selectedEventDetails?._id === savedEvent._id) setSelectedEventDetails(savedEvent);
        } else {
            setEvents([savedEvent, ...events]);
        }
    };

    const handleRegisterToggle = async (eventId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await api.put(`/api/events/${eventId}/register`, {}, config);

            setEvents(events.map(ev => ev._id === eventId ? res.data : ev));
            if (selectedEventDetails && selectedEventDetails._id === eventId) {
                setSelectedEventDetails(res.data);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Action failed');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await api.delete(`/api/events/${eventId}`, config);
            setEvents(events.filter(ev => ev._id !== eventId));
            if (selectedEventDetails?._id === eventId) {
                setSelectedEventDetails(null);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Delete failed');
        }
    };

    const filteredEvents = events.filter((ev) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            ev.title.toLowerCase().includes(q) ||
            ev.description.toLowerCase().includes(q) ||
            (ev.companyName && ev.companyName.toLowerCase().includes(q)) ||
            (ev.organizerName && ev.organizerName.toLowerCase().includes(q)) ||
            ev.location.toLowerCase().includes(q) ||
            ev.eventType.toLowerCase().includes(q)
        );
    });

    return (
        <div className="min-h-screen bg-gray-50/70 body-font">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

                {/* Hero Section */}
                <div className="mb-8 animate-fade-in flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase mb-3 text-blue-100 border border-white/20">
                            <Sparkles size={14} className="text-yellow-300" /> Academic & Industry Portal
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold heading-font tracking-tight text-white">
                            Campus & Industry Events Hub
                        </h2>
                        <p className="text-blue-100 text-sm sm:text-base mt-2 leading-relaxed">
                            Discover campus seminars hosted by students and hiring hackathons & tech competitions posted by alumni.
                        </p>
                    </div>

                    <div className="relative z-10 flex-shrink-0">
                        <button
                            onClick={handleOpenCreateModal}
                            className="px-5 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm rounded-xl shadow-sm transition-all duration-200 flex items-center gap-2"
                        >
                            <Plus size={18} /> Post New Event
                        </button>
                    </div>
                </div>

                {/* Category Filter Tabs */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="inline-flex flex-wrap p-1.5 bg-gray-200/70 rounded-2xl gap-1.5 border border-gray-200 max-w-full">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                                selectedCategory === 'all'
                                    ? 'bg-white text-blue-600 shadow-sm border border-gray-200/80 font-bold'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                            }`}
                        >
                            <Calendar size={16} /> All Events
                        </button>

                        <button
                            onClick={() => setSelectedCategory('college')}
                            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                                selectedCategory === 'college'
                                    ? 'bg-white text-blue-600 shadow-sm border border-gray-200/80 font-bold'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                            }`}
                        >
                            <GraduationCap size={16} /> 🎓 College Events
                        </button>

                        <button
                            onClick={() => setSelectedCategory('alumni')}
                            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                                selectedCategory === 'alumni'
                                    ? 'bg-white text-blue-600 shadow-sm border border-gray-200/80 font-bold'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                            }`}
                        >
                            <Award size={16} /> 💼 Industry / Alumni Events
                        </button>
                    </div>

                    <div className="text-xs text-gray-500 font-medium">
                        Logged in as: <span className="font-bold text-gray-800 capitalize">{user.role}</span> ({user.role === 'alumni' ? 'Can post Industry Events' : user.role === 'student' ? 'Can post Campus Events' : 'Admin Privileges'})
                    </div>
                </div>

                {/* Filter Control Bar */}
                <EventFilterBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedType={selectedType}
                    setSelectedType={setSelectedType}
                    selectedMode={selectedMode}
                    setSelectedMode={setSelectedMode}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                />

                {/* Events Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse space-y-4">
                                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((ev) => (
                            <EventCard
                                key={ev._id}
                                ev={ev}
                                currentUser={user}
                                onViewDetails={(event) => setSelectedEventDetails(event)}
                                onEdit={(event) => handleOpenEditModal(event)}
                                onDelete={(eventId) => handleDeleteEvent(eventId)}
                                onRegisterToggle={(eventId) => handleRegisterToggle(eventId)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-10 border border-gray-200 text-center shadow-sm max-w-lg mx-auto space-y-4 my-8">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                            <Calendar size={28} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 heading-font">No matching events found</h3>
                            <p className="text-xs text-gray-500 mt-1">
                                Adjust your filters or switch category tabs to discover events.
                            </p>
                        </div>
                        <button
                            onClick={handleClearFilters}
                            className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5"
                        >
                            <RotateCcw size={14} /> Clear Filters
                        </button>
                    </div>
                )}

            </div>

            {/* Modals */}
            <EventFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                editingEventId={editingEventId}
                formCategory={formCategory}
                setFormCategory={setFormCategory}
                formData={formData}
                setFormData={setFormData}
                currentUser={user}
                onSubmitSuccess={handleFormSubmitSuccess}
            />

            <EventDetailsModal
                selectedEventDetails={selectedEventDetails}
                currentUser={user}
                onClose={() => setSelectedEventDetails(null)}
                onRegisterToggle={handleRegisterToggle}
            />

        </div>
    );
};

export default Events;
