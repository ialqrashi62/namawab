// filepath: tier88_gi_liver_466_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier88_gi_liver_466_engine');
const eps = ['hepatitis_clinic_gi','cirrhosis','liver_mass','liver_transplant','portal_htn'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
