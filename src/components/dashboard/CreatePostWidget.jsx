import React, { useState } from 'react';
import { Send, Upload, Image, X } from 'lucide-react';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/imageUrl';

const CreatePostWidget = ({ user, onPostCreated }) => {
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostImage, setNewPostImage] = useState('');
    const [uploadingPostImage, setUploadingPostImage] = useState(false);
    const [showImageInput, setShowImageInput] = useState(false);
    const [isPosting, setIsPosting] = useState(false);

    const handlePostImageUpload = async (e) => {
        const file = e.target.files[0];
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

        setUploadingPostImage(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                },
            };
            const { data } = await api.post('/api/upload', uploadData, config);
            setNewPostImage(data.imageUrl);
        } catch (error) {
            console.error('Error uploading post image', error);
            alert(error.response?.data?.message || 'Failed to upload image. Please try again.');
        } finally {
            setUploadingPostImage(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;

        setIsPosting(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await api.post('/api/posts', {
                content: newPostContent,
                image: newPostImage
            }, config);

            onPostCreated(res.data);
            setNewPostContent('');
            setNewPostImage('');
            setShowImageInput(false);
        } catch (error) {
            console.error("Error creating post", error);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm flex-shrink-0">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex-1">
                    <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder={`Share something with your alumni network, ${user.name ? user.name.split(' ')[0] : 'Member'}...`}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none min-h-[90px]"
                    />

                    {newPostImage && (
                        <div className="mt-3 relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 max-h-48 flex items-center justify-center">
                            <img src={getImageUrl(newPostImage)} alt="Upload preview" className="max-h-48 object-contain" />
                            <button
                                type="button"
                                onClick={() => setNewPostImage('')}
                                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                                title="Remove image"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}

                    {showImageInput && !newPostImage && (
                        <div className="mt-3 relative">
                            <input
                                type="url"
                                value={newPostImage}
                                onChange={(e) => setNewPostImage(e.target.value)}
                                placeholder="Paste image URL (e.g. https://example.com/photo.jpg)"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                            />
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        id="dashboard-post-file-input"
                        className="hidden"
                        onChange={handlePostImageUpload}
                        disabled={uploadingPostImage}
                    />

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <label
                                htmlFor="dashboard-post-file-input"
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${uploadingPostImage ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                            >
                                <Upload size={14} /> {uploadingPostImage ? 'Uploading...' : 'Upload Image'}
                            </label>

                            <button
                                type="button"
                                onClick={() => setShowImageInput(!showImageInput)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${showImageInput ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                <Image size={14} /> Image URL
                            </button>
                        </div>

                        <button
                            onClick={handleCreatePost}
                            disabled={isPosting || uploadingPostImage || !newPostContent.trim()}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-xl shadow-sm transition-all duration-200 flex items-center gap-2"
                        >
                            {isPosting ? 'Posting...' : <><Send size={14} /> Post to Forum</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePostWidget;
