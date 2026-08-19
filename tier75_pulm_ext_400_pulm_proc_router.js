// filepath: tier75_pulm_ext_400_pulm_proc_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier75_pulm_ext_400_pulm_proc_engine');
const eps = ['bronchoscopy','thoracentesis','chest_tube_placement','endobronchial_ultrasound','pleuroscopy'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
