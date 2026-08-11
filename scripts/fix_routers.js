// filepath: scripts/fix_routers.js
'use strict';
const fs = require('fs');

const files = ['cardiology_router.js', 'oncology_router.js'];
for (const f of files) {
    const path = `namaweb/${f}`;
    let c = fs.readFileSync(path, 'utf8');
    // Replace literal \n with actual newline
    c = c.replace(/\\n/g, '\n');
    fs.writeFileSync(path, c);
    console.log(`Fixed ${f}`);
}
