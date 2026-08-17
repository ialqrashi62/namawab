// find_lines.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'server.js');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const patterns = [
    '/api/patients',
    '/api/invoices',
    '/api/appointments',
    'app.get(\'/api/patients',
    'app.post(\'/api/patients',
    'app.put(\'/api/patients',
    'app.delete(\'/api/patients',
    'app.get(\'/api/invoices',
    'app.post(\'/api/invoices',
    'app.put(\'/api/invoices',
    'app.get(\'/api/appointments',
    'app.post(\'/api/appointments',
    'app.put(\'/api/appointments',
    'app.delete(\'/api/appointments',
    'logAudit'
];

lines.forEach((line, idx) => {
    patterns.forEach(pat => {
        if (line.includes(pat)) {
            console.log(`Line ${idx + 1}: ${line.trim()}`);
        }
    });
});
