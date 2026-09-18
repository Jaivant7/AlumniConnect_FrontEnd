import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const UserVerificationTab = ({ unverifiedUsers, handleVerify, handleReject }) => {
    const getRoleBadge = (role) => {
        const badges = {
            student: { class: 'badge-blue', text: 'Student' },
            alumni: { class: 'badge-purple', text: 'Alumni' },
            admin: { class: 'badge-orange', text: 'Admin' }
        };
        return badges[role] || badges.student;
    };

    return (
        <div className="space-y-4">
            {unverifiedUsers && unverifiedUsers.length > 0 ? (
                unverifiedUsers.map((unvUser) => (
                    <div key={unvUser._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                {unvUser.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-bold text-gray-900">{unvUser.name}</h4>
                                    <span className={`badge ${getRoleBadge(unvUser.role).class}`}>
                                        {getRoleBadge(unvUser.role).text}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600">{unvUser.email}</p>
                                <p className="text-xs text-gray-500 font-medium">
                                    {unvUser.role === 'student' ? `${unvUser.department} • Reg: ${unvUser.registerNumber}` : `${unvUser.company} • ${unvUser.currentRole}`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handleVerify(unvUser._id)}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                            >
                                <CheckCircle size={15} /> Approve
                            </button>
                            <button
                                onClick={() => handleReject(unvUser._id)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                            >
                                <XCircle size={15} /> Reject
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-12 text-gray-500">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <h4 className="text-lg font-bold text-gray-900">No Pending Verifications</h4>
                    <p className="text-xs text-gray-500 mt-1">All registered accounts have been reviewed.</p>
                </div>
            )}
        </div>
    );
};

export default UserVerificationTab;
