require('dotenv').config();
const { pool } = require('./database/db');
const { addUser } = require('./database/users');
const { addCamera } = require('./database/cameras');
const crypto = require('crypto');

async function seed() {
  try {
    // 1. create 'admin' user with password 'admin'
    const user = await addUser('admin', 'admin');
    console.log('Created user:', user);

    // 2. add four RTSP cameras under 'admin'
    const urls = [
      'rtsp://192.168.1.11:554/stream0?username=admin&password=E10ADC3949BA59ABBE56E057F20F883E',
      'rtsp://192.168.1.12:554/stream0?username=admin&password=E10ADC3949BA59ABBE56E057F20F883E',
      'rtsp://192.168.1.13:554/stream0?username=admin&password=E10ADC3949BA59ABBE56E057F20F883E',
      'rtsp://192.168.1.14:554/stream0?username=admin&password=E10ADC3949BA59ABBE56E057F20F883E'
    ];
    for (const url of urls) {
      const cam = await addCamera('admin', url, '');
      console.log('Created camera:', cam);
    }

    // 3. generate API_KEY and SRT_KEY, insert into helpers table
    const apiKey = "96da00a7586d0ff930bb9042872b165fdce415e161773a4cf01214dbc665194a";
    const srtKey = "530f383daea7a1d70827878d535c0bf3";
    const helperName = 'HelperBox1';
    await pool.query(
      `INSERT INTO helpers (name, api_key, srt_key, user_id)
       VALUES ($1, $2, $3, $4)`,
      [helperName, apiKey, srtKey, user.id]
    );
    console.log(`Created helper '${helperName}' with:`);
    console.log('  API_KEY =', apiKey);
    console.log('  SRT_KEY =', srtKey);
  } catch (err) {
    console.error('Error seeding test data:', err);
  } finally {
    await pool.end();
  }
}

seed();
