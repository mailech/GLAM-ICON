const http = require('http');

const options = {
    hostname: 'localhost',
    port: 4005,
    path: '/api/events',
    method: 'GET'
};

const req = http.request(options, res => {
    console.log(`StatusCode: ${res.statusCode}`);
    res.on('data', d => {
        process.stdout.write(d);
    });
});

req.on('error', error => {
    console.error('Error connecting to backend on 4005:', error.message);
});

req.end();
