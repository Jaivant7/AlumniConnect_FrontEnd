import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const AlumniProfileForm = ({
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
                <h3 className="text-lg font-bold text-gray-900">Edit Professional & Alumni Profile</h3>
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
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Company Name</label>
                    <input
                        type="text"
                        value={formData.company || ''}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Google / Microsoft"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Current Role / Designation</label>
                    <input
                        type="text"
                        value={formData.currentRole || ''}
                        onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                        placeholder="e.g. Senior Software Engineer"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Years of Experience</label>
                    <input
                        type="number"
                        value={formData.yearsOfExperience || ''}
                        onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                        placeholder="e.g. 5"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Graduation Year</label>
                    <input
                        type="number"
                        value={formData.graduationYear || ''}
                        onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                        placeholder="e.g. 2022"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
                    <input
                        type="text"
                        value={formData.location || ''}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Bangalore, India"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Mentorship & Bio */}
            <div className="space-y-4 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="mentorshipAvailability"
                        checked={formData.mentorshipAvailability || false}
                        onChange={(e) => setFormData({ ...formData, mentorshipAvailability: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label htmlFor="mentorshipAvailability" className="text-xs font-semibold text-gray-800 cursor-pointer">
                        Available for Student Mentorship & Career Advice
                    </label>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Bio / Professional Summary</label>
                    <textarea
                        rows={3}
                        value={formData.bio || ''}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Summary of your career trajectory, accomplishments, and domain focus..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Expertise / Skills (Comma separated)</label>
                    <input
                        type="text"
                        value={formData.skills || ''}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        placeholder="e.g. Distributed Systems, Cloud Architecture, Node.js, Leadership"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Projects Manager */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Major Accomplishments & Projects</h4>
                    <button
                        type="button"
                        onClick={handleAddProject}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                        <Plus size={14} /> Add Item
                    </button>
                </div>

                {formData.projects && formData.projects.length > 0 ? (
                    formData.projects.map((proj, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 relative">
                            <button
                                type="button"
                                onClick={() => handleRemoveProject(idx)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-red-600 p-1"
                                title="Remove Item"
                            >
                                <Trash2 size={15} />
                            </button>

                            <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={proj.title || ''}
                                    onChange={(e) => handleProjectChange(idx, 'title', e.target.value)}
                                    placeholder="e.g. Enterprise Microservices Migration"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={2}
                                    value={proj.description || ''}
                                    onChange={(e) => handleProjectChange(idx, 'description', e.target.value)}
                                    placeholder="Overview of impact and achievements..."
                                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-gray-400 italic">No items added yet. Click 'Add Item' to display your professional work.</p>
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

export default AlumniProfileForm;
