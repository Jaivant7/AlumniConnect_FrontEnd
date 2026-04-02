import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { LifeBuoy, PlusCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Help = () => {
    const { user } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ subject: '', description: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await api.get('/api/complaints/mine', config);
            setComplaints(data);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await api.post('/api/complaints', formData, config);
            
            setSuccess('Complaint submitted successfully. An admin will review it shortly.');
            setFormData({ subject: '', description: '' });
            setShowForm(false);
            fetchComplaints();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit complaint');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 font-body">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <LifeBuoy className="text-blue-600" size={32} />
                    <h1 className="text-3xl font-bold text-gray-900 heading-font">Help & Support</h1>
                </div>
                <p className="text-gray-600">
                    Need assistance? Submit a complaint or issue and our admin team will help you out.
                </p>
            </div>

            {/* Actions & Alerts */}
            <div className="mb-8">
                {!showForm && (
                     <button 
                        onClick={() => setShowForm(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <PlusCircle size={20} />
                        Raise New Issue
                    </button>
                )}

                {success && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 text-green-700 animate-slide-down">
                        <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
                        <p className="font-medium">{success}</p>
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 animate-slide-down">
                        <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                        <p className="font-medium">{error}</p>
                    </div>
                )}
            </div>

            {/* New Complaint Form */}
            {showForm && (
                <div className="card p-6 mb-8 animate-slide-down border-l-4 border-l-blue-600">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 heading-font">Submit a Complaint</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="input-field"
                                placeholder="E.g. Cannot access job board, Report offensive content..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="input-field min-h-[120px] resize-y"
                                placeholder="Please describe your issue in detail..."
                                required
                            ></textarea>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <button 
                                type="submit" 
                                className="btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Issue'}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setShowForm(false)}
                                className="px-6 py-2.5 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Previous Complaints List */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 heading-font">Your Support Tickets</h2>
                
                {complaints.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <LifeBuoy className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No tickets yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            You haven't submitted any issues. If you need help, use the button above.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {complaints.map((complaint) => (
                            <div key={complaint._id} className="card p-6 border-l-4 transition-all hover:shadow-md" 
                                style={{ borderLeftColor: complaint.status === 'resolved' ? '#10B981' : '#F59E0B' }}>
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{complaint.subject}</h3>
                                        <p className="text-gray-600 mb-4 text-sm whitespace-pre-wrap">{complaint.description}</p>
                                        <p className="text-xs text-gray-400 font-medium">
                                            Submitted on {new Date(complaint.createdAt).toLocaleDateString()} at {new Date(complaint.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {complaint.status === 'resolved' ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-green-50 text-green-700 border border-green-200">
                                                <CheckCircle size={16} />
                                                Resolved
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                <Clock size={16} />
                                                Pending Review
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Help;
