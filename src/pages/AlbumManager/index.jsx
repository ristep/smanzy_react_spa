import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit, X, Save, File } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/Button';
import Panel from '@/components/Panel';
import Modal from '@/components/Modal';
import styles from './index.module.scss';
import clsx from 'clsx';

export default function AlbumManager() {
    const queryClient = useQueryClient();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [managingAlbumId, setManagingAlbumId] = useState(null);
    const [editFormData, setEditFormData] = useState({ title: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('media'); // 'details' or 'media'
    const [showAddMediaForm, setShowAddMediaForm] = useState(false);
    const [mediaSearch, setMediaSearch] = useState('');

    // Fetch user albums
    const { isPending: albumsPending, error: albumsError, data: albumsData } = useQuery({
        queryKey: ['albums'],
        queryFn: () => api.get('/albums').then((res) => res.data),
        retry: false,
    });

    const albums = albumsData || [];

    // Fetch all media for adding to album
    const { data: mediaData } = useQuery({
        queryKey: ['media', 'all'],
        queryFn: () => api.get('/media?limit=1000').then((res) => res.data),
        retry: false,
    });

    const allMedia = mediaData?.data?.files || [];
    const filteredMedia = allMedia.filter(m =>
        m.filename.toLowerCase().includes(mediaSearch.toLowerCase())
    );

    // Derive the album being managed from the latest data
    const managingAlbum = albums.find(a => a.id === managingAlbumId);

    // Create album mutation
    const createAlbumMutation = useMutation({
        mutationFn: (newAlbum) => api.post('/albums', newAlbum),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['albums'] });
            setFormData({ title: '', description: '' });
            setShowCreateForm(false);
        },
        onError: (err) => {
            alert('Failed to create album: ' + (err.response?.data?.error || err.message));
        },
    });

    // Update album mutation
    const updateAlbumMutation = useMutation({
        mutationFn: ({ albumId, data }) => api.put(`/albums/${albumId}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['albums'] });
            setIsEditing(false);
        },
        onError: (err) => {
            alert('Failed to update album: ' + (err.response?.data?.error || err.message));
        },
    });

    // Delete album mutation
    const deleteAlbumMutation = useMutation({
        mutationFn: (albumId) => api.delete(`/albums/${albumId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['albums'] });
            setManagingAlbumId(null);
        },
        onError: (err) => {
            alert('Failed to delete album: ' + (err.response?.data?.error || err.message));
        },
    });

    // Add media to album mutation
    const addMediaMutation = useMutation({
        mutationFn: ({ albumId, mediaId }) => api.post(`/albums/${albumId}/media`, { media_id: mediaId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['albums'] });
            setShowAddMediaForm(false);
            setMediaSearch('');
        },
        onError: (err) => {
            alert('Failed to add media: ' + (err.response?.data?.error || err.message));
        },
    });

    // Remove media from album mutation
    const removeMediaMutation = useMutation({
        mutationFn: ({ albumId, mediaId }) => api.delete(`/albums/${albumId}/media`, {
            data: { media_id: mediaId }
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['albums'] });
        },
        onError: (err) => {
            alert('Failed to remove media: ' + (err.response?.data?.error || err.message));
        },
    });

    const handleCreateAlbum = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            alert('Album title is required');
            return;
        }
        createAlbumMutation.mutate(formData);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOpenManageModal = (album) => {
        setManagingAlbumId(album.id);
        setEditFormData({ title: album.title, description: album.description || '' });
        setIsEditing(false);
        setActiveTab('media');
        setShowAddMediaForm(false);
        setMediaSearch('');
    };

    const getThumbnailUrl = (path) => {
        if (!path) return '';
        const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
        return baseUrl + path;
    };

    const isMediaInAlbum = (mediaId) => {
        return managingAlbum?.media_files?.some(m => m.id === mediaId);
    };

    const handleCloseManageModal = () => {
        setManagingAlbumId(null);
        setIsEditing(false);
        setShowAddMediaForm(false);
        setMediaSearch('');
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveAlbum = (e) => {
        e.preventDefault();
        if (!editFormData.title.trim()) {
            alert('Album title is required');
            return;
        }
        updateAlbumMutation.mutate({
            albumId: managingAlbum.id,
            data: editFormData
        });
    };

    const handleCancelEdit = () => {
        setEditFormData({ title: managingAlbum.title, description: managingAlbum.description || '' });
        setIsEditing(false);
    };

    if (albumsPending) return <div className={styles.container}><p>Loading albums...</p></div>;
    if (albumsError) return <div className={styles.container}><p>Error loading albums</p></div>;

    return (
        <div className={styles.container}>
            <Panel title="Album Manager">
                <div className={styles.header}>
                    <h1>My Albums</h1>
                    <Button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className={styles.createBtn}
                    >
                        <Plus size={20} />
                        {showCreateForm ? 'Cancel' : 'New Album'}
                    </Button>
                </div>

                {showCreateForm && (
                    <form onSubmit={handleCreateAlbum} className={styles.createForm}>
                        <div className={styles.formGroup}>
                            <label>Album Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleFormChange}
                                placeholder="Enter album title"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleFormChange}
                                placeholder="Enter album description (optional)"
                                rows="3"
                            />
                        </div>
                        <div className={styles.formActions}>
                            <Button type="submit" disabled={createAlbumMutation.isPending}>
                                {createAlbumMutation.isPending ? 'Creating...' : 'Create Album'}
                            </Button>
                        </div>
                    </form>
                )}

                {albums.length === 0 ? (
                    <p className={styles.emptyMessage}>No albums yet. Create one to get started!</p>
                ) : (
                    <div className={styles.albumsList}>
                        {albums.map(album => (
                            <div key={album.id} className={styles.albumCard}>
                                <div className={styles.albumInfo}>
                                    <h3>{album.title}</h3>
                                    {album.description && <p className={styles.description}>{album.description}</p>}
                                    <p className={styles.mediaCount}>
                                        {album.media_files?.length || 0} media files
                                    </p>
                                </div>

                                <div className={styles.albumActions}>
                                    <Button
                                        onClick={() => handleOpenManageModal(album)}
                                        variant="secondary"
                                    >
                                        <Edit size={18} />
                                        Manage
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            if (confirm('Are you sure you want to delete this album?')) {
                                                deleteAlbumMutation.mutate(album.id);
                                            }
                                        }}
                                        disabled={deleteAlbumMutation.isPending}
                                        variant="danger"
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>


                            </div>
                        ))}
                    </div>
                )}
            </Panel>

            {/* Manage Album Modal */}
            <Modal
                isOpen={!!managingAlbumId}
                onClose={handleCloseManageModal}
                title={managingAlbum?.title || 'Manage Album'}
                size="large"
            >
                {managingAlbum && (
                    <div className={styles.modalContent}>
                        <div className={styles.tabHeader}>
                            <Button
                                variant="secondary"
                                onClick={() => setActiveTab('media')}
                            >
                                Media Content
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => setActiveTab('details')}
                            >
                                Settings
                            </Button>
                        </div>

                        {activeTab === 'details' ? (
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <h3>Album Settings</h3>
                                    {!isEditing && (
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            variant="primary"
                                        >
                                            <Edit size={16} />
                                            Edit Details
                                        </Button>
                                    )}
                                </div>

                                {isEditing ? (
                                    <form onSubmit={handleSaveAlbum} className={styles.editForm}>
                                        <div className={styles.formGroup}>
                                            <label>Album Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={editFormData.title}
                                                onChange={handleEditFormChange}
                                                placeholder="Enter album title"
                                                required
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Description</label>
                                            <textarea
                                                name="description"
                                                value={editFormData.description}
                                                onChange={handleEditFormChange}
                                                placeholder="Enter album description (optional)"
                                                rows="3"
                                            />
                                        </div>
                                        <div className={styles.formActions}>
                                            <Button type="submit" disabled={updateAlbumMutation.isPending}>
                                                <Save size={18} />
                                                {updateAlbumMutation.isPending ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={handleCancelEdit}
                                                variant="secondary"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className={styles.albumDetailsView}>
                                        <p><strong>Title:</strong> {managingAlbum.title}</p>
                                        {managingAlbum.description && (
                                            <p><strong>Description:</strong> {managingAlbum.description}</p>
                                        )}
                                        <p><strong>Total Media:</strong> {managingAlbum.media_files?.length || 0} items</p>
                                        <p><strong>Created:</strong> {new Date(managingAlbum.created_at).toLocaleDateString()}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <h3>Media in Album</h3>
                                    <Button
                                        onClick={() => setShowAddMediaForm(!showAddMediaForm)}
                                        variant={showAddMediaForm ? 'secondary' : 'primary'}
                                    >
                                        {showAddMediaForm ? 'Close library' : <><Plus size={16} /> Add from Library</>}
                                    </Button>
                                </div>

                                {showAddMediaForm && (
                                    <div className={styles.addMediaForm}>
                                        <div className={styles.searchWrapper}>
                                            <input
                                                type="text"
                                                placeholder="Search your library..."
                                                value={mediaSearch}
                                                onChange={(e) => setMediaSearch(e.target.value)}
                                                className={styles.searchInput}
                                                autoFocus
                                            />
                                        </div>
                                        <div className={styles.mediaLibraryList}>
                                            {filteredMedia.length === 0 ? (
                                                <p className={styles.noResults}>No matching media found</p>
                                            ) : (
                                                filteredMedia.map(media => {
                                                    const alreadyIn = isMediaInAlbum(media.id);
                                                    return (
                                                        <div key={media.id} className={clsx(styles.libraryItem, alreadyIn && styles.disabled)}>
                                                            <div className={styles.itemThumb}>
                                                                {media.mime_type.startsWith('image/') ? (
                                                                    <img src={getThumbnailUrl(media.url)} alt="" />
                                                                ) : (
                                                                    <div className={styles.thumbPlaceholder}>
                                                                        <File size={20} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className={styles.itemInfo}>
                                                                <span className={styles.itemName}>{media.filename}</span>
                                                                <span className={styles.itemMeta}>{media.mime_type}</span>
                                                            </div>
                                                            <Button
                                                                onClick={() => addMediaMutation.mutate({
                                                                    albumId: managingAlbum.id,
                                                                    mediaId: media.id
                                                                })}
                                                                disabled={addMediaMutation.isPending || alreadyIn}
                                                                variant={alreadyIn ? 'secondary' : 'primary'}
                                                            >
                                                                {alreadyIn ? 'Added' : 'Add'}
                                                            </Button>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                )}

                                {managingAlbum.media_files && managingAlbum.media_files.length > 0 ? (
                                    <div className={styles.enhancedMediaGrid}>
                                        {managingAlbum.media_files.map(media => (
                                            <div key={media.id} className={styles.mediaThumbnailCard}>
                                                <div className={styles.cardPreview}>
                                                    {media.mime_type.startsWith('image/') ? (
                                                        <img src={getThumbnailUrl(media.url)} alt={media.filename} />
                                                    ) : (
                                                        <div className={styles.fileIcon}>
                                                            <File size={32} />
                                                        </div>
                                                    )}
                                                    <button
                                                        className={styles.removeBtn}
                                                        onClick={() => removeMediaMutation.mutate({
                                                            albumId: managingAlbum.id,
                                                            mediaId: media.id
                                                        })}
                                                        disabled={removeMediaMutation.isPending}
                                                        title="Remove from album"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                                <div className={styles.cardLabel} title={media.filename}>
                                                    {media.filename}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={styles.emptyMedia}>
                                        <p>This album is empty.</p>
                                        <p>Add some media from your library to get started!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
