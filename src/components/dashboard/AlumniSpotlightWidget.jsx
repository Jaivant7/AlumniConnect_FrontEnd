import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ChevronRight, Building } from 'lucide-react';

const AlumniSpotlightWidget = ({ featuredAlumni }) => {
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-bold text-gray-900 heading-font flex items-center gap-2">
                    <Users className="text-blue-600" size={18} /> Alumni Spotlight
                </h4>
                <Link to="/directory" className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-0.5">
                    View All <ChevronRight size={14} />
                </Link>
            </div>

            <div className="space-y-4">
                {featuredAlumni && featuredAlumni.length > 0 ? (
                    featuredAlumni.map((alumni) => (
                        <div key={alumni._id} className="p-3.5 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-gray-50/50 transition-all">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs flex-shrink-0">
                                    {alumni.name ? alumni.name.charAt(0).toUpperCase() : 'A'}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h5 className="font-bold text-gray-900 text-sm truncate">{alumni.name}</h5>
                                    <p className="text-xs text-gray-600 truncate mt-0.5 font-medium">
                                        {alumni.currentRole || 'Alumni Member'}
                                    </p>
                                    {alumni.company && (
                                        <p className="text-[11px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                                            <Building size={12} className="text-gray-400" /> {alumni.company}
                                        </p>
                                    )}
                                    {alumni.bio && (
                                        <p className="text-[11px] text-gray-500 line-clamp-2 mt-1.5 italic bg-gray-50 p-1.5 rounded border border-gray-100">
                                            "{alumni.bio}"
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                                <span className="text-[11px] text-gray-400 font-medium">
                                    Graduated {alumni.graduationYear || 'Alumnus'}
                                </span>
                                <Link
                                    to={`/profile/${alumni._id}`}
                                    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition-colors flex items-center gap-1 text-[11px]"
                                >
                                    View Profile <ChevronRight size={12} />
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-gray-400 text-center py-4">No alumni found in domain.</p>
                )}
            </div>
        </div>
    );
};

export default AlumniSpotlightWidget;
