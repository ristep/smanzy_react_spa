import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import Panel from '../components/Panel';
import { Edit, Download, Trash2, File, FileText, FileArchive, Image, Video, FileMusic } from 'lucide-react';
// import ReactJSON from 'react-json-view';

export default function MediaManager() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    const page = parseInt(searchParams.get('page')) || 1;
    const limit = 5; // Number of items per page

    // Fetch media list
    const { isPending, error, data } = useQuery({
        queryKey: ['media', page],
        queryFn: () => api.get(`/media?limit=${limit}&offset=${(page - 1) * limit}`).then((res) => {
            // Handle new response structure { data: { files: [], total: 0 } }
            // or { data: [] } if not yet deployed backend
            // Our backend now returns data: { files: [], total: X }
            return res.data;
        }),
        keepPreviousData: true, // Keep data while fetching new page
        retry: false,
    });

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage });
        // Optional: Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Fetch current user for permissions
    const { data: userData } = useQuery({
        queryKey: ['profile'],
        queryFn: () => api.get('/profile').then((res) => res.data),
        retry: false,
    });
    const currentUser = userData?.data;

    const canView = (media) => {
        // if (!currentUser) return true;
        return true;
    };

    const canManage = (media) => {
        if (!currentUser) return false;
        const isAdmin = currentUser.roles?.some(r => r.name === 'admin');
        const isOwner = media.user_id === currentUser.id;
        return isAdmin || isOwner;
    };

    // Upload mutation
    const uploadMutation = useMutation({
        mutationFn: async (file) => {
            const formData = new FormData();
            formData.append('file', file);

            return api.post('/media', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['media'] });
            setSelectedFile(null);
            setUploadProgress(0);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        },
        onError: (err) => {
            alert('Failed to upload file: ' + (err.response?.data?.error || err.message));
            setUploadProgress(0);
        }
    });


    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => {
            return api.delete(`/media/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['media'] });
        },
        onError: (err) => {
            alert('Failed to delete media: ' + (err.response?.data?.error || err.message));
        }
    });

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            uploadMutation.mutate(selectedFile);
        }
    };

    const handleEdit = (media) => {
        navigate(`/media/edit/${media.id}`);
    };

    const handleDelete = (media) => {
        if (window.confirm(`Are you sure you want to delete "${media.filename}"?`)) {
            deleteMutation.mutate(media.id);
        }
    };

    const handleDownload = (media) => {
        window.open(import.meta.env.VITE_API_BASE_URL.replace('/api', '') + media.url, '_blank');
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getFileIcon = (mimeType) => {
        if (!mimeType) return <File />;
        if (mimeType.startsWith('image/')) return <Image />;
        if (mimeType.startsWith('video/')) return <Video />;
        if (mimeType.startsWith('audio/')) return <FileMusic />;
        if (mimeType.includes('pdf')) return <FileText />;
        if (mimeType.includes('zip') || mimeType.includes('rar')) return <FileArchive />;
        return <File />;
    };

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading media...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
                    <p className="text-red-600 dark:text-red-400 font-medium">Error loading media</p>
                    <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error.message}</p>
                </div>
            </div>
        );
    }

    // Handle new response structure
    const responseData = data?.data;
    const mediaList = responseData?.files || []; // New structure: { files: [], total: X }
    const totalItems = responseData?.total || 0;
    const totalPages = Math.ceil(totalItems / limit);

    // Generate page numbers
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always show first, last, and pages around current
            let startPage = Math.max(1, page - 2);
            let endPage = Math.min(totalPages, page + 2);

            if (page <= 3) {
                endPage = Math.min(totalPages, 5);
            }
            if (page >= totalPages - 2) {
                startPage = Math.max(1, totalPages - 4);
            }

            if (startPage > 1) {
                pageNumbers.push(1);
                if (startPage > 2) pageNumbers.push('...');
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }
        return pageNumbers;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-text-primary mb-2">Media Manager</h1>
                <p className="text-text-secondary">Upload, manage, and organize your media files</p>
            </div>
            {/* Upload Section */}
            <Panel className="mb-4">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Upload New File</h2>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                    <div className="flex-1 w-full">
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileSelect}
                            className="block w-full text-sm text-text-primary border border-input-border rounded-lg cursor-pointer bg-input focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20"
                        />
                    </div>
                    <Button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploadMutation.isPending}
                        className="whitespace-nowrap"
                    >
                        {uploadMutation.isPending ? 'Uploading...' : 'Upload File'}
                    </Button>
                </div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-4">
                        <div className="flex justify-between text-sm text-text-secondary mb-1">
                            <span>Upload Progress</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-background-tertiary rounded-full h-2.5">
                            <div
                                className="bg-accent h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </Panel>

            {/* Media List */}
            <Panel>
                <div className="px-6 py-4 bg-background-secondary border-b border-border flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-text-primary">Your Media Files</h2>
                        <p className="text-sm text-text-secondary mt-1">
                            Showing {mediaList.length} of {totalItems} files
                        </p>
                    </div>
                    {/* Pagination - Top */}
                    {totalPages > 1 && (
                        <div className="text-sm text-text-secondary">
                            Page {page} of {totalPages}
                        </div>
                    )}
                </div>

                {mediaList.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📁</div>
                        <p className="text-text-secondary text-lg">No media files found</p>
                        <p className="text-text-muted text-sm mt-2">Upload a file or check other pages</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-background-secondary">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                                        File Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                                        Size
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                                        Uploaded
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-card divide-y divide-border">
                                {mediaList.map((media) => (
                                    <tr key={media.id} className="hover:bg-background-secondary transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div>
                                                    <div className="text-sm font-medium text-text-primary">
                                                        {media.filename}
                                                    </div>
                                                    <div className="text-xs text-text-muted">
                                                        ID: {media.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-accent/10 text-accent">
                                                {getFileIcon(media.mime_type)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                            {formatFileSize(media.size)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                            {formatDate(media.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <IconButton
                                                    onClick={() => handleDownload(media)}
                                                    disabled={!canView(media)}
                                                    title="Download"
                                                >
                                                    <Download />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleEdit(media)}
                                                    disabled={!canManage(media)}
                                                    title="Edit"
                                                >
                                                    <Edit />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleDelete(media)}
                                                    disabled={!canManage(media)}
                                                    title="Delete"
                                                >
                                                    <Trash2 />
                                                </IconButton>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {mediaList.length > 0 && totalPages > 1 && (
                    <div className="px-6 py-4 bg-background-secondary border-t border-border flex items-center justify-between">
                        <div className="hidden sm:block text-sm text-text-secondary">
                            Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                        </div>
                        <div className="flex gap-2 items-center justify-center w-full sm:w-auto">
                            <Button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                variant="secondary"
                                size="sm"
                            >
                                Previous
                            </Button>

                            <div className="flex gap-1">
                                {getPageNumbers().map((pageNum, index) => (
                                    pageNum === '...' ? (
                                        <span key={`dots-${index}`} className="px-3 py-1 text-text-muted">...</span>
                                    ) : (
                                        <Button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            variant="secondary"
                                            size="sm"
                                        >
                                            {pageNum}
                                        </Button>
                                    )
                                ))}
                            </div>

                            <Button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page >= totalPages}
                                variant="secondary"
                                size="sm"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </Panel>
        </div>
    );
}
