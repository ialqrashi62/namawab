// filepath: tier29_cardiology_ext_180_cath_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier29_cardiology_ext_180_cath_engine');
const eps = ['cath_plan','pci_outcome','tav','mitraclip','lad_revascularization'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
