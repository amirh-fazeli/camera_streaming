// cloud_packager.js
require('dotenv').config();
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE_PORT = parseInt(process.env.CLOUD_SRT_PORT, 10) || 8888;
const HELPER_ID = process.env.HELPER_ID || '1';
const SRT_KEY   = process.env.SRT_KEY;
const CAMERA_COUNT = 4;

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function startFFmpeg(camId, port) {
  const streamId = `#!::mcast,helper_${HELPER_ID}_cam_${camId}`;
  const url = `srt://0.0.0.0:${port}` +
              `?mode=listener` +
              `&streamid=${streamId}` +
              `&pass=${SRT_KEY}` +
              `&rcvbuf=60000000`;

  const outputDir = path.join(__dirname, 'public', 'streams', `cam_${camId}`);
  ensureDir(outputDir);

  const ffArgs = [
    '-fflags', 'nobuffer',
    '-thread_queue_size', '512',
    '-i', url,
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-crf', '23',
    '-b:v', '6000k',
    '-maxrate', '7000k',
    '-bufsize', '10000k',
    '-force_key_frames', 'expr:gte(t,n_forced*2)',
    '-g', '50',
    '-keyint_min', '50',
    '-hls_time', '2',
    '-hls_list_size', '6',
    '-hls_flags', 'delete_segments',
    '-hls_segment_filename', path.join(outputDir, 'segment_%03d.ts'),
    path.join(outputDir, 'index.m3u8')
  ];

  console.log(`📥 Starting packager for cam ${camId}: ${url}`);
  const proc = spawn('ffmpeg', ffArgs, {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  proc.stdout.on('data', chunk => {
    process.stdout.write(`ffmpeg [cam ${camId}] stdout: ${chunk}`);
  });

  proc.stderr.on('data', chunk => {
    const msg = chunk.toString();
    process.stderr.write(`ffmpeg [cam ${camId}] stderr: ${msg}`);
    if (msg.includes('Error opening input')) {
      console.log(`❌ Input error on cam ${camId}, killing...`);
      proc.kill('SIGINT');
    }
  });

  proc.on('exit', (code, signal) => {
    console.log(`🛑 FFmpeg for cam ${camId} exited (code=${code}, signal=${signal}), retrying in 5s...`);
    setTimeout(() => startFFmpeg(camId, port), 5000);
  });
}

// Start one FFmpeg per camera
for (let i = 0; i < CAMERA_COUNT; i++) {
  const camId = i + 1;
  const port = BASE_PORT + i;
  startFFmpeg(camId, port);
}
