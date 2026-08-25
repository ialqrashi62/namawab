// filepath: tier60_ai_brain_ext_335_ai_nlp_doc_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier60_ai_brain_ext_335_ai_nlp_doc_engine');
const eps = ['nlp_clinical_note','nlp_voice_to_text','nlp_code_suggestion','nlp_soap_auto','nlp_drug_extract'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
