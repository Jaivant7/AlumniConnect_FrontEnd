import React from 'react';
import { Lock, Unlock } from 'lucide-react';

const UserManagementTab = ({ allUsers, handleToggleBlock }) => {
    const getRoleBadge = (role) => {
        const badges = {
            student: { class: 'badge-blue', text: 'Student' },
            alumni: { class: 'badge-purple', text: 'Alumni' },
            admin: { class: 'badge-orange', text: 'Admin' }
        };
        return badges[role] || badges.student;
    };

    return (
        <div className="space-y-3">
            {allUsers && allUsers.length > 0 ? (
                allUsers.map((u) => (
                    <div key={u._id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h5 className="font-bold text-gray-900 text-sm">{u.name}</h5>
                                    <span className={`badge ${getRoleBadge(u.role).class}`}>
                                        {getRoleBadge(u.role).text}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500">{u.email}</p>
                            </div>
                        </div>

                        {u.role !== 'admin' && (
                            <button
                                onClick={() => handleToggleBlock(u._id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                                    u.isBlocked
                                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                }`}
                            >
                                {u.isBlocked ? (
                                    <>
                                        <Unlock size={14} /> Unblock
                                    </>
                                ) : (
                                    <>
                                        <Lock size={14} /> Block
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                ))
            ) : (
                <div className="text-center py-8 text-gray-500 text-xs">
                    No users found.
                </div>
            )}
        </div>
    );
};

export default UserManagementTab;
