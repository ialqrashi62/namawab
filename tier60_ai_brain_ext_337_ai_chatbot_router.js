// filepath: tier60_ai_brain_ext_337_ai_chatbot_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier60_ai_brain_ext_337_ai_chatbot_engine');
const eps = ['patient_chatbot_triage','patient_chatbot_followup','patient_chatbot_med_reminder','patient_chatbot_education','patient_chatbot_feedback'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
