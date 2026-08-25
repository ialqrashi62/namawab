// filepath: tier41_obstetrics_ext_239_fetal_mon_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier41_obstetrics_ext_239_fetal_mon_engine');
const eps = ['non_stress_test','biophysical_profile','amniotic_fluid_index','doppler_ultrasound','fetal_heart_rate'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
