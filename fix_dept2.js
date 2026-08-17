const fs = require('fs');
let c = fs.readFileSync('server.js.full', 'utf8');
const broken = "  app.use('/api/v4/dept'";
const fixed = "  app.use('/api/v4/dept', require('./routes/dept_router'));";
const idx = c.indexOf(broken);
console.log('Found broken at index:', idx);
if (idx < 0) { console.error('not found'); process.exit(1); }
// Check if this is the broken one (without closing paren) by checking next chars
const after = c.substring(idx, idx + 100);
if (after.startsWith(broken) && !after.startsWith(fixed)) {
  c = c.replace(broken, fixed);
  fs.writeFileSync('server.js.full', c);
  console.log('fixed');
} else {
  console.log('already fixed');
}