import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';

import ProfileHeader from '../components/profile/ProfileHeader';
import AlumniProfileForm from '../components/profile/AlumniProfileForm';
import ProfileActivityTab from '../components/profile/ProfileActivityTab';

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
            const res = await api.get(`/api/users/${id}`, config);
            setProfile(res.data);

            setFormData({
                name: res.data.name || '',
                phone: res.data.phone || '',
                location: res.data.location || '',
                bio: res.data.bio || '',
                skills: res.data.skills ? res.data.skills.join(', ') : '',
                company: res.data.company || '',
                currentRole: res.data.currentRole || '',
                industry: res.data.industry || '',
                yearsOfExperience: res.data.yearsOfExperience || '',
                graduationYear: res.data.graduationYear || '',
                degree: res.data.degree || '',
                mentorshipAvailability: res.data.mentorshipAvailability || false,
                projects: res.data.projects || [],
                profilePicture: res.data.profilePicture || '',
                coverPicture: res.data.coverPicture || '',
            });
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch profile.');
            setLoading(false);
        }
    };

    const isOwnProfile = user && user._id === id;

    const calculateStrength = (p) => {
        if (!p) return 0;
        let score = 0;
        let total = 7;
        if (p.name) score++;
        if (p.email) score++;
        if (p.bio) score++;
        if (p.company) score++;
        if (p.currentRole) score++;
        if (p.skills && p.skills.length > 0) score++;
        if (p.yearsOfExperience) score++;
        return Math.round((score / total) * 100) || 0;
    };

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
            const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` } };
            const { data } = await api.post('/api/upload', uploadData, config);

            const updatedData = { ...formData, [type]: data.imageUrl };
            if (isEditing) setFormData(updatedData);

            await api.put(`/api/users/${id}`, { [type]: data.imageUrl }, config);
            setProfile(prev => ({ ...prev, [type]: data.imageUrl }));
        } catch (error) {
            console.error('Error uploading image', error);
            alert('Failed to upload image.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const payload = {
                ...formData,
                skills: typeof formData.skills === 'string' ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : formData.skills,
            };

            const res = await api.put(`/api/users/${id}`, payload, config);
            setProfile(res.data);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleSendMessage = () => {
        navigate('/chat', { state: { targetUserId: id } });
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="spinner"></div></div>;
    if (error) return <div className="p-8 text-center text-red-600 font-bold">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50/70 body-font">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                
                <ProfileHeader
                    profile={profile}
                    isOwnProfile={isOwnProfile}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    uploadingImage={uploadingImage}
                    handleImageUpload={handleImageUpload}
                    strength={calculateStrength(profile)}
                    onSendMessage={handleSendMessage}
                />

                {isEditing ? (
                    <AlumniProfileForm
                        formData={formData}
                        setFormData={setFormData}
                        onSave={handleSaveProfile}
                        onCancel={() => setIsEditing(false)}
                        handleAddProject={handleAddProject}
                        handleProjectChange={handleProjectChange}
                        handleRemoveProject={handleRemoveProject}
                    />
                ) : (
                    <ProfileActivityTab profile={profile} />
                )}

            </div>
        </div>
    );
};

export default AlumniProfile;
