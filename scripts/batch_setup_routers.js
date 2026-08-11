// filepath: scripts/batch_setup_routers.js
// Add schema stubs + mount all 53 dept routers in server.js
'use strict';
const fs = require('fs');
const path = require('path');

const STAGING_DIR = '.ai-brain/05_ENGINES';
const LIVE_DIR = 'namaweb';
const SERVER = path.join(LIVE_DIR, 'server.js');
const SCHEMAS = path.join(LIVE_DIR, 'route_schemas.js');

const stubs = fs.readdirSync(STAGING_DIR).filter(f => f.endsWith('_engine.js'));

// ============ 1. Append schema stubs to route_schemas.js ============
const schemasContent = fs.readFileSync(SCHEMAS, 'utf8');
const append = [];
for (const stubFile of stubs) {
    const dept = stubFile.replace('_engine.js', '');
    const content = fs.readFileSync(path.join(STAGING_DIR, stubFile), 'utf8');
    const fnMatches = [...content.matchAll(/^function\s+(\w+)\s*\(/gm)];
    const fns = fnMatches.map(m => m[1]).filter(fn => fn !== 'main' && !fn.startsWith('_'));
    for (const fn of fns) {
        const schemaKey = `${dept}${fn.charAt(0).toUpperCase() + fn.slice(1)}`;
        if (!schemasContent.includes(`${schemaKey}:`)) {
            append.push(`// ${schemaKey}\nconst ${schemaKey} = { patientId: { type: 'string', required: true } };\n`);
        }
    }
}

if (append.length > 0) {
    // Insert before module.exports
    const exportMatch = schemasContent.match(/module\.exports\s*=/);
    if (exportMatch) {
        const insertIdx = exportMatch.index;
        const newContent = schemasContent.slice(0, insertIdx) + append.join('\n') + '\n' + schemasContent.slice(insertIdx);
        fs.writeFileSync(SCHEMAS, newContent);
        console.log(`Added ${append.length} schema stubs to route_schemas.js`);
    }
}

// ============ 2. Mount all 53 routers in server.js ============
const serverContent = fs.readFileSync(SERVER, 'utf8');
const mounts = [];
for (const stubFile of stubs) {
    const dept = stubFile.replace('_engine.js', '');
    const routerPath = path.join(LIVE_DIR, `${dept}_router.js`);
    if (!fs.existsSync(routerPath)) continue;
    const mountLine = `app.use('/api/${dept}', require('./${dept}_router'));`;
    if (!serverContent.includes(mountLine)) {
        mounts.push(`try { ${mountLine} } catch(e) { console.error('${dept} mount failed', e.message); }`);
    }
}

if (mounts.length > 0) {
    // Find a good insertion point - after existing try/catch mounts
    const anchor = "app.use('/api/ai', coPilotRouter);";
    if (serverContent.includes(anchor)) {
        const insertIdx = serverContent.indexOf(anchor) + anchor.length;
        const newContent = serverContent.slice(0, insertIdx) + '\n' + mounts.join('\n') + '\n' + serverContent.slice(insertIdx);
        fs.writeFileSync(SERVER, newContent);
        console.log(`Mounted ${mounts.length} new routers in server.js`);
    }
}
