import React from 'react';
import {
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    Edit3,
    User,
    Github,
    Linkedin,
    Twitter,
    ExternalLink,
    Users,
    Award,
    Shield,
    CheckCircle2,
    MessageSquare
} from 'lucide-react';
import { getImageUrl } from '../../utils/imageUrl';

const ProfileHeader = ({
    profile,
    isOwnProfile,
    isEditing,
    setIsEditing,
    uploadingImage,
    handleImageUpload,
    strength,
    onSendMessage
}) => {
    if (!profile) return null;

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
            {/* Cover Banner */}
            <div className="h-44 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 relative">
                {profile.coverPicture && (
                    <img
                        src={getImageUrl(profile.coverPicture)}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                )}
                {isOwnProfile && (
                    <label className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/70 text-white text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors backdrop-blur-sm flex items-center gap-1.5">
                        <Edit3 size={13} /> Edit Cover
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, 'coverPicture')}
                            disabled={uploadingImage}
                        />
                    </label>
                )}
            </div>

            {/* User Meta Row */}
            <div className="px-6 pb-6 relative">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-12 mb-4">
                    
                    {/* Avatar Container */}
                    <div className="relative inline-block">
                        {profile.profilePicture ? (
                            <img
                                src={getImageUrl(profile.profilePicture)}
                                alt={profile.name}
                                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-white object-cover shadow-md bg-white"
                            />
                        ) : (
                            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-white bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-extrabold text-4xl flex items-center justify-center shadow-md">
                                {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                        )}

                        {isOwnProfile && (
                            <label className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl cursor-pointer shadow-md transition-colors">
                                <Edit3 size={14} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageUpload(e, 'profilePicture')}
                                    disabled={uploadingImage}
                                />
                            </label>
                        )}
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center gap-3">
                        {!isOwnProfile && onSendMessage && (
                            <button
                                onClick={onSendMessage}
                                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
                            >
                                <MessageSquare size={16} /> Send Message
                            </button>
                        )}

                        {isOwnProfile && (
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 border ${
                                    isEditing
                                        ? 'bg-gray-100 text-gray-700 border-gray-300'
                                        : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                }`}
                            >
                                <Edit3 size={16} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Name, Role & Details */}
                <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-2xl font-bold text-gray-900 heading-font">{profile.name}</h1>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                            profile.role === 'alumni'
                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}>
                            {profile.role === 'alumni' ? '💼 Alumni' : '🎓 Student'}
                        </span>

                        {profile.isVerified && (
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 size={13} /> Verified Member
                            </span>
                        )}
                    </div>

                    <p className="text-sm font-semibold text-gray-700">
                        {profile.role === 'student'
                            ? `${profile.department || 'Department Student'} ${profile.year ? '• Year ' + profile.year : ''}`
                            : `${profile.currentRole || 'Professional'} ${profile.company ? '@ ' + profile.company : ''}`}
                    </p>

                    {/* Contact Badges */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 flex-wrap">
                        {profile.location && (
                            <span className="flex items-center gap-1"><MapPin size={14} className="text-gray-400" /> {profile.location}</span>
                        )}
                        {profile.email && (!profile.privacy?.hideEmail || isOwnProfile) && (
                            <span className="flex items-center gap-1"><Mail size={14} className="text-gray-400" /> {profile.email}</span>
                        )}
                        {profile.phone && (!profile.privacy?.hidePhone || isOwnProfile) && (
                            <span className="flex items-center gap-1"><Phone size={14} className="text-gray-400" /> {profile.phone}</span>
                        )}
                    </div>

                    {/* Profile Strength Meter */}
                    {isOwnProfile && (
                        <div className="mt-4 pt-3 border-t border-gray-100 max-w-xs">
                            <div className="flex items-center justify-between text-xs mb-1 font-semibold text-gray-700">
                                <span>Profile Strength</span>
                                <span>{strength}%</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-500"
                                    style={{ width: `${strength}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ProfileHeader;
