// filepath: tier67_surg_periop_364_surg_intraop_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier67_surg_periop_364_surg_intraop_engine');
const eps = ['operative_note','timed_out','time_out','positioning','anesthesia_record'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
