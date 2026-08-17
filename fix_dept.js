const fs = require('fs');
const c = fs.readFileSync('server.js.full', 'utf8');
const lines = c.split('\n');
const targetIdx = 20940; // 0-indexed = line 20941
console.log('Before:', lines[targetIdx]);
lines[targetIdx] = "  app.use('/api/v4/dept', require('./routes/dept_router'));";
console.log('After:', lines[targetIdx]);
fs.writeFileSync('server.js.full', lines.join('\n'));