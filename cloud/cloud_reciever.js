require('dotenv').config();
const { Client } = require('pg');
const { spawn } = require('child_process');

const DATABASE_URL = process.env.DATABASE_URL;
const HELPER_ID    = process.env.HELPER_ID;
const BASE_PORT    = parseInt(process.env.CLOUD_SRT_PORT, 10) || 8888;
const SRT_KEY      = process.env.SRT_KEY;

async function getCameraIds() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  const { rows } = await client.query('SELECT id FROM cameras ORDER BY id');
  await client.end();
  return rows.map(r => r.id);
}

function startListener(id, portOffset) {
  const port = BASE_PORT + portOffset;
  const streamId = `#!::mcast,helper_${HELPER_ID}_cam_${id}`;
  const srtUrl =
    `srt://0.0.0.0:${port}` +
    `?mode=listener` +
    `&streamid=${streamId}` +
    `&pass=${SRT_KEY}`;

  spawn('ffplay', ['-fflags', 'nobuffer', srtUrl], { stdio: 'inherit' });
  console.log(`Listening cam ${id} on port ${port}`);
}

(async () => {
  console.log('Cloud Receiver starting...');
  const ids = await getCameraIds();
  ids.forEach((id, idx) => startListener(id, idx));
})();