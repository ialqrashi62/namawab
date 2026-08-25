// filepath: tier73_cardio_ext_383_cardio_ep_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier73_cardio_ext_383_cardio_ep_engine');
const eps = ['cardiac_cath','electrophysiology_study','ablation','device_implant','wearable_loop_recorder'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
