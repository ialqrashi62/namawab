// filepath: tier53_oncology_ext_301_onc_gu_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier53_oncology_ext_301_onc_gu_engine');
const eps = ['renal_cancer','bladder_cancer','prostate_cancer','testicular_cancer','ovarian_cancer'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
