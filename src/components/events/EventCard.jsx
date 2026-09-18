import React from 'react';
import {
    Calendar,
    Clock,
    MapPin,
    Building,
    GraduationCap,
    CheckCircle2,
    Edit3,
    Trash2
} from 'lucide-react';
import { getImageUrl } from '../../utils/imageUrl';

const EventCard = ({
    ev,
    currentUser,
    onViewDetails,
    onEdit,
    onDelete,
    onRegisterToggle
}) => {
    const isRegistered = ev.registeredUsers?.some(id => (id._id || id).toString() === currentUser._id.toString());
    const isCreator = (ev.user?._id || ev.user).toString() === currentUser._id.toString();
    const isPast = new Date(ev.eventDate) < new Date();
    const isIndustry = ev.eventCategory === 'INDUSTRY';

    const yearsList = ev.eligibility?.years?.join(', ') || 'All';
    const deptsList = ev.eligibility?.departments?.join(', ') || 'Any';

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 p-6 flex flex-col justify-between relative overflow-hidden">
            
            {/* Top Banner Image (if present) */}
            {ev.bannerImageUrl && (
                <div className="-mx-6 -mt-6 mb-4 h-36 bg-gray-100 relative overflow-hidden">
                    <img
                        src={getImageUrl(ev.bannerImageUrl)}
                        alt={ev.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Header Badges */}
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            isIndustry
                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}>
                            {isIndustry ? '💼 Industry' : '🎓 College'}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                            {ev.eventType}
                        </span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full flex-shrink-0">
                        {formatDate(ev.eventDate)}
                    </span>
                </div>

                {/* Title & Host Info */}
                <div>
                    <h3
                        onClick={() => onViewDetails(ev)}
                        className="text-lg font-bold text-gray-900 heading-font hover:text-blue-600 transition-colors cursor-pointer line-clamp-2"
                    >
                        {ev.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-1.5">
                        {ev.companyLogo ? (
                            <img src={getImageUrl(ev.companyLogo)} alt="Company Logo" className="w-5 h-5 rounded object-cover" />
                        ) : isIndustry ? (
                            <Building size={14} className="text-purple-600" />
                        ) : (
                            <GraduationCap size={14} className="text-emerald-600" />
                        )}
                        <span className="text-xs font-semibold text-gray-800 truncate">
                            {isIndustry ? (ev.companyName || 'Corporate Host') : (ev.organizerName || ev.user?.name || 'Campus Organizer')}
                        </span>
                    </div>
                </div>

                {/* Key Specifications */}
                <div className="space-y-2 text-xs text-gray-600 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 font-medium">
                        <Clock size={14} className="text-blue-600 flex-shrink-0" />
                        <span>{ev.startTime} - {ev.endTime}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{ev.mode} • {ev.location}</span>
                    </div>

                    {/* Structured Eligibility Summary */}
                    <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200/80 text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-gray-700 font-semibold">
                            <span>Eligibility:</span>
                            {ev.eligibility?.minCgpa > 0 && (
                                <span className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[10px]">CGPA ≥ {ev.eligibility.minCgpa}</span>
                            )}
                        </div>
                        <div className="text-gray-500 truncate">
                            <span className="font-medium text-gray-700">Years:</span> {yearsList}
                        </div>
                        <div className="text-gray-500 truncate">
                            <span className="font-medium text-gray-700">Depts:</span> {deptsList}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                    onClick={() => onViewDetails(ev)}
                    className="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                    View Details
                </button>

                <div className="flex items-center gap-1.5">
                    {(isCreator || currentUser.role === 'admin') && (
                        <>
                            <button
                                onClick={() => onEdit(ev)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                title="Edit Event"
                            >
                                <Edit3 size={15} />
                            </button>
                            <button
                                onClick={() => onDelete(ev._id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                title="Delete Event"
                            >
                                <Trash2 size={15} />
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => onRegisterToggle(ev._id)}
                        disabled={isPast && !isRegistered}
                        className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                            isRegistered
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                                : isPast
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                        }`}
                    >
                        {isRegistered ? (
                            <>
                                <CheckCircle2 size={14} /> Registered
                            </>
                        ) : isPast ? (
                            'Ended'
                        ) : (
                            'Register'
                        )}
                    </button>
                </div>
            </div>

        </div>
    );
};

export default EventCard;
