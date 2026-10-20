import React, { useState } from 'react';
import {
    MapPin,
    Briefcase,
    Calendar,
    Clock,
    DollarSign,
    Building2,
    Trash2,
    ExternalLink,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    UserCheck
} from 'lucide-react';

const JobCard = ({
    job,
    currentUser,
    onApply,
    onDelete,
    timeAgo
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const jobOwnerId = job.user?._id || job.user || job.postedBy?._id || job.postedBy;
    const isOwner = jobOwnerId && currentUser?._id ? jobOwnerId.toString() === currentUser._id.toString() : false;
    const isAdmin = currentUser?.role === 'admin';
    const hasApplied = (currentUser?.appliedJobs || []).some(id => (id._id || id).toString() === job._id.toString());
    
    const posterName = job.user?.name || job.postedBy?.name || 'Verified Alumni';
    const posterCompany = job.user?.company || job.company;
    const posterYear = job.user?.year || job.user?.graduationYear;

    const formatDeadline = (dateStr) => {
        if (!dateStr) return null;
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return null;
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) {
            return null;
        }
    };

    const deadlineText = formatDeadline(job.deadline);

    const getWorkModeBadge = (mode) => {
        switch (mode) {
            case 'Remote':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Hybrid':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            default:
                return 'bg-blue-50 text-blue-700 border-blue-200';
        }
    };

    const getTypeBadge = (type) => {
        switch (type) {
            case 'Internship':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Part-time':
                return 'bg-teal-50 text-teal-700 border-teal-200';
            case 'Contract':
                return 'bg-rose-50 text-rose-700 border-rose-200';
            default:
                return 'bg-indigo-50 text-indigo-700 border-indigo-200';
        }
    };

    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative group">
            <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xl shadow-sm flex-shrink-0">
                            {job.company ? job.company.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 heading-font leading-snug">{job.title}</h3>
                            <p className="text-xs font-semibold text-blue-600 flex items-center gap-1.5 mt-0.5">
                                <Building2 size={14} className="text-blue-500" /> {job.company}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${getTypeBadge(job.type)}`}>
                            {job.type || 'Full-time'}
                        </span>
                        {(isOwner || isAdmin) && (
                            <button
                                onClick={() => onDelete(job._id)}
                                className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                title="Delete Job Posting"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Badges & Key Attributes Grid */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg border border-gray-200">
                        <MapPin size={13} className="text-gray-400" /> {job.location}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border ${getWorkModeBadge(job.workMode)}`}>
                        {job.workMode || 'On-site'}
                    </span>
                    {job.role && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200">
                            <Briefcase size={13} className="text-slate-400" /> {job.role}
                        </span>
                    )}
                    {job.salaryRange && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
                            <DollarSign size={13} className="text-emerald-600" /> {job.salaryRange}
                        </span>
                    )}
                </div>

                {/* Additional Timings (Deadline & Post Date) */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-gray-400" />
                        <span>Posted {timeAgo(job.createdAt)}</span>
                    </div>
                    {deadlineText && (
                        <div className="flex items-center gap-1.5 text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                            <Calendar size={13} className="text-amber-600" />
                            <span>Deadline: {deadlineText}</span>
                        </div>
                    )}
                </div>

                {/* Job Description with expandable toggle */}
                <div className="mb-4">
                    <p className={`text-gray-700 text-xs sm:text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                        {job.description}
                    </p>
                    {job.description && job.description.length > 160 && (
                        <button
                            type="button"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-1 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 focus:outline-none"
                        >
                            {isExpanded ? (
                                <>Show Less <ChevronUp size={12} /></>
                            ) : (
                                <>Read Details <ChevronDown size={12} /></>
                            )}
                        </button>
                    )}
                </div>

                {/* Required Skills Chips */}
                {job.skills && job.skills.length > 0 && (
                    <div className="mb-4">
                        <span className="text-[11px] font-semibold text-gray-400 block mb-1.5 uppercase tracking-wider">Required Skills</span>
                        <div className="flex flex-wrap gap-1.5">
                            {job.skills.map((skill, idx) => (
                                <span key={idx} className="px-2.5 py-0.5 bg-blue-50/70 text-blue-800 text-xs font-medium rounded-md border border-blue-100">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Row */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2 mt-2">
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                        {posterName.charAt(0).toUpperCase()}
                    </div>
                    <div className="leading-tight">
                        <span className="text-[11px] text-gray-400 block">Posted by</span>
                        <span className="font-semibold text-gray-800 flex items-center gap-1">
                            {posterName}
                            {posterCompany && posterCompany !== job.company && (
                                <span className="text-gray-500 font-normal">({posterCompany})</span>
                            )}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => onApply(job._id, job.applyLink)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 ${
                        hasApplied
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
                    }`}
                >
                    {hasApplied ? (
                        <>
                            <CheckCircle2 size={14} /> Applied
                        </>
                    ) : (
                        <>
                            Apply Now <ExternalLink size={14} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default JobCard;
