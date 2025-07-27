import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import Hls from 'hls.js';
import CameraView from '../components/CameraView';

export default function Dashboard() {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCameras() {
      try {
        const token = localStorage.getItem('jwt');
        const username = localStorage.getItem('username');
        if (!token || !username) throw new Error('Not authenticated');

        const res = await fetch(`/users/${username}/cameras`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`Server responded ${res.status}`);

        const cams = await res.json();
        setCameras(cams);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCameras();
  }, []);

  useEffect(() => {
    if (Hls.isSupported()) {
      cameras.forEach(cam => {
        const video = document.getElementById(`video-${cam.id}`);
        if (video) {
          const hls = new Hls();
          hls.loadSource(`/streams/cam_${cam.id}/index.m3u8`);
          hls.attachMedia(video);
        }
      });
    }
  }, [cameras]);

  if (loading) return <div className="status">Loading cameras…</div>;
  if (error) return <div className="status error">Error: {error}</div>;
  if (cameras.length === 0) return <div className="status">No cameras found for your account.</div>;

  return (
    <div className="dashboard">
      <h2>Your Camera Feeds</h2>
      <div className="video-grid">
        {cameras.map(cam => (
          <CameraView key={cam.id} cam={cam} />
        ))}
      </div>
    </div>
  );
}
