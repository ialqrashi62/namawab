// filepath: tier30_hematology_ext_185_stem_cell_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier30_hematology_ext_185_stem_cell_engine');
const eps = ['mobilization','collection','processing','cryopreservation','engraftment'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
