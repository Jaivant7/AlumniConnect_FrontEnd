import React, { useState } from 'react';
import {
    X,
    Upload,
    CheckCircle2,
    AlertCircle,
    Check
} from 'lucide-react';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/imageUrl';

const COLLEGE_EVENT_TYPES = [
    'Seminar', 'Guest Lecture', 'Workshop', 'Symposium', 'Technical Event', 'Club Event', 'Department Event', 'Alumni Interaction', 'Other'
];

const ALUMNI_EVENT_TYPES = [
    'Hackathon', 'Coding Competition', 'Case Study Competition', 'Innovation Challenge', 'Technical Challenge', 'Company Workshop', 'Hiring Challenge', 'Industry Competition', 'Other'
];

const ACADEMIC_YEARS_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Alumni', 'All'];
const DEPARTMENTS_OPTIONS = ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'AI/DS', 'Any Department'];

const EventFormModal = ({
    isOpen,
    onClose,
    editingEventId,
    formCategory,
    setFormCategory,
    formData,
    setFormData,
    currentUser,
    onSubmitSuccess
}) => {
    if (!isOpen) return null;

    const [uploadingBanner, setUploadingBanner] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const handleFileUpload = async (file, type) => {
        if (!file) return;

        if (file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif')) {
            alert('GIF files (.gif) are prohibited! Please select a JPG, PNG, or WEBP image.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File is too large! Maximum allowed size is 5MB.');
            return;
        }

        const uploadData = new FormData();
        uploadData.append('image', file);

        if (type === 'banner') setUploadingBanner(true);
        if (type === 'logo') setUploadingLogo(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${currentUser.token}`
                },
            };
            const { data } = await api.post('/api/upload', uploadData, config);

            if (type === 'banner') setFormData(prev => ({ ...prev, bannerImageUrl: data.imageUrl }));
            if (type === 'logo') setFormData(prev => ({ ...prev, companyLogo: data.imageUrl }));
        } catch (error) {
            console.error('Error uploading image', error);
            alert(error.response?.data?.message || 'Failed to upload image. Please try again.');
        } finally {
            if (type === 'banner') setUploadingBanner(false);
            if (type === 'logo') setUploadingLogo(false);
        }
    };

    const toggleYearSelection = (yr) => {
        setFormData(prev => {
            let current = [...prev.eligibilityYears];
            if (yr === 'All') {
                return { ...prev, eligibilityYears: ['All'] };
            }
            current = current.filter(y => y !== 'All');
            if (current.includes(yr)) {
                current = current.filter(y => y !== yr);
            } else {
                current.push(yr);
            }
            if (current.length === 0) current = ['All'];
            return { ...prev, eligibilityYears: current };
        });
    };

    const toggleDepartmentSelection = (dept) => {
        setFormData(prev => {
            let current = [...prev.eligibilityDepts];
            if (dept === 'Any Department') {
                return { ...prev, eligibilityDepts: ['Any Department'] };
            }
            current = current.filter(d => d !== 'Any Department');
            if (current.includes(dept)) {
                current = current.filter(d => d !== dept);
            } else {
                current.push(dept);
            }
            if (current.length === 0) current = ['Any Department'];
            return { ...prev, eligibilityDepts: current };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!formData.title || !formData.description || !formData.eventType || !formData.eventDate || !formData.startTime || !formData.endTime || !formData.location || !formData.registrationDeadline) {
            setFormError('Please fill in all required fields marked with *');
            return;
        }

        if (new Date(formData.registrationDeadline) > new Date(formData.eventDate)) {
            setFormError('Registration deadline cannot be after the event date.');
            return;
        }

        setIsSubmitting(true);
        try {
            const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
            const payload = {
                title: formData.title,
                description: formData.description,
                eventType: formData.eventType,
                eventCategory: formCategory,
                organizerName: formData.organizerName,
                companyName: formData.companyName,
                companyLogo: formData.companyLogo,
                bannerImageUrl: formData.bannerImageUrl,
                eventDate: formData.eventDate,
                startTime: formData.startTime,
                endTime: formData.endTime,
                location: formData.location,
                mode: formData.mode,
                eligibility: {
                    years: formData.eligibilityYears,
                    departments: formData.eligibilityDepts,
                    minCgpa: formData.minCgpa ? parseFloat(formData.minCgpa) : 0,
                    otherRequirements: formData.otherEligibility,
                },
                skillsRequired: formData.skillsRequired,
                maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : 0,
                registrationDeadline: formData.registrationDeadline,
                registrationLink: formData.registrationLink,
                contactInformation: formData.contactInformation,
            };

            let res;
            if (editingEventId) {
                res = await api.put(`/api/events/${editingEventId}`, payload, config);
            } else {
                res = await api.post('/api/events', payload, config);
            }

            onSubmitSuccess(res.data, !!editingEventId);
            onClose();
        } catch (error) {
            setFormError(error.response?.data?.message || 'Failed to submit event. Please check all fields.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getAvailableTypesForForm = () => {
        if (formCategory === 'INDUSTRY') return ALUMNI_EVENT_TYPES;
        return COLLEGE_EVENT_TYPES;
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

                <div className="mb-6">
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                            formCategory === 'INDUSTRY' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}>
                            {formCategory === 'INDUSTRY' ? '💼 Industry Opportunity' : '🎓 College Event'}
                        </span>
                        {currentUser.role === 'admin' && (
                            <div className="inline-flex p-1 bg-gray-100 rounded-xl text-xs font-bold">
                                <button
                                    type="button"
                                    onClick={() => { setFormCategory('COLLEGE'); setFormData(p => ({ ...p, eventType: COLLEGE_EVENT_TYPES[0] })); }}
                                    className={`px-2.5 py-1 rounded-lg ${formCategory === 'COLLEGE' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600'}`}
                                >
                                    College
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setFormCategory('INDUSTRY'); setFormData(p => ({ ...p, eventType: ALUMNI_EVENT_TYPES[0] })); }}
                                    className={`px-2.5 py-1 rounded-lg ${formCategory === 'INDUSTRY' ? 'bg-white text-purple-700 shadow-xs' : 'text-gray-600'}`}
                                >
                                    Company
                                </button>
                            </div>
                        )}
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 heading-font mt-2">
                        {editingEventId ? 'Edit Event' : formCategory === 'INDUSTRY' ? 'Post Company Event' : 'Post College Event'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {formCategory === 'INDUSTRY'
                            ? 'Post genuine company hackathons, coding challenges, or hiring competitions for college students.'
                            : 'Organize campus seminars, workshops, or department events.'}
                    </p>
                </div>

                {formError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                        <AlertCircle size={16} /> {formError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Title & Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                {formCategory === 'INDUSTRY' ? 'Event / Competition Title *' : 'Event Title *'}
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder={formCategory === 'INDUSTRY' ? 'e.g. National CodeSprint 2026' : 'e.g. Guest Lecture on Cloud Architecture'}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Event Type *</label>
                            <select
                                value={formData.eventType}
                                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            >
                                {getAvailableTypesForForm().map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Event Mode *</label>
                            <select
                                value={formData.mode}
                                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            >
                                <option value="Offline">Offline / In-Person</option>
                                <option value="Online">Online Virtual</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                    </div>

                    {/* Host Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {formCategory === 'INDUSTRY' ? (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Company Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        placeholder="e.g. Google / Microsoft"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Company Logo</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg, image/webp"
                                            id="company-logo-input"
                                            className="hidden"
                                            onChange={(e) => handleFileUpload(e.target.files[0], 'logo')}
                                        />
                                        <label
                                            htmlFor="company-logo-input"
                                            className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                                        >
                                            <Upload size={14} /> {uploadingLogo ? 'Uploading Logo...' : 'Upload Company Logo'}
                                        </label>
                                        {formData.companyLogo && (
                                            <img src={getImageUrl(formData.companyLogo)} alt="Logo" className="w-8 h-8 rounded border object-cover" />
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-bold text-gray-700 mb-1">Organizer / Club / Department Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.organizerName}
                                    onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
                                    placeholder="e.g. CSE Department / ACM Student Chapter"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                />
                            </div>
                        )}
                    </div>

                    {/* Banner Image Upload */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Event Banner Image</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                id="event-banner-input"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e.target.files[0], 'banner')}
                            />
                            <label
                                htmlFor="event-banner-input"
                                className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 border border-blue-200"
                            >
                                <Upload size={14} /> {uploadingBanner ? 'Uploading Banner...' : 'Choose Banner File'}
                            </label>

                            {formData.bannerImageUrl && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                                        <Check size={14} /> Uploaded
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, bannerImageUrl: '' })}
                                        className="text-xs text-red-600 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* STRUCTURED ELIGIBILITY SECTION */}
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-blue-600" /> Event Eligibility Requirements *
                        </h4>

                        {/* Academic Year Chips */}
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">Academic Standing / Year:</label>
                            <div className="flex flex-wrap gap-1.5">
                                {ACADEMIC_YEARS_OPTIONS.map(yr => {
                                    const isSel = formData.eligibilityYears.includes(yr);
                                    return (
                                        <button
                                            key={yr}
                                            type="button"
                                            onClick={() => toggleYearSelection(yr)}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                                isSel
                                                    ? 'bg-blue-600 text-white shadow-2xs'
                                                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {yr}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Department Chips */}
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">Allowed Departments:</label>
                            <div className="flex flex-wrap gap-1.5">
                                {DEPARTMENTS_OPTIONS.map(dept => {
                                    const isSel = formData.eligibilityDepts.includes(dept);
                                    return (
                                        <button
                                            key={dept}
                                            type="button"
                                            onClick={() => toggleDepartmentSelection(dept)}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                                isSel
                                                    ? 'bg-indigo-600 text-white shadow-2xs'
                                                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {dept}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Min CGPA & Extra Notes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Minimum CGPA (Optional)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    value={formData.minCgpa}
                                    onChange={(e) => setFormData({ ...formData, minCgpa: e.target.value })}
                                    placeholder="e.g. 7.0"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Additional Requirements</label>
                                <input
                                    type="text"
                                    value={formData.otherEligibility}
                                    onChange={(e) => setFormData({ ...formData, otherEligibility: e.target.value })}
                                    placeholder="e.g. Open to students from all VTU colleges"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Skills Required */}
                    {formCategory === 'INDUSTRY' && (
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Required Skills (Comma-separated)</label>
                            <input
                                type="text"
                                value={formData.skillsRequired}
                                onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })}
                                placeholder="e.g. Python, React, Data Structures, Machine Learning"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            />
                        </div>
                    )}

                    {/* Dates & Timings */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Event Date *</label>
                            <input
                                type="date"
                                required
                                value={formData.eventDate}
                                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Start Time *</label>
                            <input
                                type="text"
                                required
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                placeholder="e.g. 10:00 AM"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">End Time *</label>
                            <input
                                type="text"
                                required
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                placeholder="e.g. 04:00 PM"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Location & Registration Deadline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Venue / Meeting Information *</label>
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g. Main Auditorium / Google Meet Link"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Registration Deadline *</label>
                            <input
                                type="date"
                                required
                                value={formData.registrationDeadline}
                                onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Optional Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Max Capacity (Optional)</label>
                            <input
                                type="number"
                                value={formData.maxParticipants}
                                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                                placeholder="0 for unlimited"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Registration Link (Optional)</label>
                            <input
                                type="url"
                                value={formData.registrationLink}
                                onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                                placeholder="https://hackerearth.com/..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Contact Email / Phone</label>
                            <input
                                type="text"
                                value={formData.contactInformation}
                                onChange={(e) => setFormData({ ...formData, contactInformation: e.target.value })}
                                placeholder="events@college.edu"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Event Description & Rules *</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Provide detailed information, schedule, guidelines, prizes, or tracks..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                        />
                    </div>

                    {/* Submit Controls */}
                    <div className="pt-3 flex justify-end gap-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || uploadingBanner || uploadingLogo}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                        >
                            {isSubmitting ? 'Publishing...' : editingEventId ? 'Update Event' : 'Publish Event'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EventFormModal;
