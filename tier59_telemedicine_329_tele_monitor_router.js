// filepath: tier59_telemedicine_329_tele_monitor_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier59_telemedicine_329_tele_monitor_engine');
const eps = ['remote_patient_monitoring','tele_vitals_tracking','wearable_data_review','chronic_disease_tele','tele_alert_response'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
