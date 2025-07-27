import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

function CameraView({ camId }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const playlistUrl = `/streams/cam${camId}/playlist.m3u8`;
    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(playlistUrl);
      hls.attachMedia(video);
      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = playlistUrl;
    }
  }, [camId]);

  return <video ref={videoRef} controls autoPlay muted style={{ width: '100%' }} />;
}

export default CameraView;
