import { useState, useContext, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import {
    Sparkles,
    MessageCircle,
    UserCheck,
    MessageSquare,
    Briefcase,
    Building,
    ChevronRight,
    ExternalLink
} from 'lucide-react';
import AuthContext from '../context/AuthContext';

import CreatePostWidget from '../components/dashboard/CreatePostWidget';
import ForumPostCard from '../components/dashboard/ForumPostCard';
import AlumniSpotlightWidget from '../components/dashboard/AlumniSpotlightWidget';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    // Forum State
    const [posts, setPosts] = useState([]);
    const [activeCommentPostId, setActiveCommentPostId] = useState(null);

    // Sidebar Data State
    const [featuredAlumni, setFeaturedAlumni] = useState([]);
    const [recentJobs, setRecentJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            try {
                // 1. Fetch Forum Posts
                const postsRes = await api.get('/api/posts', config);
                setPosts(postsRes.data);

                // 2. Fetch Alumni for Spotlight
                const usersRes = await api.get('/api/users', config);
                const alumni = usersRes.data.filter(u => u.role === 'alumni' && u._id !== user._id);
                setFeaturedAlumni(alumni.slice(0, 4));

                // 3. Fetch Recent Jobs
                const jobsRes = await api.get('/api/jobs', config);
                setRecentJobs(jobsRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3));

            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user.token, user._id]);

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 10) return "Just now";
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return Math.floor(seconds) + "s ago";
    };

    const handlePostCreated = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    const handleLikePost = async (postId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await api.put(`/api/posts/${postId}/like`, {}, config);
            setPosts(posts.map(p => p._id === postId ? res.data : p));
        } catch (error) {
            console.error("Error liking post", error);
        }
    };

    const handleAddComment = async (postId, text) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await api.post(`/api/posts/${postId}/comments`, { text }, config);
            setPosts(posts.map(p => p._id === postId ? res.data : p));
        } catch (error) {
            console.error("Error adding comment", error);
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await api.delete(`/api/posts/${postId}/comments/${commentId}`, config);
            setPosts(posts.map(p => p._id === postId ? res.data : p));
        } catch (error) {
            console.error("Error deleting comment", error);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await api.delete(`/api/posts/${postId}`, config);
            setPosts(posts.filter(p => p._id !== postId));
        } catch (error) {
            console.error("Error deleting post", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/60 body-font">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                
                {/* Welcome Banner */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase mb-3 text-blue-100 border border-white/20">
                            <Sparkles size={14} className="text-yellow-300" /> Academic Community Hub
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold heading-font tracking-tight">
                            Welcome back, {user.name}! 👋
                        </h2>
                        <p className="text-blue-100 text-sm sm:text-base mt-1 max-w-xl">
                            Connect with fellow alumni, ask advice, share insights, and discover opportunities in your college network.
                        </p>
                    </div>
                    <div className="relative z-10 flex items-center gap-3">
                        <Link
                            to={`/profile/${user._id}`}
                            className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold text-sm rounded-xl backdrop-blur-md transition-all duration-200 border border-white/30 shadow-sm flex items-center gap-2"
                        >
                            <UserCheck size={16} /> My Profile
                        </Link>
                    </div>
                </div>

                {/* Main Grid: Forum (Left) + Sidebar (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* MAIN FORUM FEED */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Create Post Widget */}
                        <CreatePostWidget user={user} onPostCreated={handlePostCreated} />

                        {/* Feed Header */}
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-xl font-bold text-gray-900 heading-font flex items-center gap-2">
                                <MessageCircle className="text-blue-600" size={22} />
                                Public Forum Feed
                            </h3>
                            <span className="text-xs text-gray-500 font-medium bg-gray-200/60 px-2.5 py-1 rounded-full">
                                {posts.length} {posts.length === 1 ? 'Discussion' : 'Discussions'}
                            </span>
                        </div>

                        {/* Forum Posts List */}
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((n) => (
                                    <div key={n} className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse space-y-4">
                                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                        <div className="h-12 bg-gray-100 rounded-xl"></div>
                                    </div>
                                ))}
                            </div>
                        ) : posts.length > 0 ? (
                            <div className="space-y-5">
                                {posts.map((post) => (
                                    <ForumPostCard
                                        key={post._id}
                                        post={post}
                                        currentUser={user}
                                        activeCommentPostId={activeCommentPostId}
                                        setActiveCommentPostId={setActiveCommentPostId}
                                        onLikePost={handleLikePost}
                                        onDeletePost={handleDeletePost}
                                        onAddComment={handleAddComment}
                                        onDeleteComment={handleDeleteComment}
                                        getTimeAgo={getTimeAgo}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl p-10 border border-gray-200 text-center space-y-3">
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                                    <MessageSquare size={28} />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900">No forum posts yet</h4>
                                <p className="text-sm text-gray-500 max-w-md mx-auto">
                                    Be the first person in your academic network to share an announcement or open a discussion!
                                </p>
                            </div>
                        )}
                    </div>

                    {/* SIDEBAR WIDGETS */}
                    <div className="space-y-6">

                        {/* 1. Recent Activity Widget */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm">
                            <h4 className="text-base font-bold text-gray-900 mb-4 heading-font flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Sparkles size={18} className="text-amber-500" /> Recent Discussions
                                </span>
                                <span className="text-xs text-blue-600 font-semibold">Active</span>
                            </h4>

                            <div className="space-y-3">
                                {posts.slice(0, 4).length > 0 ? (
                                    posts.slice(0, 4).map((p) => (
                                        <div 
                                            key={p._id}
                                            onClick={() => setActiveCommentPostId(p._id)}
                                            className="p-3 bg-gray-50 hover:bg-blue-50/60 rounded-xl border border-gray-100 hover:border-blue-200 transition-all cursor-pointer group"
                                        >
                                            <p className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                "{p.content}"
                                            </p>
                                            <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2">
                                                <span>by {p.user?.name || 'Member'}</span>
                                                <span className="flex items-center gap-1 font-medium text-gray-500">
                                                    <MessageSquare size={12} /> {p.comments ? p.comments.length : 0}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-400 text-center py-4">No recent activity</p>
                                )}
                            </div>
                        </div>

                        {/* 2. Alumni Spotlight Widget */}
                        <AlumniSpotlightWidget featuredAlumni={featuredAlumni} />

                        {/* 3. Top Opportunities Quick Widget */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-base font-bold text-gray-900 heading-font flex items-center gap-2">
                                    <Briefcase className="text-indigo-600" size={18} /> Top Job Openings
                                </h4>
                                <Link to="/jobs" className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-0.5">
                                    All Jobs <ChevronRight size={14} />
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {recentJobs.length > 0 ? (
                                    recentJobs.map((job) => (
                                        <div key={job._id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-200 transition-all">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h5 className="font-semibold text-xs text-gray-900 line-clamp-1">{job.title}</h5>
                                                    <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                                                        <Building size={11} /> {job.company}
                                                    </p>
                                                </div>
                                                <a
                                                    href={job.applyLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-600 hover:text-indigo-800 p-1 font-semibold text-xs flex items-center gap-0.5"
                                                    title="Apply"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-400 text-center py-3">No active job openings</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
