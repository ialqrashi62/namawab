// filepath: tier76_endo_ext_407_endo_special_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier76_endo_ext_407_endo_special_engine');
const eps = ['bone_metabolic','osteoporosis','calcium_disorder','lipid_specialist','pc_os'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
