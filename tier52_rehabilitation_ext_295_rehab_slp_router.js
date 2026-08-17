// filepath: tier52_rehabilitation_ext_295_rehab_slp_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier52_rehabilitation_ext_295_rehab_slp_engine');
const eps = ['dysphagia_swallow','aphasia','apraxia_of_speech','voice_therapy','trach_speaking_valve'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
