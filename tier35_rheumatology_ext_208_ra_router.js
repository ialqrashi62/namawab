// filepath: tier35_rheumatology_ext_208_ra_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier35_rheumatology_ext_208_ra_engine');
const eps = ['ra_classification','ra_disease_activity','ra_dmards','ra_biologic','ra_joint_protection'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
