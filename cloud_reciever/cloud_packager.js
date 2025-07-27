// cloud_packager.js
// -----------------
// Spawns individual HLS packagers for each SRT stream

require('dotenv').config();
const { spawn } = require('child_process');

const BASE_PORT    = parseInt(process.env.CLOUD_SRT_PORT, 10) || 8888;
const HELPER_ID    = process.env.HELPER_ID || '1';
const SRT_KEY      = process.env.SRT_KEY;
const CAMERA_COUNT = parseInt(process.env.CAMERA_COUNT, 10) || 4;

function spawnForCam(camId, port) {
  const streamId = `#!::mcast,helper_${HELPER_ID}_cam_${camId}`;
  const url = `srt://0.0.0.0:${port}` +
              `?mode=listener` +
              `&streamid=${streamId}` +
              `&pass=${SRT_KEY}` +
              `&rcvbuf=60000000`;

  console.log(`📥 Listening for cam ${camId} on port ${port}`);

  const ffArgs = [
    '-fflags', 'nobuffer',
    '-thread_queue_size', '512',
    '-i', url,
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '23',
    '-b:v', '4000k',
    '-maxrate', '5000k',
    '-bufsize', '8000k',
    '-g', '50',
    '-keyint_min', '50',
    '-force_key_frames', 'expr:gte(t,n_forced*2)',
    '-hls_time', '2',
    '-hls_list_size', '6',
    '-hls_flags', 'delete_segments',
    '-hls_segment_filename', `./public/streams/cam${camId}_%03d.ts`,
    `./public/streams/cam${camId}.m3u8`
  ];

  const proc = spawn('ffmpeg', ffArgs, { stdio: ['ignore', 'pipe', 'pipe'] });

  proc.stdout.on('data', chunk => {
    process.stdout.write(`cam${camId} stdout: ${chunk}`);
  });

  proc.stderr.on('data', chunk => {
    const msg = chunk.toString();
    process.stderr.write(`cam${camId} stderr: ${msg}`);
    if (msg.includes('Error opening input')) {
      console.log(`❌ Cam ${camId} input error, killing and retrying...`);
      proc.kill('SIGINT');
    }
  });

  proc.on('exit', (code, signal) => {
    console.log(`🛑 Cam ${camId} exited (code=${code}, signal=${signal}), retrying in 5s...`);
    setTimeout(() => spawnForCam(camId, port), 5000);
  });
}

for (let i = 0; i < CAMERA_COUNT; i++) {
  const camId = i + 1;
  const port = BASE_PORT + i;
  spawnForCam(camId, port);
}
