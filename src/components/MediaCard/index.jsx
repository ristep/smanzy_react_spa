import { useState } from 'react';
import { Edit, Download, Trash2, File, FileText, FileArchive, Image, Video, FileMusic, X } from 'lucide-react';
import IconButton from '@/components/IconButton';
import styles from './index.module.scss';
import clsx from 'clsx';

export default function MediaCard({
    media,
    onEdit,
    onDelete,
    onDownload,
    canManage = false,
    canView = true,
}) {
    const [showPreview, setShowPreview] = useState(false);
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

    const isImageFile = (mimeType) => {
        return mimeType?.startsWith('image/');
    };

    const getThumbnailUrl = () => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
        return baseUrl + media.url;
    };

    return (
        <>
            <tr className={styles.tr}>
                <td className={styles.td}>
                    <div 
                        className={clsx(styles.thumbnailWrapper, isImageFile(media.mime_type) && styles.clickable)}
                        onClick={() => isImageFile(media.mime_type) && setShowPreview(true)}
                    >
                        {isImageFile(media.mime_type) ? (
                            <img
                                src={getThumbnailUrl()}
                                alt={media.filename}
                                className={styles.thumbnail}
                            />
                        ) : (
                            <div className={styles.thumbnailPlaceholder}>
                                {getFileIcon(media.mime_type)}
                            </div>
                        )}
                    </div>
                </td>
                <td className={styles.td}>
                    <div className={styles.fileName}>{media.filename}</div>
                    <div className={styles.fileId}>ID: {media.id}</div>
                </td>
                <td className={styles.td}>
                    <span className={styles.typeBadge}>
                        {getFileIcon(media.mime_type)}
                    </span>
                </td>
                <td className={clsx(styles.td, styles.textSecondary)}>
                    {formatFileSize(media.size)}
                </td>
                <td className={clsx(styles.td, styles.textSecondary)}>
                    {formatDate(media.created_at)}
                </td>
                <td className={clsx(styles.td, styles.right)}>
                    <div className="flex justify-end gap-2">
                        <IconButton
                            onClick={() => onDownload(media)}
                            disabled={!canView}
                            title="Download"
                        >
                            <Download />
                        </IconButton>
                        <IconButton
                            onClick={() => onEdit(media)}
                            disabled={!canManage}
                            title="Edit"
                        >
                            <Edit />
                        </IconButton>
                        <IconButton
                            onClick={() => onDelete(media)}
                            disabled={!canManage}
                            title="Delete"
                        >
                            <Trash2 />
                        </IconButton>
                    </div>
                </td>
            </tr>

            {/* Image Preview Overlay */}
            {showPreview && isImageFile(media.mime_type) && (
                <div 
                    className={styles.overlay}
                    onClick={() => setShowPreview(false)}
                >
                    <div className={styles.overlayContent} onClick={(e) => e.stopPropagation()}>
                        <button
                            className={styles.closeButton}
                            onClick={() => setShowPreview(false)}
                            title="Close"
                        >
                            <X />
                        </button>
                        <img
                            src={getThumbnailUrl()}
                            alt={media.filename}
                            className={styles.largeImage}
                        />
                        <div className={styles.imageInfo}>
                            <p className={styles.imageName}>{media.filename}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
