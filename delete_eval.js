const admin = require('firebase-admin');

// We need a service account to use firebase-admin. Since I don't have it initialized here, 
// maybe I can just write a quick script that runs in the browser or uses the REST API?
// Actually we can just write a Node script using the REST API if we have an auth token,
// But we don't have an auth token. 
// Wait, we can just edit admin.html locally, add a one-off snippet to delete it, and run it in the browser? 
// Or I can instruct Pablo to delete it before I remove the UI?
