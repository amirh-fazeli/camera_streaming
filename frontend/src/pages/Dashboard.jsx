// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import './Dashboard.css';

export default function Dashboard({ username, apiUrl }) {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    async function loadCameras() {
      try {
        const token = localStorage.getItem('jwt');        // or wherever you keep it
        const res = await fetch(`${apiUrl}/users/${username}/cameras`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const cams = await res.json();
        setCameras(cams);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCameras();
  }, [username, apiUrl]);

  if (loading) return <div className="status">Loading cameras…</div>;
  if (error)   return <div className="status error">Error: {error}</div>;
  if (!cameras.length) return <div className="status">No cameras found.</div>;

  return (
    <div className="dashboard">
      <h2>Your Cameras</h2>
      <div className="video-grid">
        {cameras.map(cam => {
          // build the HLS URL for this camera
          const src = `${apiUrl}/streams/cam_${cam.id}/index.m3u8`;
          return (
            <div key={cam.id} className="video-tile">
              <video
                src={src}
                controls
                autoPlay
                muted
                playsInline
              />
              <div className="caption">{cam.name || `Camera ${cam.id}`}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
