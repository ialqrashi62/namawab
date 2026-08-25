// filepath: tier67_surg_periop_366_surg_complications_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier67_surg_periop_366_surg_complications_engine');
const eps = ['intraop_complication','postop_complication','readmission_30d','reoperation','ssi_tracking'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
