import { useState, useEffect, useContext } from 'react';
import { Plus } from 'lucide-react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';

import JobCard from '../components/jobs/JobCard';
import JobPostModal from '../components/jobs/JobPostModal';

const Jobs = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'week', seconds: 604800 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
        ];
        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count >= 1) return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
        }
        return 'Just now';
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await api.get('/api/jobs', config);
            setJobs(res.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const handleApply = async (jobId, applyLink) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            if (user.role === 'student') {
                await api.post(`/api/jobs/${jobId}/apply`, {}, config);
                fetchJobs();
            }
            window.open(applyLink, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error('Error applying for job:', error.response?.data?.message || error.message);
            window.open(applyLink, '_blank', 'noopener,noreferrer');
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (window.confirm("Are you sure you want to delete this job posting?")) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await api.delete(`/api/jobs/${jobId}`, config);
                fetchJobs();
            } catch (error) {
                console.error('Error deleting job:', error);
                alert(error.response?.data?.message || 'Failed to delete job');
            }
        }
    };

    const filteredJobs = jobs.filter(job => {
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        return (
            job.title.toLowerCase().includes(q) ||
            job.company.toLowerCase().includes(q) ||
            job.location.toLowerCase().includes(q) ||
            job.description.toLowerCase().includes(q)
        );
    });

    return (
        <div className="min-h-screen bg-gray-50/70 body-font">
            <div className="max-w-7xl mx-auto px-6 py-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
                    <div>
                        <h2 className="section-header">Job & Career Opportunities</h2>
                        <p className="section-subheader">Exclusive career openings posted directly by our verified alumni network</p>
                    </div>

                    {(user.role === 'alumni' || user.role === 'admin') && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn-primary flex items-center justify-center gap-2 shadow-sm"
                        >
                            <Plus size={18} />
                            Post Opportunity
                        </button>
                    )}
                </div>

                {/* Search Filter Bar */}
                <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs mb-8">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search jobs by title, company, location, or skills..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                </div>

                {/* Job Cards Grid */}
                {filteredJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredJobs.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                                currentUser={user}
                                onApply={handleApply}
                                onDelete={handleDeleteJob}
                                timeAgo={timeAgo}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center shadow-xs">
                        <div className="text-5xl mb-3">💼</div>
                        <h3 className="text-xl font-bold text-gray-900 heading-font mb-1">No Jobs Found</h3>
                        <p className="text-sm text-gray-500">There are currently no active job postings matching your search criteria.</p>
                    </div>
                )}

            </div>

            {/* Post Job Modal */}
            <JobPostModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                currentUser={user}
                onJobPosted={fetchJobs}
            />

        </div>
    );
};

export default Jobs;
