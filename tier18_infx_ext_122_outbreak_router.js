// filepath: tier18_infx_ext_122_outbreak_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier18_infx_ext_122_outbreak_engine');
const eps = ['outbreak_detect','outbreak_organism','outbreak_exposure','outbreak_response','outbreak_close'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
