// filepath: tier56_surgical_specialties_317_surg_thoracic_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier56_surgical_specialties_317_surg_thoracic_engine');
const eps = ['lobectomy_lung','pneumonectomy','wedge_resection','mediastinoscopy','esophagectomy'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
