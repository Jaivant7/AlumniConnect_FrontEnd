import React from 'react';
import {
    MapPin,
    Briefcase,
    Calendar,
    Clock,
    DollarSign,
    Building2,
    Trash2,
    ExternalLink,
    CheckCircle2
} from 'lucide-react';

const JobCard = ({
    job,
    currentUser,
    onApply,
    onDelete,
    timeAgo
}) => {
    const isOwner = (job.postedBy?._id || job.postedBy).toString() === currentUser._id.toString();
    const isAdmin = currentUser.role === 'admin';
    const hasApplied = job.applicants?.some(id => (id._id || id).toString() === currentUser._id.toString());

    return (
        <div className="card card-hover p-6 animate-slide-up relative flex flex-col justify-between">
            <div>
                {/* Header Row */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
                            {job.company ? job.company.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 heading-font">{job.title}</h3>
                            <p className="text-sm font-semibold text-blue-600 flex items-center gap-1">
                                <Building2 size={14} /> {job.company}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="badge badge-blue">{job.type}</span>
                        {(isOwner || isAdmin) && (
                            <button
                                onClick={() => onDelete(job._id)}
                                className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                title="Delete Job Posting"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Job Metadata Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span>{job.location} ({job.workMode || 'On-site'})</span>
                    </div>
                    {job.salaryRange && (
                        <div className="flex items-center gap-2">
                            <DollarSign size={16} className="text-emerald-600" />
                            <span className="font-semibold text-emerald-700">{job.salaryRange}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <Briefcase size={16} className="text-gray-400" />
                        <span>{job.role || 'Software Engineering'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span>{timeAgo(job.createdAt)}</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 mb-4">
                    {job.description}
                </p>

                {/* Required Skills Chips */}
                {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {job.skills.map((skill, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg border border-gray-200">
                                {skill}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs text-gray-500 font-medium">
                    Posted by: <span className="font-semibold text-gray-800">{job.postedBy?.name || 'Alumni Member'}</span>
                </div>

                <button
                    onClick={() => onApply(job._id, job.applyLink)}
                    className={`btn-primary flex items-center gap-1.5 text-xs ${hasApplied ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
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
