const https = require('https');

function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if(res.statusCode >= 200 && res.statusCode < 300) resolve(body ? JSON.parse(body) : {});
                else reject(new Error(`Status: ${res.statusCode} ${body}`));
            });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

(async () => {
    try {
        const listRes = await request('https://firestore.googleapis.com/v1/projects/webcoachleon/databases/(default)/documents/athletes');
        const docs = listRes.documents || [];
        for (const doc of docs) {
            const name = doc.fields.name ? doc.fields.name.stringValue : '';
            if (name === '' || name === 'Sin nombre' || doc.name.includes("123456789") || doc.name.includes("retes97")) {
                console.log("Deleting", doc.name);
                await request({
                    hostname: 'firestore.googleapis.com',
                    path: `/v1/${doc.name}`,
                    method: 'DELETE'
                });
            }
        }
        console.log("Done");
    } catch(e) { console.error(e); }
})();
