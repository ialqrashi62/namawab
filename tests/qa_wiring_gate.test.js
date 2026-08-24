// QA wiring gate: every routes/*.js module's mount in server.js must pass exactly the factory params
const fs = require('fs');
const assert = require('assert');
const path = require('path');

const srv = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8').split('\n');
const dir = path.join(__dirname, '..', 'routes');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.routes.js'));

let checked = 0;
for (const f of files) {
    const mod = srv.join('\n');
    const sigLines = fs.readFileSync(path.join(dir, f), 'utf8').split('\n').slice(0, 6).join(' ');
    const sigMatch = sigLines.match(/module\.exports\s*=\s*function[\s\S]*?\(\{([\s\S]*?)\}\)/);
    assert.ok(sigMatch, `${f}: factory signature not found`);
    const params = sigMatch[1].split(',').map(s => s.trim()).filter(Boolean);

    // find its mount line
    const base = f.replace('.routes.js', '');
    const mountLine = srv.find(l => l.includes(`./routes/${f}'`) || l.includes(`./routes/${base}.routes'`));
    assert.ok(mountLine, `NO MOUNT for ${f}`);

    for (const p of params) {
        const re = new RegExp('[{,\\s]' + p + '[,}\\s}]');
        assert.ok(re.test(mountLine.slice(mountLine.indexOf('({'))), `${f}: mount missing dep '${p}'`);
    }
    checked++;
    console.log(`wiring OK: ${f} (${params.length} deps passed)`);
}
console.log(`WIRING GATE PASS: ${checked}/${files.length} modules synced`);
