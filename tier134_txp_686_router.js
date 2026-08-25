const express = require('express');
const router = express.Router();
const { funcs } = require('./tier134_txp_686_engine');
const f = funcs();
function asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }
router.post('/donor_eval', asyncH((req, res) => { const r = f.donor_eval(req.body || {}); res.json({ ok: true, op: 'donor_eval', result: r }); }));
router.post('/recipient_list', asyncH((req, res) => { const r = f.recipient_list(req.body || {}); res.json({ ok: true, op: 'recipient_list', result: r }); }));
router.post('/immunosuppression', asyncH((req, res) => { const r = f.immunosuppression(req.body || {}); res.json({ ok: true, op: 'immunosuppression', result: r }); }));
router.post('/rejection_event', asyncH((req, res) => { const r = f.rejection_event(req.body || {}); res.json({ ok: true, op: 'rejection_event', result: r }); }));
router.post('/post_tx_followup', asyncH((req, res) => { const r = f.post_tx_followup(req.body || {}); res.json({ ok: true, op: 'post_tx_followup', result: r }); }));
module.exports = router;