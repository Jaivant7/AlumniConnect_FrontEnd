import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ComplaintResolutionTab = ({ complaints = [], handleResolve, resolvingId }) => {
    const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'resolved'

    const pendingCount = complaints.filter(c => c.status?.toLowerCase() !== 'resolved').length;
    const resolvedCount = complaints.filter(c => c.status?.toLowerCase() === 'resolved').length;

    const filteredComplaints = complaints.filter(c => {
        const isResolved = c.status?.toLowerCase() === 'resolved';
        if (filter === 'pending') return !isResolved;
        if (filter === 'resolved') return isResolved;
        return true;
    });

    return (
        <div className="space-y-4">
            {/* Filter buttons */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                            filter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        All ({complaints.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilter('pending')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                            filter === 'pending'
                                ? 'bg-amber-600 text-white'
                                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                    >
                        <Clock size={12} />
                        Pending ({pendingCount})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilter('resolved')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                            filter === 'resolved'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                    >
                        <CheckCircle size={12} />
                        Resolved ({resolvedCount})
                    </button>
                </div>
            </div>

            {filteredComplaints.length > 0 ? (
                filteredComplaints.map((c) => {
                    const isResolved = c.status?.toLowerCase() === 'resolved';

                    return (
                        <div
                            key={c._id}
                            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                                isResolved
                                    ? 'bg-gray-50/60 border-gray-200'
                                    : 'bg-white border-amber-200/80 shadow-xs'
                            }`}
                        >
                            <div className="space-y-1.5">
                                <div className="flex items-center space-x-2">
                                    <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1 ${
                                            isResolved
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-amber-100 text-amber-800'
                                        }`}
                                    >
                                        {isResolved ? <CheckCircle size={11} /> : <Clock size={11} />}
                                        {c.status || 'pending'}
                                    </span>
                                    <span className="text-xs text-gray-500 font-semibold">{c.category || 'General'}</span>
                                </div>
                                <h4 className="font-bold text-gray-900 text-sm">{c.subject}</h4>
                                <p className="text-xs text-gray-600 leading-relaxed">{c.description}</p>
                                <p className="text-[11px] text-gray-400">
                                    Filed by: {c.user?.name || 'Anonymous'} ({c.user?.email || 'N/A'})
                                    {c.createdAt ? ` • ${new Date(c.createdAt).toLocaleDateString()}` : ''}
                                </p>
                            </div>

                            <div className="flex-shrink-0">
                                {isResolved ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        <CheckCircle size={14} /> Resolved
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleResolve(c._id)}
                                        disabled={resolvingId === c._id}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <CheckCircle size={14} />
                                        {resolvingId === c._id ? 'Resolving...' : 'Mark Resolved'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-center py-12 text-gray-500">
                    <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                    <p className="text-sm font-semibold text-gray-700">
                        {filter === 'pending'
                            ? 'No pending complaints! All issues are resolved.'
                            : filter === 'resolved'
                            ? 'No resolved complaints yet.'
                            : 'No active complaints filed.'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ComplaintResolutionTab;
