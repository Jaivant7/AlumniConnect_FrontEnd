import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Trash2, Send } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUrl';

const ForumPostCard = ({
    post,
    currentUser,
    activeCommentPostId,
    setActiveCommentPostId,
    onLikePost,
    onDeletePost,
    onAddComment,
    onDeleteComment,
    getTimeAgo
}) => {
    const [commentInput, setCommentInput] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    const isLiked = post.likes?.some(id => (id._id || id).toString() === currentUser._id.toString());
    const isOwner = (post.user?._id || post.user).toString() === currentUser._id.toString();
    const isCommentsOpen = activeCommentPostId === post._id;

    const getRoleBadgeStyle = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'alumni': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'student':
            default: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        }
    };

    const handleCommentSubmit = async () => {
        if (!commentInput.trim()) return;
        setSubmittingComment(true);
        await onAddComment(post._id, commentInput);
        setCommentInput('');
        setSubmittingComment(false);
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-sm hover:border-blue-200 transition-all duration-200">
            {/* Author Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Link to={`/profile/${post.user?._id}`}>
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm hover:opacity-90 transition-opacity">
                            {post.user?.name ? post.user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <Link to={`/profile/${post.user?._id}`} className="font-bold text-gray-900 hover:text-blue-600 transition-colors text-base">
                                {post.user?.name || 'Anonymous User'}
                            </Link>
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border capitalize ${getRoleBadgeStyle(post.user?.role)}`}>
                                {post.user?.role || 'Member'}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                            <span>
                                {post.user?.role === 'alumni' && (post.user?.currentRole || post.user?.company)
                                    ? `${post.user.currentRole || ''} ${post.user.company ? '@ ' + post.user.company : ''}`
                                    : post.user?.role === 'student' && post.user?.department
                                        ? `${post.user.department} Student`
                                        : 'Community Member'}
                            </span>
                            <span>•</span>
                            <span>{getTimeAgo(post.createdAt)}</span>
                        </p>
                    </div>
                </div>

                {(isOwner || currentUser.role === 'admin') && (
                    <button
                        onClick={() => onDeletePost(post._id)}
                        className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Post"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>

            {/* Post Body */}
            <p className="text-gray-800 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-4 font-normal">
                {post.content}
            </p>

            {/* Attached Image */}
            {post.image && (
                <div className="mb-4 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 max-h-96 flex items-center justify-center">
                    <img
                        src={getImageUrl(post.image)}
                        alt="Post attachment"
                        className="w-full h-auto object-cover max-h-96 rounded-xl hover:scale-[1.01] transition-transform duration-300"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-6 pt-3 border-t border-gray-100 text-sm">
                <button
                    onClick={() => onLikePost(post._id)}
                    className={`flex items-center gap-2 font-medium text-xs sm:text-sm px-3 py-1.5 rounded-lg transition-colors ${isLiked ? 'text-red-600 bg-red-50 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    <Heart size={18} className={isLiked ? 'fill-red-600 text-red-600' : 'text-gray-500'} />
                    <span>{post.likes ? post.likes.length : 0} Likes</span>
                </button>

                <button
                    onClick={() => setActiveCommentPostId(isCommentsOpen ? null : post._id)}
                    className={`flex items-center gap-2 font-medium text-xs sm:text-sm px-3 py-1.5 rounded-lg transition-colors ${isCommentsOpen ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    <MessageSquare size={18} className={isCommentsOpen ? 'text-blue-600' : 'text-gray-500'} />
                    <span>{post.comments ? post.comments.length : 0} Comments</span>
                </button>
            </div>

            {/* Expandable Comments Drawer */}
            {isCommentsOpen && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-4 animate-fade-in bg-gray-50/50 p-4 rounded-xl">
                    {post.comments && post.comments.length > 0 ? (
                        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                            {post.comments.map((cmt) => {
                                const isCmtAuthor = (cmt.user?._id || cmt.user).toString() === currentUser._id.toString();
                                return (
                                    <div key={cmt._id} className="flex items-start justify-between gap-3 bg-white p-3 rounded-xl border border-gray-200/70 shadow-2xs">
                                        <div className="flex items-start gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                                                {cmt.user?.name ? cmt.user.name.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-xs text-gray-900">
                                                        {cmt.user?.name || 'User'}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400">
                                                        {getTimeAgo(cmt.createdAt)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-700 mt-1 leading-normal">
                                                    {cmt.text}
                                                </p>
                                            </div>
                                        </div>

                                        {(isCmtAuthor || isOwner || currentUser.role === 'admin') && (
                                            <button
                                                onClick={() => onDeleteComment(post._id, cmt._id)}
                                                className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                                                title="Delete comment"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500 text-center py-2">No comments yet. Start the conversation!</p>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="text"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleCommentSubmit(); }}
                            placeholder="Write a comment..."
                            className="flex-1 bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleCommentSubmit}
                            disabled={submittingComment || !commentInput.trim()}
                            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
                        >
                            <Send size={12} /> Reply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForumPostCard;
