import React from 'react';
import { Users, UserCheck, Clock } from 'lucide-react';

const AdminStatsHeader = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="stats-card gradient-blue animate-slide-up">
                <div className="flex items-center justify-between mb-4">
                    <Users size={28} />
                    <span className="text-blue-100 text-sm font-medium">Platform</span>
                </div>
                <div className="text-3xl font-bold mb-1">{stats.total || 0}</div>
                <div className="text-blue-100 font-medium">Total Registered Users</div>
            </div>

            <div className="stats-card gradient-purple animate-slide-up">
                <div className="flex items-center justify-between mb-4">
                    <UserCheck size={28} />
                    <span className="text-purple-100 text-sm font-medium">Verified</span>
                </div>
                <div className="text-3xl font-bold mb-1">{stats.verified || 0}</div>
                <div className="text-purple-100 font-medium">Verified Members</div>
            </div>

            <div className="stats-card gradient-orange animate-slide-up">
                <div className="flex items-center justify-between mb-4">
                    <Clock size={28} />
                    <span className="text-orange-100 text-sm font-medium">Action Required</span>
                </div>
                <div className="text-3xl font-bold mb-1">{stats.pending || 0}</div>
                <div className="text-orange-100 font-medium">Pending Verifications</div>
            </div>
        </div>
    );
};

export default AdminStatsHeader;
