// filepath: tier67_surg_periop_365_surg_postop_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier67_surg_periop_365_surg_postop_engine');
const eps = ['pacu_phase1','pacu_phase2','post_op_orders','discharge_recovery','post_op_followup'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
