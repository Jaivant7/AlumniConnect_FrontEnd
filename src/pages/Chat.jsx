import { useState, useEffect, useContext, useRef } from 'react';
import { 
    Search, Send, Check, X, Paperclip, FileText, File, 
    Image as ImageIcon, Download, ExternalLink, Loader2, Eye 
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import getImageUrl from '../utils/imageUrl';
import io from 'socket.io-client';

let socket;

const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getFileBadge = (fileName, fileType) => {
    const ext = (fileName || '').split('.').pop().toLowerCase();
    if (ext === 'pdf' || fileType?.includes('pdf')) {
        return { label: 'PDF', bg: 'bg-red-500 text-white' };
    }
    if (['doc', 'docx'].includes(ext) || fileType?.includes('word')) {
        return { label: 'DOC', bg: 'bg-blue-600 text-white' };
    }
    if (['xls', 'xlsx', 'csv'].includes(ext) || fileType?.includes('sheet') || fileType?.includes('csv')) {
        return { label: 'SHEET', bg: 'bg-emerald-600 text-white' };
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext) || fileType?.includes('zip')) {
        return { label: 'ZIP', bg: 'bg-amber-600 text-white' };
    }
    if (['txt', 'rtf'].includes(ext)) {
        return { label: 'TXT', bg: 'bg-gray-600 text-white' };
    }
    return { label: ext ? ext.toUpperCase().slice(0, 4) : 'FILE', bg: 'bg-indigo-600 text-white' };
};

const isImageFile = (fileName, fileType) => {
    if (fileType && fileType.startsWith('image/')) return true;
    return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(fileName || '');
};

const Chat = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // File Upload State
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreviewUrl, setFilePreviewUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [previewModalImage, setPreviewModalImage] = useState(null);

    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    const activeChats = chats.filter(c => c.status === 'accepted');
    const pendingRequests = chats.filter(c => c.status === 'pending' && c.requestedBy !== user._id);

    const filteredChats = activeChats.filter(chat => {
        if (!searchQuery.trim()) return true;
        const partnerName = getPartnerName(chat.participants);
        return partnerName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchChats = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await api.get('/api/chat', config);
            setChats(res.data);
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    };

    const fetchMessages = async (chatId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await api.get(`/api/chat/${chatId}/messages`, config);
            setMessages(res.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
        socket.emit('join', user._id);
        fetchChats();
        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        if (activeChat) {
            fetchMessages(activeChat._id);
            socket.emit('join_chat', activeChat._id);
            clearFileSelection();
        }
    }, [activeChat]);

    useEffect(() => {
        if (location.state?.targetUserId && activeChats.length > 0) {
            const targetChat = activeChats.find(c => 
                c.participants.some(p => p._id === location.state.targetUserId)
            );
            if (targetChat) {
                setActiveChat(targetChat);
                window.history.replaceState({}, document.title);
            }
        }
    }, [location.state, activeChats]);

    useEffect(() => {
        const handleReceiveMessage = (message) => {
            if (activeChat && activeChat._id === message.chatId) {
                const isSender = message.sender === user._id || message.sender?._id === user._id;
                if (!isSender) {
                    setMessages((prev) => [...prev, message]);
                }
            }
        };

        socket.on('receive_message', handleReceiveMessage);
        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [activeChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        processSelectedFile(file);
    };

    const processSelectedFile = (file) => {
        const maxSizeBytes = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSizeBytes) {
            alert('File is too large! Maximum allowed size is 10MB.');
            return;
        }

        const ext = file.name.split('.').pop()?.toLowerCase();
        const blockedExts = ['exe', 'bat', 'cmd', 'sh', 'php', 'vbs', 'scr', 'msi', 'com', 'pif', 'hta', 'cpl', 'jar'];
        if (blockedExts.includes(ext)) {
            alert('Executable and script file uploads are prohibited for security!');
            return;
        }

        setSelectedFile(file);
        if (file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setFilePreviewUrl(url);
        } else {
            setFilePreviewUrl('');
        }
    };

    const clearFileSelection = () => {
        if (filePreviewUrl) {
            URL.revokeObjectURL(filePreviewUrl);
        }
        setSelectedFile(null);
        setFilePreviewUrl('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragOver) setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            processSelectedFile(file);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() && !selectedFile) return;

        setIsUploading(true);
        let uploadedFileUrl = '';
        let uploadedFileName = '';
        let uploadedFileType = '';
        let uploadedFileSize = 0;

        const authHeaders = { Authorization: `Bearer ${user.token}` };

        try {
            // Step 1: Upload file if present
            if (selectedFile) {
                const uploadData = new FormData();
                uploadData.append('file', selectedFile);

                const uploadRes = await api.post('/api/upload/file', uploadData, {
                    headers: {
                        ...authHeaders,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                uploadedFileUrl = uploadRes.data.fileUrl || uploadRes.data.imageUrl;
                uploadedFileName = uploadRes.data.fileName || selectedFile.name;
                uploadedFileType = uploadRes.data.fileType || selectedFile.type;
                uploadedFileSize = uploadRes.data.fileSize || selectedFile.size;
            }

            // Step 2: Persist message in database
            const payload = {
                content: newMessage.trim(),
                fileUrl: uploadedFileUrl,
                fileName: uploadedFileName,
                fileType: uploadedFileType,
                fileSize: uploadedFileSize,
            };

            await api.post(`/api/chat/${activeChat._id}/message`, payload, { headers: authHeaders });

            // Step 3: Emit message to Socket.io room
            const messageData = {
                chatId: activeChat._id,
                sender: user._id,
                content: newMessage.trim(),
                fileUrl: uploadedFileUrl,
                fileName: uploadedFileName,
                fileType: uploadedFileType,
                fileSize: uploadedFileSize,
                timestamp: new Date(),
            };

            socket.emit('send_message', messageData);
            setMessages((prev) => [...prev, messageData]);

            // Step 4: Reset input state
            setNewMessage('');
            clearFileSelection();
        } catch (error) {
            console.error('Error sending message:', error);
            alert(error.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleAcceptReject = async (chatId, status) => {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await api.put(`/api/chat/${chatId}/respond`, { status }, config);
        fetchChats();
    };

    const getPartnerName = (participants) => {
        const partner = participants.find(p => p._id !== user._id);
        return partner ? partner.name : 'Unknown User';
    };

    const getPartnerInitial = (participants) => {
        const partner = participants.find(p => p._id !== user._id);
        return partner ? partner.name.charAt(0).toUpperCase() : '?';
    };

    return (
        <div className="min-h-screen bg-gray-50 body-font">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="section-header animate-fade-in">Messages</h2>
                        <p className="text-sm text-gray-500">Real-time one-to-one conversations & file sharing</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-13rem)] min-h-[580px]">
                    {/* Chat List */}
                    <div className="card overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search conversations..."
                                    className="input-field input-with-icon text-sm"
                                />
                            </div>
                        </div>

                        {/* Pending Requests */}
                        {pendingRequests.length > 0 && (
                            <div className="p-4 border-b border-gray-200 bg-amber-50/70">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2.5">
                                    Pending Requests ({pendingRequests.length})
                                </h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                    {pendingRequests.map(chat => (
                                        <div key={chat._id} className="bg-white rounded-xl p-3 border border-amber-200 shadow-xs">
                                            <div className="flex items-center gap-2.5 mb-2.5">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                                                    {getPartnerInitial(chat.participants)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 text-xs truncate">
                                                        {getPartnerName(chat.participants)}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500">Wants to connect with you</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAcceptReject(chat._id, 'accepted')}
                                                    className="btn-success flex-1 text-xs py-1.5 flex items-center justify-center gap-1 shadow-none"
                                                >
                                                    <Check size={14} /> Accept
                                                </button>
                                                <button
                                                    onClick={() => handleAcceptReject(chat._id, 'rejected')}
                                                    className="btn-danger flex-1 text-xs py-1.5 flex items-center justify-center gap-1 shadow-none"
                                                >
                                                    <X size={14} /> Decline
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Active Chats */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                            {filteredChats.map(chat => {
                                const isSelected = activeChat?._id === chat._id;
                                return (
                                    <div
                                        key={chat._id}
                                        onClick={() => setActiveChat(chat)}
                                        className={`p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 ${
                                            isSelected
                                                ? 'bg-blue-50/90 border border-blue-300 shadow-xs'
                                                : 'border border-transparent hover:border-gray-200 hover:bg-gray-50/80'
                                        }`}
                                    >
                                        <div className="relative">
                                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-xs">
                                                {getPartnerInitial(chat.participants)}
                                            </div>
                                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <h4 className="font-semibold text-gray-900 text-sm truncate">
                                                    {getPartnerName(chat.participants)}
                                                </h4>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">
                                                {chat.messages && chat.messages.length > 0 
                                                    ? (chat.messages[chat.messages.length - 1].fileUrl 
                                                        ? `📎 ${chat.messages[chat.messages.length - 1].fileName || 'Attachment'}` 
                                                        : chat.messages[chat.messages.length - 1].content)
                                                    : 'Active chat'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            {filteredChats.length === 0 && (
                                <div className="text-center py-12 px-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
                                        <Search size={20} />
                                    </div>
                                    <p className="text-gray-600 text-sm font-medium">No conversations found</p>
                                    <p className="text-gray-400 text-xs mt-1">Start a chat from the Alumni or Student Directory</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div 
                        className={`lg:col-span-2 card flex flex-col overflow-hidden relative ${isDragOver ? 'ring-2 ring-blue-500 bg-blue-50/20' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {activeChat ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 px-6 border-b border-gray-200 bg-white/80 backdrop-blur-xs flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-xs">
                                                {getPartnerInitial(activeChat.participants)}
                                            </div>
                                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-base">
                                                {getPartnerName(activeChat.participants)}
                                            </h4>
                                            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                Active Now
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-xs text-gray-400 flex items-center gap-1">
                                        <span>Drag & drop files to send</span>
                                    </div>
                                </div>

                                {/* Drag & Drop Overlay Indicator */}
                                {isDragOver && (
                                    <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-xs z-30 flex flex-col items-center justify-center border-2 border-dashed border-blue-500 rounded-2xl pointer-events-none">
                                        <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg mb-3 animate-bounce">
                                            <Paperclip size={32} />
                                        </div>
                                        <p className="text-base font-bold text-blue-900">Drop your file here</p>
                                        <p className="text-xs text-blue-700 mt-1">Upload images, PDFs, docs, spreadsheets (up to 10MB)</p>
                                    </div>
                                )}

                                {/* Messages Viewport */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                                    {messages.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                                                <Send size={24} />
                                            </div>
                                            <h4 className="font-bold text-gray-800 text-base">Start the conversation</h4>
                                            <p className="text-gray-500 text-xs max-w-sm mt-1">
                                                Say hello or share project materials, resumes, or documents using the attachment button.
                                            </p>
                                        </div>
                                    ) : (
                                        messages.map((msg, idx) => {
                                            const isMe = msg.sender === user._id || msg.sender?._id === user._id;
                                            const isImage = msg.fileUrl && isImageFile(msg.fileName, msg.fileType);
                                            const badgeInfo = msg.fileUrl ? getFileBadge(msg.fileName, msg.fileType) : null;
                                            const fullFileUrl = msg.fileUrl ? getImageUrl(msg.fileUrl) : '';

                                            return (
                                                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-md sm:max-w-lg rounded-2xl shadow-xs transition-all ${
                                                        isMe 
                                                            ? 'bg-blue-600 text-white rounded-br-xs' 
                                                            : 'bg-white text-gray-900 border border-gray-200/80 rounded-bl-xs'
                                                    } p-3.5`}>
                                                        {/* Attached File Preview */}
                                                        {msg.fileUrl && (
                                                            <div className="mb-2">
                                                                {isImage ? (
                                                                    /* Image Attachment */
                                                                    <div className="relative group overflow-hidden rounded-xl border border-black/10 bg-black/5">
                                                                        <img 
                                                                            src={fullFileUrl} 
                                                                            alt={msg.fileName || 'Uploaded image'} 
                                                                            className="max-h-64 w-full object-cover cursor-pointer transition-transform duration-200 group-hover:scale-102"
                                                                            onClick={() => setPreviewModalImage({ url: fullFileUrl, name: msg.fileName || 'Attachment' })}
                                                                        />
                                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => setPreviewModalImage({ url: fullFileUrl, name: msg.fileName || 'Attachment' })}
                                                                                className="p-2 bg-white/90 hover:bg-white text-gray-900 rounded-lg shadow-sm text-xs font-medium flex items-center gap-1 transition-transform transform hover:scale-105"
                                                                                title="View full size"
                                                                            >
                                                                                <Eye size={14} /> View
                                                                            </button>
                                                                            <a
                                                                                href={fullFileUrl}
                                                                                download={msg.fileName || 'download'}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm text-xs font-medium flex items-center gap-1 transition-transform transform hover:scale-105"
                                                                                title="Download image"
                                                                            >
                                                                                <Download size={14} /> Save
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    /* Document Attachment Card */
                                                                    <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                                                                        isMe 
                                                                            ? 'bg-blue-700/60 border-blue-400/40 text-white' 
                                                                            : 'bg-gray-50 border-gray-200 text-gray-900'
                                                                    }`}>
                                                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-[11px] shadow-xs flex-shrink-0 ${badgeInfo?.bg}`}>
                                                                                {badgeInfo?.label || 'FILE'}
                                                                            </div>
                                                                            <div className="min-w-0 flex-1">
                                                                                <p className="font-semibold text-xs truncate" title={msg.fileName}>
                                                                                    {msg.fileName || 'Attachment'}
                                                                                </p>
                                                                                <p className={`text-[10px] mt-0.5 ${isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                                                                                    {formatFileSize(msg.fileSize)}
                                                                                </p>
                                                                            </div>
                                                                        </div>

                                                                        <a
                                                                            href={fullFileUrl}
                                                                            download={msg.fileName || 'document'}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className={`p-2 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
                                                                                isMe 
                                                                                    ? 'bg-white/20 hover:bg-white/30 text-white' 
                                                                                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 shadow-xs'
                                                                            }`}
                                                                            title="Download file"
                                                                        >
                                                                            <Download size={16} />
                                                                        </a>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Text Content */}
                                                        {msg.content && (
                                                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                                                {msg.content}
                                                            </p>
                                                        )}

                                                        {/* Timestamp */}
                                                        <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                                                            isMe ? 'text-blue-100' : 'text-gray-400'
                                                        }`}>
                                                            <span>
                                                                {new Date(msg.timestamp).toLocaleTimeString([], { 
                                                                    hour: '2-digit', 
                                                                    minute: '2-digit' 
                                                                })}
                                                            </span>
                                                            {isMe && <Check size={12} className="opacity-80" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Attachment Preview Bar (Before Sending) */}
                                {selectedFile && (
                                    <div className="px-6 py-3 bg-blue-50/80 border-t border-blue-200 animate-slide-up">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                {filePreviewUrl ? (
                                                    <img 
                                                        src={filePreviewUrl} 
                                                        alt="Upload preview" 
                                                        className="w-12 h-12 rounded-lg object-cover border border-blue-300 shadow-xs flex-shrink-0" 
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                                                        <FileText size={22} />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-gray-900 truncate max-w-xs">
                                                            {selectedFile.name}
                                                        </span>
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-200 text-blue-800 font-semibold">
                                                            Ready to send
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-500 mt-0.5">
                                                        {formatFileSize(selectedFile.size)}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={clearFileSelection}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Remove attached file"
                                                disabled={isUploading}
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Message Input Form */}
                                <form onSubmit={handleSendMessage} className="p-4 px-6 border-t border-gray-200 bg-white">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.csv,.ppt,.pptx,.zip,.rar"
                                        className="hidden"
                                        disabled={isUploading}
                                    />

                                    <div className="flex items-center gap-2">
                                        {/* Attachment Button */}
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploading}
                                            className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 flex-shrink-0 relative group"
                                            title="Attach file (Images, Documents, PDFs, Sheets up to 10MB)"
                                        >
                                            <Paperclip size={20} />
                                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-[11px] font-medium py-1 px-2 rounded-md whitespace-nowrap shadow-md pointer-events-none z-20">
                                                Attach file (Max 10MB)
                                            </span>
                                        </button>

                                        {/* Text Input */}
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder={selectedFile ? "Add an optional caption..." : "Type your message..."}
                                            className="input-field flex-1 text-sm py-3"
                                            disabled={isUploading}
                                        />

                                        {/* Send Button */}
                                        <button
                                            type="submit"
                                            disabled={isUploading || (!newMessage.trim() && !selectedFile)}
                                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all shadow-sm flex items-center justify-center flex-shrink-0"
                                            title="Send message"
                                        >
                                            {isUploading ? (
                                                <Loader2 size={20} className="animate-spin" />
                                            ) : (
                                                <Send size={20} />
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500 p-8">
                                <div className="text-center max-w-sm">
                                    <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 text-3xl shadow-xs">
                                        💬
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2 heading-font">
                                        Select a Conversation
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        Choose a conversation from the left to start messaging, share documents, notes, or project files.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Image Preview Lightbox Modal */}
            {previewModalImage && (
                <div 
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setPreviewModalImage(null)}
                >
                    <div 
                        className="relative max-w-4xl max-h-[90vh] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 px-6 bg-gray-950 flex items-center justify-between border-b border-gray-800 text-white">
                            <span className="font-medium text-sm truncate max-w-md">
                                {previewModalImage.name}
                            </span>
                            <div className="flex items-center gap-2">
                                <a
                                    href={previewModalImage.url}
                                    download={previewModalImage.name}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 hover:bg-gray-800 rounded-lg text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
                                >
                                    <Download size={16} /> Download
                                </a>
                                <button
                                    onClick={() => setPreviewModalImage(null)}
                                    className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 flex items-center justify-center overflow-auto max-h-[calc(90vh-4rem)]">
                            <img 
                                src={previewModalImage.url} 
                                alt={previewModalImage.name} 
                                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
