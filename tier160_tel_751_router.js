const express = require('express');
const r = express.Router();
const { funcs } = require('./tier160_tel_751_engine.js');
function h(fn) { return (req, res, next) => { try { const o = fn(req.body || {}); res.json({ ok: true, data: o }); } catch (e) { res.status(400).json({ ok: false, error: e.message }); } }; }
const F = funcs();
r.post('/video_visit', h(F.video_visit));
r.post('/ehr_message', h(F.ehr_message));
r.post('/patient_portal', h(F.patient_portal));
r.post('/app_remote', h(F.app_remote));
r.post('/remote_monitor', h(F.remote_monitor));
module.exports = r;