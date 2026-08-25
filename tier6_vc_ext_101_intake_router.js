// filepath: tier6_vc_ext_101_intake_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier6_vc_ext_101_intake_engine');

function asyncH(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

router.post('/intake_demographics', asyncH((req, res) => {
  try { res.json(funcs().intake_demographics(req.body || {})); }
  catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
}));
router.post('/intake_chief_complaint', asyncH((req, res) => {
  try { res.json(funcs().intake_chief_complaint(req.body || {})); }
  catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
}));
router.post('/intake_history', asyncH((req, res) => {
  try { res.json(funcs().intake_history(req.body || {})); }
  catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
}));
router.post('/intake_vitals_self_reported', asyncH((req, res) => {
  try { res.json(funcs().intake_vitals_self_reported(req.body || {})); }
  catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
}));
router.post('/intake_risk_stratification', asyncH((req, res) => {
  try { res.json(funcs().intake_risk_stratification(req.body || {})); }
  catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
}));

module.exports = router;