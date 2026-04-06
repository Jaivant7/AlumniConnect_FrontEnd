import { useState, useEffect, useContext } from 'react';
import { Plus, MapPin, Briefcase, Calendar, Clock, ArrowRight, User, DollarSign, Share2, Bookmark, Building2, X, Trash2 } from 'lucide-react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';

const Jobs = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [skillInput, setSkillInput] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        workMode: 'On-site',
        description: '',
        role: '',
        type: 'Full-time',
        salaryRange: '',
        skills: [],
        deadline: '',
        applyLink: ''
    });

    const addSkill = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const skill = skillInput.trim();
            if (skill && !formData.skills.includes(skill)) {
                setFormData({ ...formData, skills: [...formData.skills, skill] });
            }
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData({ ...formData, skills: formData.skills.filter(s => s !== skillToRemove) });
    };

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
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await api.get('/api/jobs', config);
        setJobs(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await api.post('/api/jobs', formData, config);
        setShowModal(false);
        fetchJobs();
    };

    const handleApply = async (jobId, applyLink) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Ensure only students send the request, others just open link
            if (user.role === 'student') {
                await api.post(`/api/jobs/${jobId}/apply`, {}, config);
            }
            window.open(applyLink, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error('Error applying for job:', error.response?.data?.message || error.message);
            // Open the link anyway so they can apply externally
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

    return (
        <div className="min-h-screen bg-gray-50 body-font">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8 animate-fade-in">
                    <div>
                        <h2 className="section-header">Job Opportunities</h2>
                        <p className="section-subheader">Exclusive opportunities from our alumni network</p>
                    </div>

                    {(user.role === 'alumni' || user.role === 'admin') && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Post a Job
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="card p-6 mb-6 animate-slide-up">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
                            <select className="input-field">
                                <option>All Companies</option>
                                <option>Google</option>
                                <option>Microsoft</option>
                                <option>Amazon</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                            <select className="input-field">
                                <option>All Locations</option>
                                <option>Bangalore</option>
                                <option>Hyderabad</option>
                                <option>Mumbai</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                            <select className="input-field">
                                <option>All Roles</option>
                                <option>Software Engineer</option>
                                <option>Product Manager</option>
                                <option>Data Scientist</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                            <select className="input-field">
                                <option>All Types</option>
                                <option>Full-time</option>
                                <option>Internship</option>
                                <option>Contract</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Job Listings */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {jobs.map((job, index) => (
                        <div key={job._id} className={`group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden animate-slide-up stagger-${Math.min(index + 1, 3)}`}>
                            <div className="p-5">
                                {/* Header: Logo + Title + Actions */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                                            {job.company.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-tight">
                                                {job.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 font-medium mt-0.5">{job.company}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        {(user.role === 'admin' || (job.user && user._id === job.user._id)) && (
                                            <button 
                                                onClick={() => handleDeleteJob(job._id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Job"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Bookmark className="w-4 h-4" />
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Location + Work Mode */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="flex items-center gap-1 text-sm text-gray-500">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {job.location}
                                    </span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${job.workMode === 'Remote' ? 'bg-green-100 text-green-700' :
                                        job.workMode === 'Hybrid' ? 'bg-emerald-100 text-emerald-700' :
                                            'bg-orange-100 text-orange-700'
                                        }`}>
                                        {job.workMode || 'On-site'}
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                                    {job.description || job.role}
                                </p>

                                {/* Salary Range & Job Type */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {job.salaryRange && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-gray-400">Salary Range</p>
                                                <p className="text-sm font-semibold text-gray-900">{job.salaryRange}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <Building2 className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-gray-400">Job Type</p>
                                            <p className="text-sm font-semibold text-gray-900">{job.type || 'Full-time'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {job.skills.slice(0, 4).map((skill, idx) => (
                                        <span key={idx} className="px-4 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-100 transition-colors">
                                            {skill}
                                        </span>
                                    ))}
                                    {job.skills.length > 4 && (
                                        <span className="px-4 py-1.5 bg-gray-50 border border-gray-200 text-gray-400 rounded-full text-xs font-medium">
                                            +{job.skills.length - 4} more
                                        </span>
                                    )}
                                </div>

                                {/* Timeline */}
                                <div className="flex items-center gap-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {timeAgo(job.createdAt)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        Due {new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>

                            {/* Footer: Posted By + Apply */}
                            <div className="px-5 pb-5">
                                <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl mb-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                        {job.user?.name ? job.user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-gray-400">Posted by</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {job.user?.name || 'Alumni'}{job.user?.year ? `, Class of ${job.user.year}` : ''}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleApply(job._id, job.applyLink)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group/btn shadow-sm hover:shadow-md text-sm"
                                >
                                    Apply Now
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {jobs.length === 0 && (
                    <div className="card p-12 text-center">
                        <div className="text-6xl mb-4">💼</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 heading-font">No Jobs Yet</h3>
                        <p className="text-gray-600">Check back soon for new opportunities!</p>
                    </div>
                )}

                {/* Post Job Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                        <div className="card p-8 w-full max-w-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 heading-font">Post a Job</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Row 1: Title & Company */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1.5 font-semibold">Job Title *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Senior Software Engineer"
                                            required
                                            className="input-field"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1.5 font-semibold">Company *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. TechCorp Solutions"
                                            required
                                            className="input-field"
                                            value={formData.company}
                                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Row 2: Location & Work Mode */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1.5 font-semibold">Location *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. San Francisco, CA"
                                            required
                                            className="input-field"
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1.5 font-semibold">Work Mode</label>
                                        <select
                                            className="input-field"
                                            value={formData.workMode}
                                            onChange={e => setFormData({ ...formData, workMode: e.target.value })}
                                        >
                                            <option value="On-site">On-site</option>
                                            <option value="Remote">Remote</option>
                                            <option value="Hybrid">Hybrid</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Row 3: Role & Job Type */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1.5 font-semibold">Role *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Frontend Developer"
                                            required
                                            className="input-field"
                                            value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1.5 font-semibold">Job Type</label>
                                        <select
                                            className="input-field"
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Internship">Internship</option>
                                            <option value="Contract">Contract</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1.5 font-semibold">Description *</label>
                                    <textarea
                                        placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                                        required
                                        rows="3"
                                        className="input-field"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                {/* Row 4: Salary & Skills */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1.5 font-semibold">Salary Range</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. $120k - $180k"
                                            className="input-field"
                                            value={formData.salaryRange}
                                            onChange={e => setFormData({ ...formData, salaryRange: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1.5 font-semibold">Skills *</label>
                                        <div className="input-field !py-2 flex flex-wrap gap-2 items-center min-h-[42px]">
                                            {formData.skills.map((skill, idx) => (
                                                <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium">
                                                    {skill}
                                                    <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                            <input
                                                type="text"
                                                placeholder={formData.skills.length === 0 ? 'Type a skill & press Enter' : 'Add more...'}
                                                className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
                                                value={skillInput}
                                                onChange={e => setSkillInput(e.target.value)}
                                                onKeyDown={addSkill}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Row 5: Deadline & Apply Link */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1.5 font-semibold">Application Deadline *</label>
                                        <input
                                            type="date"
                                            required
                                            className="input-field"
                                            value={formData.deadline}
                                            onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1.5 font-semibold">Application Link *</label>
                                        <input
                                            type="url"
                                            placeholder="https://..."
                                            required
                                            className="input-field"
                                            value={formData.applyLink}
                                            onChange={e => setFormData({ ...formData, applyLink: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        Post Job
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;
