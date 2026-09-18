import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import api from '../../utils/api';

const JobPostModal = ({ isOpen, onClose, currentUser, onJobPosted }) => {
    if (!isOpen) return null;

    const [skillInput, setSkillInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        company: currentUser.company || '',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
            await api.post('/api/jobs', formData, config);
            onJobPosted();
            onClose();
        } catch (error) {
            console.error('Error posting job:', error);
            alert(error.response?.data?.message || 'Failed to post job');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto my-8 border border-gray-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <X size={20} />
                </button>

                <h3 className="text-2xl font-bold text-gray-900 heading-font mb-1">Post a Job Opportunity</h3>
                <p className="text-xs text-gray-500 mb-6">Share career openings from your company with students and fellow alumni.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Job Title *</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Software Engineer"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Company Name *</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Google"
                                value={formData.company}
                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Location *</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Bangalore, KA"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Work Mode</label>
                            <select
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.workMode}
                                onChange={e => setFormData({ ...formData, workMode: e.target.value })}
                            >
                                <option value="On-site">On-site</option>
                                <option value="Remote">Remote</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Employment Type</label>
                            <select
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Internship">Internship</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Salary Range (Optional)</label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. ₹12 - ₹18 LPA"
                                value={formData.salaryRange}
                                onChange={e => setFormData({ ...formData, salaryRange: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Application URL *</label>
                        <input
                            type="url"
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://careers.company.com/job/123"
                            value={formData.applyLink}
                            onChange={e => setFormData({ ...formData, applyLink: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Required Skills (Press Enter to add)</label>
                        <input
                            type="text"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Type skill and press Enter..."
                            value={skillInput}
                            onChange={e => setSkillInput(e.target.value)}
                            onKeyDown={addSkill}
                        />
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {formData.skills.map((skill, index) => (
                                <span key={index} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100 flex items-center gap-1">
                                    {skill}
                                    <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-600">
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Job Description *</label>
                        <textarea
                            required
                            rows="4"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Provide job details, requirements, and responsibilities..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                        >
                            {isSubmitting ? 'Posting...' : 'Post Opportunity'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobPostModal;
