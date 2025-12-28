import React from 'react';
import MediaCard from "@/components/MediaCard";

import "./index.module.scss";

function VideoCard({ video }) {
    const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
    const thumbUrl = `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`;

    // Transform video data to match MediaCard's expected media object structure
    const mediaObject = {
        id: video.id,
        filename: video.title,
        mime_type: 'video/youtube', // Custom mime type for YouTube videos
        size: 0, // Not applicable for YouTube videos
        url: thumbUrl, // Use YouTube thumbnail URL
        created_at: new Date().toISOString(), // Not applicable, using current date
        views: video.views // Custom field for view count
    };

    // Handle click to open YouTube video
    const handleView = () => {
        window.open(videoUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div onClick={handleView} style={{ cursor: 'pointer' }}>
            <MediaCard
                media={mediaObject}
                onEdit={() => { }} // No-op for YouTube videos
                onDelete={() => { }} // No-op for YouTube videos
                onDownload={handleView} // Redirect to YouTube on "download"
                canManage={false} // Hide edit/delete buttons
                canView={true}
                variant="grid"
            />
        </div>
    );
}
