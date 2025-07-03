const { Discovery } = require('onvif');

Discovery.probe((err, cams) => {
  if (err) {
    console.error('Discovery error:', err);
    return;
  }

  if (!cams.length) {
    console.log('No ONVIF cameras found.');
    return;
  }

  cams.forEach((cam, index) => {
    console.log(`📷 Camera #${index + 1}`);
    console.log(`- Name: ${cam.name}`);
    console.log(`- XAddr (stream URL): ${cam.xaddrs[0]}`);
    console.log(`- Address: ${cam.address}`);
    console.log('----------------------');
  });
});
