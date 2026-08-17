const fs = require('fs');
let c = fs.readFileSync('server.js.full', 'utf8');
const lines = c.split('\n');
lines[20937] = 'try {';
lines[20938] = "  app.use('/api/v4/dept', require('./routes/dept_router'));";
lines[20939] = "} catch (e) { console.warn('[mount] /api/v4/dept not mounted:', e.message); }";
fs.writeFileSync('server.js.full', lines.join('\n'));
console.log('fixed');