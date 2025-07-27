import React from 'react';

export default function CameraView({ cam }) {
  const src = `/streams/cam_${cam.id}/index.m3u8`;

  return (
    <div className="video-tile">
      <video
        id={`video-${cam.id}`}
        src={src}
        controls
        autoPlay
        muted
        playsInline
        className="video-element"
      />
      <div className="caption">{cam.name || `Camera ${cam.id}`}</div>
    </div>
  );
}
