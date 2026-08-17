const fs = require('fs');
let c = fs.readFileSync('server.js.full', 'utf8');
const pattern = "  app.use('/api/v4/dept', require('./routes/dept_router'));\n// ===== autowire_all_v23";
const replacement = "  app.use('/api/v4/dept', require('./routes/dept_router'));\n} catch (e) { console.warn('[mount] /api/v4/dept not mounted:', e.message); }\n// ===== autowire_all_v23";
if (c.includes(pattern)) {
  c = c.replace(pattern, replacement);
  fs.writeFileSync('server.js.full', c);
  console.log('fixed - added closing try/catch');
} else {
  console.log('pattern not found, may already be fixed');
}