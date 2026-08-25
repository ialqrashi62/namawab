// filepath: tier40_ophthalmology_ext_237_neuro_ophth_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier40_ophthalmology_ext_237_neuro_ophth_engine');
const eps = ['optic_neuritis','papilledema','visual_field_defect','double_vision','anterior_ischemic_optic_neuropathy'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
