const https = require('https');
https.get('https://firestore.googleapis.com/v1/projects/webcoachleon/databases/(default)/documents/athletes/lukas@piloto.coachleon.com', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const doc = JSON.parse(data);
    const evals = doc.fields && doc.fields.evaluations && doc.fields.evaluations.arrayValue.values ? doc.fields.evaluations.arrayValue.values.length : 0;
    console.log("Total evaluations for Lukas:", evals);
  });
});
