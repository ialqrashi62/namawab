const fs = require('fs');
let c = fs.readFileSync('server.js.full', 'utf8');
const fixes = [
  // Remove orphan from original
  ["try { app.use('/api/v4/dept', require('./routes/dept_router')); } catch (e) { console.warn('[mount] /api/v4/dept not mounted:', e.message); }\n, dept_api_v4);\n} catch (e) { console.warn('[mount] /api/v4/dept not mounted:', e.message); }\n\n", ""],
  [", dept_api_v4);\n} catch (e) { console.warn('[mount] /api/v4/dept not mounted:', e.message); }\n\n", ""],
  [", dept_api_v4);\n", ""],
];
let applied = 0;
fixes.forEach(([from, to]) => {
  if (c.includes(from)) {
    c = c.replace(from, to);
    applied++;
    console.log('Applied', from.substring(0, 60));
  }
});
fs.writeFileSync('server.js.full', c);
console.log('Total applied:', applied);