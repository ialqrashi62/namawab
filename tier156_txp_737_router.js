const express = require('express');
const r = express.Router();
const { funcs } = require('./tier156_txp_737_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/evaluation', h(F.evaluation));
r.post('/donor_proc', h(F.donor_proc));
r.post('/recipient_op', h(F.recipient_op));
r.post('/immunosuppressant', h(F.immunosuppressant));
r.post('/post_op', h(F.post_op));
module.exports = r;