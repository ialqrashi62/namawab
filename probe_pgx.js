const { spawnSync } = require('child_process');

const inner = `
const express = require('express');
const app = express();

const pgxMod = require('./routes/pgx');
const router = pgxMod.newPgxRouter();
console.log('=== pgx stack length:', router.stack.length);
router.stack.forEach((l,i) => {
  if (l.route) console.log(i, Object.keys(l.route.methods), l.route.path);
});

const _cloned = express.Router();
function cloneLayer(cloned, layer, prefix) {
  if (layer.route) {
    let p = layer.route.path;
    if (p.indexOf(prefix) === 0) p = p.slice(prefix.length) || '/';
    if (p.charAt(0) !== '/') p = '/' + p;
    const methods = Object.keys(layer.route.methods);
    methods.forEach(m => {
      if (m === '_all') return;
      cloned[m](p, layer.handle);
    });
  }
}
router.stack.forEach(l => cloneLayer(_cloned, l, '/api/v4/pgx'));
console.log('=== cloned stack length:', _cloned.stack.length);
_cloned.stack.forEach((l,i) => {
  if (l.route) console.log(i, Object.keys(l.route.methods), l.route.path);
});

app.use('/api/v4/pgx', _cloned);
app.get('/api/health', (req,res)=>res.json({ok:true}));

const srv = app.listen(3999, () => {
  const http = require('http');
  http.get('http://127.0.0.1:3999/api/v4/pgx/pairs', r => {
    let d=''; r.on('data',c=>d+=c); r.on('end',()=>{
      console.log('=== curl status:', r.statusCode, 'body:', d.slice(0,200));
      srv.close();
    });
  });
});
`;

const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c "cat > /var/www/namaweb/_probe_pgx_tmp.js << 'NMEDCALVSCODE_EOF'\n${inner}\nNMEDCALVSCODE_EOF\ncd /var/www/namaweb && node _probe_pgx_tmp.js; rm -f /var/www/namaweb/_probe_pgx_tmp.js"`
]);

console.log('---OUT---');
console.log((r.stdout || '').toString().slice(0, 4000));
console.log('---ERR---');
console.log((r.stderr || '').toString().slice(0, 2000));
