import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import Button from '../components/Button';

export default function UpdateMedia() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const fileInputRef = useRef(null);
    const [filename, setFilename] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Fetch media details
    const { data: media, isPending, error } = useQuery({
        queryKey: ['media', id],
        queryFn: () => api.get(`/media/${id}/details`).then((res) => res.data.data),
        retry: false,
    });

    useEffect(() => {
        if (media) {
            setFilename(media.filename);
        }
    }, [media]);

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Create preview if it's an image
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewUrl(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setPreviewUrl(null);
            }
        }
    };

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            if (filename !== media.filename) {
                formData.append('filename', filename);
            }
            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            return api.put(`/media/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['media'] });
            queryClient.invalidateQueries({ queryKey: ['media', id] });
            // alert('Media updated successfully'); // Better to just navigate or show toast, but alert is consistent with MediaManager
            navigate(-1);
        },
        onError: (err) => {
            alert('Failed to update media: ' + (err.response?.data?.error || err.message));
        }
    });

    if (isPending) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading media details...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 font-medium">Error loading media</p>
                <p className="text-red-500 text-sm mt-2">{error.message}</p>
                <Button className="mt-4" onClick={() => navigate(-1)}>Back to Media</Button>
            </div>
        </div>
    );

    const currentFileUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '') + media.url;
    const isImage = media.mime_type?.startsWith('image/');

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Update Media</h1>
                <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
                    &larr; Back to List
                </Button>
            </div>

            <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-medium text-gray-900">Current File Details</h2>
                </div>

                {/* Current File Preview */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                            {isImage ? (
                                <img src={currentFileUrl} alt={media.filename} className="h-32 w-32 object-cover rounded-lg border border-gray-200 shadow-sm" />
                            ) : (
                                <div className="h-32 w-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-4xl shadow-sm">
                                    {media.mime_type?.includes('pdf') ? '📕' : media.mime_type?.includes('video') ? '🎥' : '📄'}
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">Filename</dt>
                                    <dd className="mt-1 text-sm text-gray-900 font-semibold">{media.filename}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Size</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{(media.size / 1024).toFixed(2)} KB</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{media.mime_type}</dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <a href={currentFileUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-flex items-center">
                                        View/Download Original File
                                    </a>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filename / Description
                        </label>
                        <p className="text-xs text-gray-500 mb-2">Update the display name of the file.</p>
                        <input
                            type="text"
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            placeholder="Enter filename"
                            className="
                                        block w-full rounded-md border
                                        bg-white text-gray-900
                                        border-gray-300
                                        placeholder-gray-400
                                        shadow-sm p-2.5 sm:text-sm
                                        focus:border-indigo-500 focus:ring-indigo-500
                                        transition-colors

                                        dark:bg-gray-900
                                        dark:text-gray-100
                                        dark:border-gray-700
                                        dark:placeholder-gray-500
                                    "
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Replace File (Optional)
                        </label>
                        <p className="text-xs text-gray-500 mb-2">Upload a new file to replace the existing content.</p>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 hover:bg-slate-50 transition-all">
                            <div className="space-y-1 text-center">
                                {previewUrl ? (
                                    <div className="mb-4">
                                        <img src={previewUrl} alt="Preview" className="mx-auto h-32 object-contain" />
                                        <p className="text-xs text-gray-500 mt-1">New file preview</p>
                                    </div>
                                ) : (
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                                <div className="flex text-sm text-gray-600 justify-center">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" ref={fileInputRef} onChange={handleFileSelect} />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    {selectedFile ? `Selected: ${selectedFile.name}` : "Any file type up to 10MB"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                    <Button variant="secondary" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => updateMutation.mutate()}
                        disabled={updateMutation.isPending || (!selectedFile && filename === media.filename)}
                    >
                        {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
