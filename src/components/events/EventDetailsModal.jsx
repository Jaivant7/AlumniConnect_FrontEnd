import React from 'react';
import {
    Calendar,
    Clock,
    MapPin,
    Building,
    GraduationCap,
    CheckCircle2,
    X,
    ExternalLink
} from 'lucide-react';
import { getImageUrl } from '../../utils/imageUrl';

const EventDetailsModal = ({
    selectedEventDetails,
    currentUser,
    onClose,
    onRegisterToggle
}) => {
    if (!selectedEventDetails) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const isRegistered = selectedEventDetails.registeredUsers?.some(
        id => (id._id || id).toString() === currentUser._id.toString()
    );

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-xl w-full shadow-xl relative overflow-hidden my-8 border border-gray-200">
                
                {/* Banner Image */}
                {selectedEventDetails.bannerImageUrl && (
                    <div className="h-44 bg-gray-100 w-full relative overflow-hidden">
                        <img
                            src={getImageUrl(selectedEventDetails.bannerImageUrl)}
                            alt={selectedEventDetails.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Modal Header */}
                <div className="p-6 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md uppercase tracking-wider text-white border border-white/20">
                            {selectedEventDetails.eventCategory === 'INDUSTRY' ? '💼 Industry Opportunity' : '🎓 College Event'}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/10 text-white">
                            {selectedEventDetails.eventType}
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold heading-font mt-2 leading-tight">{selectedEventDetails.title}</h2>
                    <p className="text-xs text-blue-100 font-semibold mt-1 flex items-center gap-1.5">
                        {selectedEventDetails.eventCategory === 'INDUSTRY' ? (
                            <>
                                <Building size={14} /> {selectedEventDetails.companyName || 'Corporate Opportunity'}
                            </>
                        ) : (
                            <>
                                <GraduationCap size={14} /> {selectedEventDetails.organizerName || 'Campus Event'}
                            </>
                        )}
                    </p>
                </div>

                {/* Details Body */}
                <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                    
                    {/* Key Specifications Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
                        <div>
                            <span className="text-gray-500 block text-[11px]">Event Date</span>
                            <span className="font-bold text-gray-900 mt-0.5 flex items-center gap-1">
                                <Calendar size={13} className="text-blue-600" />
                                {formatDate(selectedEventDetails.eventDate)}
                            </span>
                        </div>

                        <div>
                            <span className="text-gray-500 block text-[11px]">Timings</span>
                            <span className="font-bold text-gray-900 mt-0.5 flex items-center gap-1">
                                <Clock size={13} className="text-blue-600" />
                                {selectedEventDetails.startTime} - {selectedEventDetails.endTime}
                            </span>
                        </div>

                        <div>
                            <span className="text-gray-500 block text-[11px]">Mode & Location</span>
                            <span className="font-bold text-gray-900 mt-0.5 flex items-center gap-1 truncate">
                                <MapPin size={13} className="text-blue-600" />
                                {selectedEventDetails.mode} ({selectedEventDetails.location})
                            </span>
                        </div>
                    </div>

                    {/* STRUCTURED ELIGIBILITY CRITERIA BOX */}
                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2 text-xs">
                        <h4 className="font-bold text-blue-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-blue-600" /> Official Eligibility Criteria
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-gray-700">
                            <div>
                                <span className="font-semibold text-gray-900">Academic Standing:</span>{' '}
                                <span className="text-blue-700 font-medium">
                                    {selectedEventDetails.eligibility?.years?.join(', ') || 'All Years'}
                                </span>
                            </div>

                            <div>
                                <span className="font-semibold text-gray-900">Eligible Departments:</span>{' '}
                                <span className="text-blue-700 font-medium">
                                    {selectedEventDetails.eligibility?.departments?.join(', ') || 'Any Department'}
                                </span>
                            </div>

                            {selectedEventDetails.eligibility?.minCgpa > 0 && (
                                <div>
                                    <span className="font-semibold text-gray-900">Minimum CGPA:</span>{' '}
                                    <span className="text-blue-700 font-bold">{selectedEventDetails.eligibility.minCgpa} / 10</span>
                                </div>
                            )}

                            {selectedEventDetails.registrationDeadline && (
                                <div>
                                    <span className="font-semibold text-gray-900">Deadline:</span>{' '}
                                    <span className="text-red-600 font-bold">{formatDate(selectedEventDetails.registrationDeadline)}</span>
                                </div>
                            )}
                        </div>

                        {selectedEventDetails.eligibility?.otherRequirements && (
                            <p className="text-xs text-gray-600 pt-1.5 border-t border-blue-100 italic">
                                "{selectedEventDetails.eligibility.otherRequirements}"
                            </p>
                        )}
                    </div>

                    {/* Skills Required */}
                    {selectedEventDetails.skillsRequired && selectedEventDetails.skillsRequired.length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Required Skills</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {selectedEventDetails.skillsRequired.map((s, idx) => (
                                    <span key={idx} className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold border border-purple-100">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Event Description */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">Description & Rules</h4>
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                            {selectedEventDetails.description}
                        </p>
                    </div>

                    {/* Contact Info */}
                    {selectedEventDetails.contactInformation && (
                        <div className="text-xs text-gray-600">
                            <span className="font-semibold text-gray-900">Contact / Organizer Info:</span> {selectedEventDetails.contactInformation}
                        </div>
                    )}

                    {/* Attendees List */}
                    {selectedEventDetails.registeredUsers && selectedEventDetails.registeredUsers.length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                                Registered Participants ({selectedEventDetails.registeredUsers.length} {selectedEventDetails.maxParticipants > 0 ? `/ ${selectedEventDetails.maxParticipants}` : ''})
                            </h4>
                            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                                {selectedEventDetails.registeredUsers.map((u) => (
                                    <span key={u._id} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200">
                                        {u.name} ({u.role})
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Controls */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3">
                    {selectedEventDetails.registrationLink ? (
                        <a
                            href={selectedEventDetails.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                        >
                            External Portal <ExternalLink size={14} />
                        </a>
                    ) : <div></div>}

                    <button
                        onClick={() => onRegisterToggle(selectedEventDetails._id)}
                        className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${
                            isRegistered
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                        }`}
                    >
                        {isRegistered ? '✓ Registered' : 'Register / Join Event'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default EventDetailsModal;
