// filepath: tier50_cardiology_ext_286_card_ischemic_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier50_cardiology_ext_286_card_ischemic_engine');
const eps = ['stemi','nstemi_acs','unstable_angina','stable_angina','prinzmetal_angina'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
