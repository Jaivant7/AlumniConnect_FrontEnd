import React from 'react';
import {
    Briefcase,
    GraduationCap,
    Award,
    Code,
    BookOpen,
    Target,
    ExternalLink,
    CheckCircle2
} from 'lucide-react';

const ProfileActivityTab = ({ profile }) => {
    if (!profile) return null;

    return (
        <div className="space-y-6">
            
            {/* Bio Card */}
            {profile.bio && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">About</h3>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-normal">
                        {profile.bio}
                    </p>
                </div>
            )}

            {/* Academic & Professional Info Box */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                    {profile.role === 'student' ? 'Academic Details' : 'Professional Background'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    {profile.role === 'student' ? (
                        <>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="text-gray-500 block">Department</span>
                                <span className="font-bold text-gray-900 mt-0.5 block">{profile.department || 'N/A'}</span>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="text-gray-500 block">Academic Standing</span>
                                <span className="font-bold text-gray-900 mt-0.5 block">{profile.year ? `${profile.year}th Year` : 'N/A'}</span>
                            </div>
                            {profile.cgpa && (
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <span className="text-gray-500 block">Current CGPA</span>
                                    <span className="font-bold text-blue-700 mt-0.5 block">{profile.cgpa} / 10</span>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="text-gray-500 block">Company</span>
                                <span className="font-bold text-gray-900 mt-0.5 block">{profile.company || 'N/A'}</span>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="text-gray-500 block">Current Role</span>
                                <span className="font-bold text-gray-900 mt-0.5 block">{profile.currentRole || 'N/A'}</span>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="text-gray-500 block">Experience</span>
                                <span className="font-bold text-purple-700 mt-0.5 block">{profile.yearsOfExperience ? `${profile.yearsOfExperience} Years` : 'N/A'}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Skills & Expertise */}
            {profile.skills && profile.skills.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Skills & Technical Competencies</h3>
                    <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 font-semibold rounded-lg text-xs border border-blue-100">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Showcase Projects */}
            {profile.projects && profile.projects.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Projects & Key Work</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.projects.map((proj, idx) => (
                            <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                                <h4 className="font-bold text-sm text-gray-900">{proj.title}</h4>
                                <p className="text-xs text-gray-600 leading-normal">{proj.description}</p>
                                {proj.tech && proj.tech.length > 0 && (
                                    <div className="flex flex-wrap gap-1 pt-1">
                                        {proj.tech.map((t, i) => (
                                            <span key={i} className="text-[10px] px-2 py-0.5 bg-white text-gray-600 rounded border border-gray-200">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default ProfileActivityTab;
