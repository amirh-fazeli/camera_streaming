require('dotenv').config();
const { Client }   = require('pg');
const { spawn }    = require('child_process');

const DATABASE_URL = process.env.DATABASE_URL;
const HELPER_ID    = process.env.HELPER_ID;
const SRT_PORT     = process.env.CLOUD_SRT_PORT;
const SRT_KEY      = process.env.SRT_KEY;

// Fetch camera IDs from the DB
async function getCameraIds() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  const { rows } = await client.query('SELECT id FROM cameras');
  await client.end();
  return rows.map(r => r.id);
}

// Launch an FFplay process for each camera
function startPlayer(id) {
  const streamId = `#!::mcast,helper_${HELPER_ID}_cam_${id},mode=listener`;
  const srtUrl   = `srt://:${SRT_PORT}?streamid=${streamId}&pass=${SRT_KEY}`;
  spawn('ffplay', ['-fflags', 'nobuffer', srtUrl], { stdio: 'inherit' });
  console.log(`Started listener for camera ${id}`);
}

(async () => {
  console.log('Cloud receiver starting...');
  const ids = await getCameraIds();
  ids.forEach(startPlayer);
})();