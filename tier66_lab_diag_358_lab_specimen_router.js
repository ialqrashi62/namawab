// filepath: tier66_lab_diag_358_lab_specimen_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier66_lab_diag_358_lab_specimen_engine');
const eps = ['specimen_collection','specimen_tracking','chain_of_custody','specimen_storage','specimen_disposal'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
