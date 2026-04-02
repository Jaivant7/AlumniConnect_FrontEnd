import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import StudentProfile from './StudentProfile';
import AlumniProfile from './AlumniProfile';

const Profile = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const res = await api.get(`/api/users/${id}`, config);
                setRole(res.data.role);
            } catch (err) {
                console.error('Failed to fetch user role:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRole();
    }, [id, user.token]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 body-font">
            <div className="spinner mx-auto mb-4"></div>
        </div>
    );

    if (role === 'student') {
        return <StudentProfile />;
    } else if (role === 'alumni' || role === 'admin') {
        return <AlumniProfile />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 body-font">
            <div className="text-red-500 font-semibold text-xl">User Not Found or Invalid Role</div>
        </div>
    );
};

export default Profile;
