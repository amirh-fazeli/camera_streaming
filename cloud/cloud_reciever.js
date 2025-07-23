// cloud_receiver.js
// -----------------
// Listens for SRT streams pushed by the helper box and plays each feed in its own FFplay window.
// Sets SDL hint to prevent windows from minimizing on focus loss.

require('dotenv').config();
const { Client } = require('pg');
const { spawn }  = require('child_process');

const DATABASE_URL = process.env.DATABASE_URL;
const HELPER_ID    = process.env.HELPER_ID;
const BASE_PORT    = parseInt(process.env.CLOUD_SRT_PORT, 10) || 8888;
const SRT_KEY      = process.env.SRT_KEY;

// Fetch camera IDs from the database
async function getCameraIds() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  const { rows } = await client.query('SELECT id FROM cameras ORDER BY id');
  await client.end();
  return rows.map(r => r.id);
}

// Spawn an FFplay listener for each camera on a unique port
function startListener(id, portOffset) {
  const port     = BASE_PORT + portOffset;
  const streamId = `#!::mcast,helper_${HELPER_ID}_cam_${id}`;
  const srtUrl =
    `srt://0.0.0.0:${port}` +
    `?mode=listener` +
    `&streamid=${streamId}` +
    `&pass=${SRT_KEY}` +
    `&latency=500000`;  // 500ms jitter buffer

  // Launch FFplay in detached mode and inject SDL hint
  const args = [
    '-fflags', 'nobuffer',
    '-x', '640',        // window width
    '-y', '360',        // window height
    '-i',    srtUrl
  ];
  const child = spawn('ffplay', args, {
    shell: true,
    detached: true,
    stdio: 'ignore',
    windowsHide: false,
    env: Object.assign({}, process.env, {
      SDL_VIDEO_MINIMIZE_ON_FOCUS_LOST: '0'
    })
  });
  child.unref();

  console.log(`Started listener for camera ${id} on port ${port}`);
}

(async () => {
  console.log('Cloud Receiver starting...');
  const ids = await getCameraIds();
  if (!ids.length) console.warn('No camera IDs found in DB');
  ids.forEach((id, idx) => startListener(id, idx));
})();

/*
  Setup Instructions:
  1. In your ~/cloud-receiver folder, save this as cloud_receiver.js.
  2. Create a .env with:
     DATABASE_URL=postgresql://dbuser:dbpass@localhost:5432/cameradb
     HELPER_ID=1
     CLOUD_SRT_PORT=8888
     SRT_KEY=<your_srt_key>
  3. Install deps:
     npm install dotenv pg
  4. Ensure FFmpeg and FFplay are installed system-wide.
  5. Start this before the helper box:
     node cloud_receiver.js
*/
