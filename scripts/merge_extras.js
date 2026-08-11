// filepath: scripts/merge_extras.js
'use strict';
const fs = require('fs');

const deps = ['cardiology', 'neurology', 'oncology', 'orthopedics'];
for (const dept of deps) {
    const main = fs.readFileSync(`namaweb/${dept}_engine.js`, 'utf8');
    const extra = fs.readFileSync(`namaweb/${dept}_extras.js`, 'utf8');
    // Extract just the function definitions from extras (between 'use strict' and 'module.exports')
    const useStrict = "'use strict';";
    const moduleStart = 'module.exports =';
    const startIdx = extra.indexOf(useStrict);
    const endIdx = extra.indexOf(moduleStart);
    if (startIdx < 0 || endIdx < 0) {
        console.log(`${dept}: skip (no markers)`);
        continue;
    }
    // Take the extras content (skip 'use strict' and VERSION/CITATIONS duplicates)
    let extrasContent = extra.slice(startIdx + useStrict.length, endIdx).trim();
    // Remove VERSION/CITATIONS duplicates within extras
    extrasContent = extrasContent.replace(/^const VERSION.*$/gm, '');
    extrasContent = extrasContent.replace(/^const CITATIONS.*$/gm, '');
    // Find the line just before module.exports in main
    const mainEndIdx = main.lastIndexOf(moduleStart);
    const newMain = main.slice(0, mainEndIdx) + extrasContent + '\n' + main.slice(mainEndIdx);
    fs.writeFileSync(`namaweb/${dept}_engine.js`, newMain);
    console.log(`Merged ${dept}: ${newMain.length} bytes`);
}
