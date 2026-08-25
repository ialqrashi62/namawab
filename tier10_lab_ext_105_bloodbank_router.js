// filepath: tier10_lab_ext_105_bloodbank_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier10_lab_ext_105_bloodbank_engine');
const eps = ['bb_type_and_screen','bb_crossmatch','bb_transfusion_reaction','bb_donor_screen','bb_inventory'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
