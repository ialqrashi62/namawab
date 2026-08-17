const fs = require('fs');
let c = fs.readFileSync('server.js.full', 'utf8');
// Fix CRLF-based orphans
const bad = '); }\r\n, dept_api_v4);\r\n} catch (e) { console.warn(\'[mount] /api/v4/dept not mounted:\', e.message); }\r\n\r\n';
const good = '); }\r\n\r\n';
if (c.includes(bad)) {
  c = c.replace(bad, good);
  fs.writeFileSync('server.js.full', c);
  console.log('removed CRLF orphan');
} else {
  // Try with just the orphan
  const altBad = '\r\n, dept_api_v4);\r\n';
  const altGood = '\r\n';
  let idx = c.indexOf(altBad);
  while (idx >= 0) {
    c = c.substring(0, idx) + altGood + c.substring(idx + altBad.length);
    idx = c.indexOf(altBad);
  }
  fs.writeFileSync('server.js.full', c);
  console.log('removed orphan lines (count)');
}