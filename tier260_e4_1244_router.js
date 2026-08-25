const { funcs, ValidationError } = require('./tier260_e4_1244_engine.js');
const r = require('express').Router();
for (const fn of Object.keys(funcs())) {
  r.post('/' + fn, (req, res) => {
    try { res.json({ ok: true, result: funcs()[fn](req.body || {}) }); }
    catch (e) { res.status(e instanceof ValidationError ? 400 : 500).json({ ok: false, error: e.message }); }
  });
}
module.exports = r;
