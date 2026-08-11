#!/usr/bin/env node
// Fix extracted engines by appending the closing brace
'use strict';
const fs = require('fs');

const targets = ['neurology', 'orthopedics', 'surgery'];
for (const dept of targets) {
    const filePath = `namaweb/${dept}_engine.js`;
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf8');
    // Make sure it ends with `};\n`
    content = content.trimEnd();
    if (!content.endsWith(';')) {
        content += ';\n';
    }
    if (!content.endsWith('}\n')) {
        content += '}\n';
    }
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${dept}: ${content.length} bytes`);
}
