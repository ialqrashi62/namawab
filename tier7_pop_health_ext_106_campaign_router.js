// filepath: tier7_pop_health_ext_106_campaign_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier7_pop_health_ext_106_campaign_engine');
const eps = ['campaign_design','campaign_message','campaign_send','campaign_measure','campaign_learn'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
