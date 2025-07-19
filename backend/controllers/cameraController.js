const { getCamerasByUsername, addCamera } = require('../database/cameras');

// UI: list cameras with playback URLs
exports.listForUI = async (req, res) => {
  const { username } = req.params;
  try {
    const cams = await getCamerasByUsername(username);
    const playbackHost = process.env.PLAYBACK_HOST;  // e.g. https://cloud.example.com
    const result = cams.map(cam => ({
      id: cam.id,
      name: cam.name,
      playbackUrl: `${playbackHost}/hls/${cam.id}.m3u8`
    }));
    res.json(result);
  } catch (err) {
    console.error('ListForUI error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UI: add a camera under a username
exports.addForUI = async (req, res) => {
  const { username } = req.params;
  const { rtsp_url, name } = req.body;
  try {
    const cam = await addCamera(username, rtsp_url, name);
    res.status(201).json(cam);
  } catch (err) {
    console.error('addForUI error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
