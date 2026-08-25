// filepath: tier12_emr_ext_104_voice_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier12_emr_ext_104_voice_engine');
const eps = ['voice_capture','voice_transcribe','voice_ambient_summary','voice_phi_redact','voice_to_note'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
