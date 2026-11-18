const https = require('https');
const fs = require('fs');

https.get('https://calcdial.pages.dev/_next/static/chunks/3_nrqfvr9b198.css', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    fs.writeFileSync('downloaded.css', data);
    console.log('CSS length:', data.length);
    console.log('Includes appearance:', data.includes('appearance'));
    console.log('Includes webkit-appearance:', data.includes('-webkit-appearance'));
    console.log('Includes ms-expand:', data.includes('ms-expand'));
  });
});
