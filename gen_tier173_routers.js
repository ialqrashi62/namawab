// filepath: gen_tier173_routers.js
const fs = require('fs');
const path = require('path');
const engines = ['tier173_pul_806','tier173_skp_807','tier173_mus_808','tier173_int_809','tier173_ped_810'];
const outDir = 'C:/Users/ice/Desktop/NMEDCALVSCODE/namaweb';
for (const e of engines) {
  const { funcs, ValidationError } = require(path.join(outDir, e + '_engine.js'));
  const code = `const { funcs, ValidationError } = require('./${e}_engine.js');
const r = require('express').Router();
for (const fn of Object.keys(funcs())) {
  r.post('/' + fn, (req, res) => {
    try { res.json({ ok: true, result: funcs()[fn](req.body || {}) }); }
    catch (e) { res.status(e instanceof ValidationError ? 400 : 500).json({ ok: false, error: e.message }); }
  });
}
module.exports = r;
`;
  fs.writeFileSync(path.join(outDir, e + '_router.js'), code);
  console.log('OK', e + '_router');
}