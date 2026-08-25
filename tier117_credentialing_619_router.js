const express = require('express');
const router = express.Router();
const { funcs } = require('./tier117_credentialing_619_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/privilege_request', asyncH((req, res) => { const r = f.privilege_request(req.body || {}); res.json({ ok: true, op: 'privilege_request', result: r }); }));
router.post('/privilege_renewal', asyncH((req, res) => { const r = f.privilege_renewal(req.body || {}); res.json({ ok: true, op: 'privilege_renewal', result: r }); }));
router.post('/peer_review', asyncH((req, res) => { const r = f.peer_review(req.body || {}); res.json({ ok: true, op: 'peer_review', result: r }); }));
router.post('/license_verification', asyncH((req, res) => { const r = f.license_verification(req.body || {}); res.json({ ok: true, op: 'license_verification', result: r }); }));
router.post('/credentialing_renewal', asyncH((req, res) => { const r = f.credentialing_renewal(req.body || {}); res.json({ ok: true, op: 'credentialing_renewal', result: r }); }));
module.exports = router;
