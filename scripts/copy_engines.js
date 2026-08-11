#!/usr/bin/env node
// Copy the 3 enhanced engines (neurology, orthopedics, surgery) to their files
'use strict';
const fs = require('fs');
const enhancePath = 'scripts/enhance_engines.js';
const enhanceContent = fs.readFileSync(enhancePath, 'utf8');

// Extract specific engine blocks by searching for the marker comments
function extractEngine(deptName) {
    const startMarker = `// ${deptName}_engine.js`;
    const endMarker = `module.exports = {`;
    const startIdx = enhanceContent.indexOf(startMarker);
    if (startIdx < 0) return null;
    const endIdx = enhanceContent.indexOf(endMarker, startIdx);
    if (endIdx < 0) return null;
    const blockEnd = enhanceContent.indexOf('};', endIdx) + 2;
    return enhanceContent.slice(startIdx, blockEnd);
}

const targets = ['neurology', 'orthopedics', 'surgery'];
let count = 0;
for (const dept of targets) {
    const code = extractEngine(dept);
    if (!code) {
        console.log(`Could not extract ${dept}`);
        continue;
    }
    const filePath = `namaweb/${dept}_engine.js`;
    fs.writeFileSync(filePath, code);
    console.log(`Created ${filePath} (${code.length} bytes)`);
    count++;
}
console.log(`\nTotal created: ${count}`);
