import React from 'react';

const ComplaintResolutionTab = ({ complaints, handleResolve }) => {
    return (
        <div className="space-y-4">
            {complaints && complaints.length > 0 ? (
                complaints.map((c) => (
                    <div key={c._id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                    {c.status}
                                </span>
                                <span className="text-xs text-gray-500 font-semibold">{c.category || 'General'}</span>
                            </div>
                            <h4 className="font-bold text-gray-900 text-sm">{c.subject}</h4>
                            <p className="text-xs text-gray-600 leading-relaxed">{c.description}</p>
                            <p className="text-[11px] text-gray-400">Filed by: {c.user?.name || 'Anonymous'} ({c.user?.email})</p>
                        </div>

                        {c.status !== 'Resolved' && (
                            <button
                                onClick={() => handleResolve(c._id)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex-shrink-0"
                            >
                                Mark Resolved
                            </button>
                        )}
                    </div>
                ))
            ) : (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-xs text-gray-500">No active complaints filed.</p>
                </div>
            )}
        </div>
    );
};

export default ComplaintResolutionTab;
