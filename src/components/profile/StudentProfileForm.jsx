import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const StudentProfileForm = ({
    formData,
    setFormData,
    onSave,
    onCancel,
    handleAddProject,
    handleProjectChange,
    handleRemoveProject
}) => {
    return (
        <form onSubmit={onSave} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-900">Edit Academic & Personal Profile</h3>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            {/* General Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                    <input
                        type="text"
                        required
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Department *</label>
                    <input
                        type="text"
                        required
                        value={formData.department || ''}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="e.g. Computer Science Engineering"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Current Academic Year</label>
                    <select
                        value={formData.year || ''}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">CGPA</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.cgpa || ''}
                        onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                        placeholder="e.g. 8.5"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input
                        type="text"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 9876543210"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
                    <input
                        type="text"
                        value={formData.location || ''}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Bangalore, Karnataka"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Bio & Skills */}
            <div className="space-y-4 pt-2 border-t border-gray-100">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Bio / About Me</label>
                    <textarea
                        rows={3}
                        value={formData.bio || ''}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Brief overview of your academic background and aspirations..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Technical Skills (Comma separated)</label>
                    <input
                        type="text"
                        value={formData.skills || ''}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        placeholder="e.g. React, Java, Python, SQL, Git"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Career Interests (Comma separated)</label>
                    <input
                        type="text"
                        value={formData.careerInterests || ''}
                        onChange={(e) => setFormData({ ...formData, careerInterests: e.target.value })}
                        placeholder="e.g. Software Engineering, Data Science, Web Development"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Projects Manager */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Projects Showcase</h4>
                    <button
                        type="button"
                        onClick={handleAddProject}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                        <Plus size={14} /> Add Project
                    </button>
                </div>

                {formData.projects && formData.projects.length > 0 ? (
                    formData.projects.map((proj, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 relative">
                            <button
                                type="button"
                                onClick={() => handleRemoveProject(idx)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-red-600 p-1"
                                title="Remove Project"
                            >
                                <Trash2 size={15} />
                            </button>

                            <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Project Title</label>
                                <input
                                    type="text"
                                    value={proj.title || ''}
                                    onChange={(e) => handleProjectChange(idx, 'title', e.target.value)}
                                    placeholder="e.g. PCDP Student Portal"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Project Description</label>
                                <textarea
                                    rows={2}
                                    value={proj.description || ''}
                                    onChange={(e) => handleProjectChange(idx, 'description', e.target.value)}
                                    placeholder="Key details and technologies used..."
                                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-gray-400 italic">No projects added yet. Click 'Add Project' to showcase your work.</p>
                )}
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                    Save Changes
                </button>
            </div>
        </form>
    );
};

export default StudentProfileForm;
