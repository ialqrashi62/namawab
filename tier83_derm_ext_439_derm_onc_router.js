// filepath: tier83_derm_ext_439_derm_onc_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier83_derm_ext_439_derm_onc_engine');
const eps = ['melanoma_eval','bcc_scc','lymphoma','keratinocyte','derm_chemo'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
