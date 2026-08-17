// filepath: tier46_pharmacy_ext_267_pharm_special_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier46_pharmacy_ext_267_pharm_special_engine');
const eps = ['biologic_therapy','controlled_substance','compounding','investigational_drug','drug_shortage'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
