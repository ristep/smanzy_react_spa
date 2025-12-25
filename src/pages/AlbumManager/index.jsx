import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit, X } from 'lucide-react';
import api from '@/services/api';
import Button from '@/components/Button';
import Panel from '@/components/Panel';
import styles from './index.module.scss';
import clsx from 'clsx';

export default function AlbumManager() {
    const queryClient = useQueryClient();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [selectedAlbum, setSelectedAlbum] = useState(null);
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

    // Delete album mutation
    const deleteAlbumMutation = useMutation({
        mutationFn: (albumId) => api.delete(`/albums/${albumId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['albums'] });
            setSelectedAlbum(null);
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
                                        onClick={() => setSelectedAlbum(selectedAlbum?.id === album.id ? null : album)}
                                        variant="secondary"
                                    >
                                        {selectedAlbum?.id === album.id ? 'Hide Details' : 'View'}
                                    </Button>
                                    <Button
                                        onClick={() => deleteAlbumMutation.mutate(album.id)}
                                        disabled={deleteAlbumMutation.isPending}
                                        variant="danger"
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>

                                {selectedAlbum?.id === album.id && (
                                    <div className={styles.albumDetails}>
                                        <div className={styles.mediaSection}>
                                            <div className={styles.mediaSectionHeader}>
                                                <h4>Media Files</h4>
                                                <Button
                                                    onClick={() => setShowAddMediaForm(!showAddMediaForm)}
                                                    size="small"
                                                >
                                                    {showAddMediaForm ? 'Cancel' : <Plus size={16} />}
                                                </Button>
                                            </div>

                                            {showAddMediaForm && (
                                                <div className={styles.addMediaForm}>
                                                    <input
                                                        type="text"
                                                        placeholder="Search media files..."
                                                        value={mediaSearch}
                                                        onChange={(e) => setMediaSearch(e.target.value)}
                                                        className={styles.searchInput}
                                                    />
                                                    <div className={styles.mediaList}>
                                                        {filteredMedia.length === 0 ? (
                                                            <p>No media files found</p>
                                                        ) : (
                                                            filteredMedia.map(media => (
                                                                <div key={media.id} className={styles.mediaItem}>
                                                                    <span>{media.filename}</span>
                                                                    <Button
                                                                        onClick={() => addMediaMutation.mutate({
                                                                            albumId: album.id,
                                                                            mediaId: media.id
                                                                        })}
                                                                        size="small"
                                                                        disabled={addMediaMutation.isPending}
                                                                    >
                                                                        Add
                                                                    </Button>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {album.media_files && album.media_files.length > 0 ? (
                                                <div className={styles.mediaGrid}>
                                                    {album.media_files.map(media => (
                                                        <div key={media.id} className={styles.mediaItemCard}>
                                                            <div className={styles.mediaName}>
                                                                {media.filename}
                                                            </div>
                                                            <Button
                                                                onClick={() => removeMediaMutation.mutate({
                                                                    albumId: album.id,
                                                                    mediaId: media.id
                                                                })}
                                                                size="small"
                                                                disabled={removeMediaMutation.isPending}
                                                                variant="danger"
                                                            >
                                                                <X size={16} />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className={styles.emptyMedia}>No media in this album</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </Panel>
        </div>
    );
}
