import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';

import AdminStatsHeader from '../components/admin/AdminStatsHeader';
import UserVerificationTab from '../components/admin/UserVerificationTab';
import ComplaintResolutionTab from '../components/admin/ComplaintResolutionTab';
import UserManagementTab from '../components/admin/UserManagementTab';

const Admin = () => {
    const { user } = useContext(AuthContext);
    const [unverifiedUsers, setUnverifiedUsers] = useState([]);
    const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0 });
    const [complaints, setComplaints] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('verifications'); // 'verifications', 'complaints', or 'users'

    useEffect(() => {
        fetchUnverifiedUsers();
        fetchStats();
        fetchComplaints();
        fetchAllUsers();
    }, []);

    const fetchUnverifiedUsers = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await api.get('/api/admin/unverified', config);
            setUnverifiedUsers(res.data);
        } catch (error) {
            console.error('Error fetching unverified users:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await api.get('/api/admin/stats', config);
            setStats(res.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchComplaints = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await api.get('/api/complaints', config);
            setComplaints(res.data);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await api.get('/api/users', config);
            setAllUsers(res.data);
        } catch (error) {
            console.error('Error fetching all users:', error);
        }
    };

    const handleVerify = async (userId) => {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await api.patch(`/api/admin/verify/${userId}`, {}, config);
        fetchUnverifiedUsers();
        fetchStats();
    };

    const handleReject = async (userId) => {
        if (window.confirm("Are you sure you want to reject and delete this user?")) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await api.delete(`/api/admin/reject/${userId}`, config);
                fetchUnverifiedUsers();
                fetchStats();
            } catch (error) {
                console.error('Error rejecting user:', error);
                alert('Failed to reject user');
            }
        }
    };

    const handleResolve = async (complaintId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await api.put(`/api/complaints/${complaintId}/resolve`, {}, config);
            fetchComplaints();
        } catch (error) {
            console.error('Error resolving complaint:', error);
        }
    };

    const handleToggleBlock = async (userId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await api.patch(`/api/admin/block/${userId}`, {}, config);
            fetchAllUsers();
        } catch (error) {
            console.error('Error toggling block status:', error);
            alert(error.response?.data?.message || 'Failed to update user status');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/70 body-font">
            <div className="max-w-7xl mx-auto px-6 py-8">
                
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h2 className="section-header">Admin Control Dashboard</h2>
                    <p className="section-subheader">System management, user account verification, and moderation controls</p>
                </div>

                {/* Stats Cards */}
                <AdminStatsHeader stats={stats} />

                {/* Main Card with Tabs */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm animate-slide-up">
                    
                    {/* Navigation Tabs */}
                    <div className="flex border-b border-gray-200 mb-6 gap-6">
                        <button
                            onClick={() => setActiveTab('verifications')}
                            className={`pb-3 text-sm font-bold transition-all relative ${
                                activeTab === 'verifications'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            Pending Verifications ({unverifiedUsers.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('complaints')}
                            className={`pb-3 text-sm font-bold transition-all relative ${
                                activeTab === 'complaints'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            User Complaints ({complaints.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`pb-3 text-sm font-bold transition-all relative ${
                                activeTab === 'users'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            All Members ({allUsers.length})
                        </button>
                    </div>

                    {/* Active Tab View */}
                    {activeTab === 'verifications' && (
                        <UserVerificationTab
                            unverifiedUsers={unverifiedUsers}
                            handleVerify={handleVerify}
                            handleReject={handleReject}
                        />
                    )}

                    {activeTab === 'complaints' && (
                        <ComplaintResolutionTab
                            complaints={complaints}
                            handleResolve={handleResolve}
                        />
                    )}

                    {activeTab === 'users' && (
                        <UserManagementTab
                            allUsers={allUsers}
                            handleToggleBlock={handleToggleBlock}
                        />
                    )}

                </div>

            </div>
        </div>
    );
};

export default Admin;
