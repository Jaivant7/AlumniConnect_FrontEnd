import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Edit3, User, Github, Linkedin, Twitter, ExternalLink, Users, Award, FileText, Globe, ChevronRight, BookOpen, Target, Code, Star, Shield, Building2, TrendingUp, Heart } from 'lucide-react';

const AlumniProfile = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get(`http://localhost:5000/api/users/${id}`, config);
            setProfile(res.data);

            setFormData({
                name: res.data.name || '',
                phone: res.data.phone || '',
                location: res.data.location || '',
                bio: res.data.bio || '',
                interests: res.data.interests ? res.data.interests.join(', ') : '',
                skills: res.data.skills ? res.data.skills.join(', ') : '',
                socialLinks: {
                    linkedin: res.data.socialLinks?.linkedin || '',
                    github: res.data.socialLinks?.github || '',
                    portfolio: res.data.socialLinks?.portfolio || '',
                },
                department: res.data.department || '',
                year: res.data.year || '',
                registerNumber: res.data.registerNumber || '',
                cgpa: res.data.cgpa || '',
                careerInterests: res.data.careerInterests ? res.data.careerInterests.join(', ') : '',
                lookingFor: res.data.lookingFor || '',
                company: res.data.company || '',
                currentRole: res.data.currentRole || '',
                industry: res.data.industry || '',
                yearsOfExperience: res.data.yearsOfExperience || '',
                graduationYear: res.data.graduationYear || '',
                degree: res.data.degree || '',
                domainExpertise: res.data.domainExpertise ? res.data.domainExpertise.join(', ') : '',
                mentorshipAvailability: res.data.mentorshipAvailability || false,
                privacy: {
                    hideEmail: res.data.privacy?.hideEmail || false,
                    hidePhone: res.data.privacy?.hidePhone || true,
                },
                projects: res.data.projects || [],
                profilePicture: res.data.profilePicture || '',
                coverPicture: res.data.coverPicture || '',
                achievements: res.data.achievements ? res.data.achievements.join(', ') : ''
            });
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch profile. They might have restricted privacy settings or do not exist.');
            setLoading(false);
        }
    };

    const isOwnProfile = user && user._id === id;

    const calculateStrength = (p) => {
        if (!p) return 0;
        let score = 0;
        let total = 0;

        const check = (val) => {
            total++;
            if (Array.isArray(val)) {
                if (val.length > 0) score++;
            } else if (val) {
                score++;
            }
        };

        check(p.name); check(p.email); check(p.bio); check(p.phone); check(p.skills); check(p.interests);
        check(p.socialLinks?.linkedin || p.socialLinks?.github || p.socialLinks?.portfolio);

        if (p.role === 'student') {
            check(p.department); check(p.year); check(p.cgpa); check(p.lookingFor); check(p.projects);
        } else if (p.role === 'alumni') {
            check(p.company); check(p.currentRole); check(p.industry); check(p.yearsOfExperience); check(p.projects);
        }

        return Math.round((score / total) * 100) || 0;
    };

    const strength = calculateStrength(profile);

    const handleAddProject = () => {
        setFormData({ ...formData, projects: [...(formData.projects || []), { title: '', description: '', tech: [] }] });
    };

    const handleProjectChange = (index, field, value) => {
        const newProjects = [...formData.projects];
        if (field === 'tech') {
            newProjects[index][field] = value.split(',').map(s => s.trim());
        } else {
            newProjects[index][field] = value;
        }
        setFormData({ ...formData, projects: newProjects });
    };

    const handleRemoveProject = (index) => {
        const newProjects = [...formData.projects];
        newProjects.splice(index, 1);
        setFormData({ ...formData, projects: newProjects });
    };

    const handleImageUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        setUploadingImage(true);
        try {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
            };
            const { data } = await axios.post('http://localhost:5000/api/upload', uploadData, config);

            const updatedData = { ...formData, [type]: data.imageUrl };

            if (isEditing) {
                setFormData(updatedData);
            }

            if (user && user.token) {
                const updateConfig = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.put(`http://localhost:5000/api/users/${id}`, { [type]: data.imageUrl }, updateConfig);
                setProfile(prev => ({ ...prev, [type]: data.imageUrl }));
            }
        } catch (error) {
            console.error('Error uploading image', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const processedData = {
                ...formData,
                interests: typeof formData.interests === 'string' ? formData.interests.split(',').map(s => s.trim()).filter(Boolean) : formData.interests,
                skills: typeof formData.skills === 'string' ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : formData.skills,
                careerInterests: typeof formData.careerInterests === 'string' ? formData.careerInterests.split(',').map(s => s.trim()).filter(Boolean) : formData.careerInterests,
                domainExpertise: typeof formData.domainExpertise === 'string' ? formData.domainExpertise.split(',').map(s => s.trim()).filter(Boolean) : formData.domainExpertise,
                achievements: typeof formData.achievements === 'string' ? formData.achievements.split(',').map(s => s.trim()).filter(Boolean) : formData.achievements,
            };

            await axios.put(`http://localhost:5000/api/users/${id}`, processedData, config);
            await fetchProfile(); // Re-fetch to get dynamic fields like connections and posted jobs
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert('Failed to update profile');
        }
    };

    const handleChat = () => {
        navigate('/chat');
    };

    // Strength color helper
    const getStrengthColor = (s) => {
        if (s >= 80) return { ring: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Excellent' };
        if (s >= 60) return { ring: '#3b82f6', bg: 'bg-blue-50', text: 'text-blue-700', label: 'Good' };
        if (s >= 40) return { ring: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-700', label: 'Fair' };
        return { ring: '#ef4444', bg: 'bg-red-50', text: 'text-red-700', label: 'Needs Work' };
    };

    const strengthInfo = getStrengthColor(strength);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/20 to-indigo-50/20">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-sm text-gray-500 font-medium animate-pulse">Loading profile...</p>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/20 to-indigo-50/20">
            <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8 max-w-md text-center">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-red-600 font-semibold">{error}</p>
            </div>
        </div>
    );

    if (!profile) return null;

    const renderContactInfo = () => {
        const canSeeEmail = isOwnProfile || !profile.privacy?.hideEmail;
        const canSeePhone = isOwnProfile || !profile.privacy?.hidePhone;

        return (
            <div className="flex flex-wrap gap-3 mt-3">
                {canSeeEmail && profile.email && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm text-gray-600">{profile.email}</span>
                    </div>
                )}
                {canSeePhone && profile.phone && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm text-gray-600">{profile.phone}</span>
                    </div>
                )}
            </div>
        );
    };

    // Section card wrapper for consistency
    const SectionCard = ({ children, className = '', delay = '0s' }) => (
        <div
            className={`bg-white rounded-2xl border border-gray-100/80 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 ${className}`}
            style={{ animation: `slideUp 0.5s ease-out ${delay} both` }}
        >
            {children}
        </div>
    );

    const SectionHeader = ({ icon: Icon, iconBg, iconColor, title, badge }) => (
        <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center shadow-sm`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <h2 className="text-lg font-bold text-gray-900 heading-font text-xl">{title}</h2>
            </div>
            {badge}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/20 to-indigo-50/20 body-font pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                {/* ── Cover Image ── */}
                <div className="relative animate-fade-in max-w-5xl mx-auto px-2 sm:px-4">
                    <div className={`h-36 sm:h-44 md:h-52 w-full relative overflow-hidden rounded-t-3xl ${!profile.coverPicture ? 'bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-600' : ''}`}>
                        {profile.coverPicture ? (
                            <img src={`http://localhost:5000${profile.coverPicture}`} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                            <>
                                {/* Decorative shapes for default cover */}
                                <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                                <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-violet-400/20 rounded-full blur-3xl"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
                            </>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"></div>

                        {isOwnProfile && (
                            <label className="absolute top-4 right-4 sm:top-5 sm:right-5 px-4 py-2 bg-black/20 hover:bg-black/30 backdrop-blur-md rounded-full text-white text-xs sm:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer border border-white/10">
                                {uploadingImage ? <span className="animate-pulse">Uploading...</span> : <><Edit3 className="w-3.5 h-3.5" /> Change Cover</>}
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'coverPicture')} disabled={uploadingImage} />
                            </label>
                        )}
                    </div>

                    {/* ── Profile Header Card (LinkedIn-style) ── */}
                    <div className="relative bg-white rounded-b-3xl rounded-t-none shadow-lg border border-gray-100 border-t-0 px-6 sm:px-8 pb-6 pt-0" style={{ animation: 'slideUp 0.4s ease-out 0.1s both' }}>

                            {/* Avatar — overlaps cover */}
                            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                                <div className="relative -mt-16 sm:-mt-20 shrink-0 self-center sm:self-auto">
                                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-[5px] border-white shadow-xl bg-gray-100">
                                        {profile.profilePicture ? (
                                            <img src={`http://localhost:5000${profile.profilePicture}`} alt={profile.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-4xl sm:text-5xl font-bold text-white select-none">
                                                {profile.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    {isOwnProfile && (
                                        <label className="absolute bottom-1 right-1 w-10 h-10 bg-violet-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-violet-700 transition-colors border-[3px] border-white">
                                            <Edit3 className="w-4 h-4" />
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'profilePicture')} disabled={uploadingImage} />
                                        </label>
                                    )}
                                </div>

                                {/* Name + quick actions row */}
                                <div className="flex-1 min-w-0 pb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-center sm:text-left">
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 heading-font">{profile.name}</h1>
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-xs font-semibold border border-violet-100">
                                                <Briefcase className="w-3.5 h-3.5" />
                                                Alumni
                                            </span>
                                            {profile.mentorshipAvailability && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-100">
                                                    <Heart className="w-3.5 h-3.5" />
                                                    Mentor
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-500 mt-0.5 text-sm font-medium">
                                            {profile.currentRole || 'Professional'} at {profile.company || 'Company'}{profile.industry ? ` • ${profile.industry}` : ''}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3 justify-center sm:justify-end flex-shrink-0">
                                        {isOwnProfile ? (
                                            <button
                                                onClick={() => setIsEditing(!isEditing)}
                                                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-full font-semibold transition-all flex items-center gap-2 shadow-md shadow-violet-600/20 hover:shadow-lg hover:shadow-violet-600/30 text-sm"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                                {isEditing ? 'Cancel' : 'Edit Profile'}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleChat}
                                                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-md shadow-violet-600/20 hover:shadow-lg flex items-center gap-2 text-sm"
                                            >
                                                <Mail className="w-4 h-4" />
                                                Message
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-100 mt-5 mb-5"></div>

                            {/* Info row */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                                    {/* Contact Info inline */}
                                    {(isOwnProfile || !profile.privacy?.hideEmail) && profile.email && (
                                        <div className="flex items-center gap-1.5 text-gray-500">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm">{profile.email}</span>
                                        </div>
                                    )}
                                    {(isOwnProfile || !profile.privacy?.hidePhone) && profile.phone && (
                                        <div className="flex items-center gap-1.5 text-gray-500">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm">{profile.phone}</span>
                                        </div>
                                    )}
                                    {profile.location && (
                                        <div className="flex items-center gap-1.5 text-gray-500">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm">{profile.location}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Right side: connections + strength */}
                                <div className="flex items-center gap-5">
                                    {/* Connections */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-1.5">
                                            {profile.connections && profile.connections.length > 0 ? (
                                                profile.connections.slice(0, 3).map((conn) => (
                                                    <div key={conn._id} title={conn.name} className="w-6 h-6 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] font-bold">
                                                        {conn.name.charAt(0).toUpperCase()}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="w-6 h-6 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center text-gray-400">
                                                    <User className="w-3 h-3" />
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-gray-600">
                                            {profile.connections ? `${profile.connections.length} Connection${profile.connections.length !== 1 ? 's' : ''}` : '0 Connections'}
                                        </span>
                                    </div>

                                    {/* Strength ring */}
                                    {isOwnProfile && !isEditing && (
                                        <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-gray-200">
                                            <div className="relative w-10 h-10">
                                                <svg className="w-10 h-10 transform -rotate-90">
                                                    <circle cx="20" cy="20" r="16" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                                                    <circle cx="20" cy="20" r="16" fill="none" stroke={strengthInfo.ring} strokeWidth="3" strokeDasharray={`${strength * 1.005}px 200px`} strokeLinecap="round" className="transition-all duration-700" />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-[10px] font-bold text-gray-700">{strength}%</span>
                                                </div>
                                            </div>
                                            <span className={`text-xs font-semibold ${strengthInfo.text}`}>{strengthInfo.label}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Social Links row */}
                            {!isEditing && (profile.socialLinks?.linkedin || profile.socialLinks?.github || profile.socialLinks?.portfolio) && (
                                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                    {profile.socialLinks?.linkedin && (
                                        <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-9 h-9 bg-gray-50 hover:bg-blue-50 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all">
                                            <Linkedin className="w-4 h-4" />
                                        </a>
                                    )}
                                    {profile.socialLinks?.github && (
                                        <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="w-9 h-9 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all">
                                            <Github className="w-4 h-4" />
                                        </a>
                                    )}
                                    {profile.socialLinks?.portfolio && (
                                        <a href={profile.socialLinks.portfolio} target="_blank" rel="noreferrer" className="w-9 h-9 bg-gray-50 hover:bg-indigo-50 rounded-full flex items-center justify-center text-gray-400 hover:text-indigo-500 transition-all">
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="h-6"></div>

                        {/* ── Content Grid ── */}
                        {!isEditing ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Column */}
                                <div className="lg:col-span-2 space-y-6">

                                    {/* About */}
                                    <SectionCard delay="0.15s">
                                        <SectionHeader icon={User} iconBg="bg-violet-50" iconColor="text-violet-600" title="About" />
                                        <p className="text-gray-600 leading-relaxed whitespace-pre-line text-[15px]">
                                            {profile.bio || "No bio provided yet. Add a short summary to tell others about yourself!"}
                                        </p>
                                    </SectionCard>

                                    {/* Skills */}
                                    <SectionCard delay="0.2s">
                                        <SectionHeader icon={Code} iconBg="bg-emerald-50" iconColor="text-emerald-600" title="Skills & Expertise" />
                                        <div className="flex flex-wrap gap-2">
                                            {profile.skills && profile.skills.length > 0 ? (
                                                profile.skills.map((skill, idx) => (
                                                    <span key={idx} className="px-3.5 py-1.5 bg-gradient-to-r from-slate-50 to-gray-50 text-gray-700 rounded-lg text-sm font-medium border border-gray-200/80 hover:border-violet-200 hover:bg-violet-50/50 hover:text-violet-700 transition-all cursor-default">
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-400 italic">No skills listed yet.</p>
                                            )}
                                        </div>
                                    </SectionCard>

                                    {/* Projects */}
                                    <SectionCard delay="0.25s">
                                        <SectionHeader
                                            icon={Briefcase}
                                            iconBg="bg-orange-50"
                                            iconColor="text-orange-600"
                                            title="Projects"
                                            badge={profile.projects?.length > 0 && (
                                                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
                                                    {profile.projects.length}
                                                </span>
                                            )}
                                        />
                                        <div className="space-y-3">
                                            {profile.projects && profile.projects.length > 0 ? (
                                                profile.projects.map((project, idx) => (
                                                    <div key={idx} className="group p-4 bg-gradient-to-r from-gray-50/80 to-slate-50/50 rounded-xl border border-gray-100 hover:border-violet-200/60 hover:shadow-sm transition-all">
                                                        <div className="flex items-start justify-between">
                                                            <div className="min-w-0 flex-1">
                                                                <h3 className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">{project.title}</h3>
                                                                <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{project.description}</p>
                                                            </div>
                                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-violet-400 transition-colors mt-1 shrink-0 ml-3" />
                                                        </div>
                                                        {project.tech && project.tech.length > 0 && (
                                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                                {project.tech.map((t, i) => (
                                                                    <span key={i} className="px-2 py-0.5 bg-white text-gray-500 rounded-md text-xs font-medium border border-gray-200/60">
                                                                        {t}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-400 italic">No projects added yet.</p>
                                            )}
                                        </div>
                                    </SectionCard>

                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">

                                    {/* Professional Info (Alumni) */}
                                    {profile.role === 'alumni' && (
                                        <SectionCard delay="0.2s">
                                            <SectionHeader icon={Building2} iconBg="bg-indigo-50" iconColor="text-indigo-600" title="Professional" />
                                            <div className="space-y-4">
                                                {[
                                                    { label: 'Company', value: profile.company, icon: Building2 },
                                                    { label: 'Role', value: profile.currentRole, icon: Briefcase },
                                                    { label: 'Industry', value: profile.industry, icon: TrendingUp },
                                                    { label: 'Experience', value: profile.yearsOfExperience ? `${profile.yearsOfExperience} years` : null, icon: Award },
                                                ].map((item, idx) => (
                                                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                                        <span className="text-sm text-gray-500 font-medium">{item.label}</span>
                                                        <span className="text-sm font-semibold text-gray-900">{item.value || 'N/A'}</span>
                                                    </div>
                                                ))}
                                                {profile.mentorshipAvailability && (
                                                    <div className="mt-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                                                        <div className="flex items-center gap-2">
                                                            <Heart className="w-4 h-4 text-emerald-600" />
                                                            <span className="text-sm font-semibold text-emerald-700">Available for Mentorship</span>
                                                        </div>
                                                        <p className="text-xs text-emerald-600 mt-1 ml-6">Open to mentoring students</p>
                                                    </div>
                                                )}
                                            </div>
                                        </SectionCard>
                                    )}

                                    {/* Achievements */}
                                    <SectionCard delay="0.3s">
                                        <SectionHeader icon={Award} iconBg="bg-amber-50" iconColor="text-amber-600" title="Achievements" />
                                        <div className="space-y-2">
                                            {profile.achievements && profile.achievements.length > 0 ? (
                                                profile.achievements.map((item, idx) => (
                                                    <div key={idx} className="flex items-start gap-3 p-3 bg-gradient-to-r from-amber-50/50 to-yellow-50/30 rounded-xl border border-amber-100/50">
                                                        <div className="mt-0.5 shrink-0">
                                                            <Star className="w-4 h-4 text-amber-500" />
                                                        </div>
                                                        <p className="font-medium text-gray-800 text-sm leading-relaxed">{item}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-400 italic">No achievements added yet.</p>
                                            )}
                                        </div>
                                    </SectionCard>

                                </div>
                            </div>
                        ) : (
                            /* ── EDIT FORM ── */
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 animate-fade-in">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                                        <Edit3 className="w-5 h-5 text-violet-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 heading-font">Edit Profile</h2>
                                </div>

                                <form onSubmit={handleSave} className="space-y-8">
                                    {/* General Information */}
                                    <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2"><User className="w-5 h-5 text-violet-600" /> General Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
                                                <input type="text" className="input-field bg-white" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                                                <input type="tel" className="input-field bg-white" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
                                                <input type="text" className="input-field bg-white" placeholder="e.g. City, State" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio / About Me</label>
                                                <textarea className="input-field bg-white" rows="3" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })}></textarea>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Skills (comma separated)</label>
                                                <input type="text" className="input-field bg-white" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Interests (comma separated)</label>
                                                <input type="text" className="input-field bg-white" value={formData.interests} onChange={e => setFormData({ ...formData, interests: e.target.value })} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Achievements (comma separated)</label>
                                                <textarea className="input-field bg-white" rows="2" placeholder="e.g. Won 1st prize in Hackathon, Best Outgoing Student 2024" value={formData.achievements} onChange={e => setFormData({ ...formData, achievements: e.target.value })}></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Social Links */}
                                    <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-violet-600" /> Social Links</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">LinkedIn URL</label>
                                                <input type="url" className="input-field bg-white" value={formData.socialLinks.linkedin} onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">GitHub URL</label>
                                                <input type="url" className="input-field bg-white" value={formData.socialLinks.github} onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, github: e.target.value } })} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Portfolio URL</label>
                                                <input type="url" className="input-field bg-white" value={formData.socialLinks.portfolio} onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, portfolio: e.target.value } })} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Alumni Details */}
                                    {profile.role === 'alumni' && (
                                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-violet-600" /> Professional Details</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Company</label>
                                                    <input type="text" className="input-field bg-white" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Role</label>
                                                    <input type="text" className="input-field bg-white" value={formData.currentRole} onChange={e => setFormData({ ...formData, currentRole: e.target.value })} />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Industry</label>
                                                    <input type="text" className="input-field bg-white" value={formData.industry} onChange={e => setFormData({ ...formData, industry: e.target.value })} />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Years of Experience</label>
                                                    <input type="number" className="input-field bg-white" value={formData.yearsOfExperience} onChange={e => setFormData({ ...formData, yearsOfExperience: e.target.value })} />
                                                </div>
                                                <div className="md:col-span-2 flex items-center gap-3 mt-2 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                                    <input type="checkbox" id="mentorship" checked={formData.mentorshipAvailability} onChange={e => setFormData({ ...formData, mentorshipAvailability: e.target.checked })} className="w-5 h-5 text-violet-600 rounded border-gray-300" />
                                                    <label htmlFor="mentorship" className="text-sm font-bold text-gray-700">Available for Mentorship</label>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Projects Editing */}
                                    <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2"><Briefcase className="w-5 h-5 text-violet-600" /> Projects</h3>
                                            <button type="button" onClick={handleAddProject} className="text-sm font-semibold text-violet-600 hover:text-violet-700 bg-violet-50 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-colors">
                                                + Add Project
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            {formData.projects && formData.projects.map((proj, idx) => (
                                                <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 relative">
                                                    <button type="button" onClick={() => handleRemoveProject(idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-bold text-sm">Remove</button>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                                        <div className="md:col-span-2">
                                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Project Title</label>
                                                            <input type="text" className="input-field bg-gray-50" value={proj.title} onChange={e => handleProjectChange(idx, 'title', e.target.value)} required />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                                            <textarea className="input-field bg-gray-50" rows="2" value={proj.description} onChange={e => handleProjectChange(idx, 'description', e.target.value)}></textarea>
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tech Stack (comma separated)</label>
                                                            <input type="text" className="input-field bg-gray-50" value={Array.isArray(proj.tech) ? proj.tech.join(', ') : proj.tech} onChange={e => handleProjectChange(idx, 'tech', e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!formData.projects || formData.projects.length === 0) && (
                                                <p className="text-sm text-gray-400 text-center py-6 italic">No projects added yet. Click "+ Add Project" to get started.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Privacy Settings */}
                                    <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Shield className="w-5 h-5 text-violet-600" />
                                            Privacy Settings
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative inline-block w-12 mr-2 align-middle select-none">
                                                    <input type="checkbox" id="hideEmail" checked={formData.privacy.hideEmail} onChange={e => setFormData({ ...formData, privacy: { ...formData.privacy, hideEmail: e.target.checked } })} className="checked:bg-violet-600 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                                    <label htmlFor="hideEmail" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                                                </div>
                                                <label htmlFor="hideEmail" className="text-sm font-semibold text-gray-700">Hide Email from public</label>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="relative inline-block w-12 mr-2 align-middle select-none">
                                                    <input type="checkbox" id="hidePhone" checked={formData.privacy.hidePhone} onChange={e => setFormData({ ...formData, privacy: { ...formData.privacy, hidePhone: e.target.checked } })} className="checked:bg-violet-600 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                                    <label htmlFor="hidePhone" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                                                </div>
                                                <label htmlFor="hidePhone" className="text-sm font-semibold text-gray-700">Hide Phone Number</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200">
                                            Cancel
                                        </button>
                                        <button type="submit" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-8 py-2.5 rounded-xl font-semibold shadow-md shadow-violet-600/20 hover:shadow-lg transition-all">
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};

export default AlumniProfile;
