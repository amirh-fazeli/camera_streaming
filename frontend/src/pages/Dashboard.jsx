import React, { useEffect, useState } from 'react';
import './Dashboard.css';  // make sure you import the CSS

/**
 * Dashboard shows a responsive grid of video tiles
 * based on the number of cameras the authenticated user has.
 */
export default function Dashboard() {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCameras() {
      try {
        // read JWT and username from localStorage
        const token = localStorage.getItem('jwt');
        const username = localStorage.getItem('username');
        
        if (!token || !username) {
          throw new Error('Not authenticated');
        }

        const res = await fetch(`/users/${username}/cameras`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          throw new Error(`Server responded ${res.status}`);
        }
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

  if (loading) return <div className="status">Loading cameras…</div>;
  if (error)   return <div className="status error">Error: {error}</div>;

  if (cameras.length === 0) {
    return <div className="status">No cameras found for your account.</div>;
  }

  return (
    <div className="dashboard">
      <h2>Your Camera Feeds</h2>
      <div className="video-grid">
      {cameras.map(cam => {
         const src = `/streams/cam_${cam.id}/index.m3u8`;
         return (
           <div key={cam.id} className="video-tile">
             <video
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
       })}
      </div>
    </div>
  );
}
