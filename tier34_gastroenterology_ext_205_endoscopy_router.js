// filepath: tier34_gastroenterology_ext_205_endoscopy_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier34_gastroenterology_ext_205_endoscopy_engine');
const eps = ['egd_findings','colonoscopy_quality','ercp','eus_evaluation','endoscopic_bleeding'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
