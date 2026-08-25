// filepath: tier38_dermatology_ext_226_acne_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier38_dermatology_ext_226_acne_engine');
const eps = ['acne_severity','acne_topical','acne_systemic','isotretinoin','acne_scar'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
