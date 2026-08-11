#!/usr/bin/env node
// Properly extract and save engines
'use strict';
const fs = require('fs');

const enhancePath = 'scripts/enhance_engines.js';
const enhanceContent = fs.readFileSync(enhancePath, 'utf8');

// Extract from backtick : `const ${dept}_engine = \`...\`;` to backtick closure
function extractEngine(deptName) {
    const marker = `const ${deptName}_engine = \``;
    const startIdx = enhanceContent.indexOf(marker);
    if (startIdx < 0) return null;
    const codeStart = startIdx + marker.length;
    // Find the matching closing backtick and semicolon
    // The next `\`` outside the file is the close
    let endIdx = -1;
    for (let i = codeStart; i < enhanceContent.length; i++) {
        if (enhanceContent[i] === '`' && enhanceContent[i+1] === ';') {
            endIdx = i;
            break;
        }
    }
    if (endIdx < 0) return null;
    return enhanceContent.slice(codeStart, endIdx);
}

const targets = ['neurology', 'orthopedics', 'surgery'];
for (const dept of targets) {
    const code = extractEngine(dept);
    if (!code) {
        console.log(`Could not extract ${dept}`);
        continue;
    }
    const filePath = `namaweb/${dept}_engine.js`;
    fs.writeFileSync(filePath, code);
    console.log(`Wrote ${dept}: ${code.length} bytes`);
}
