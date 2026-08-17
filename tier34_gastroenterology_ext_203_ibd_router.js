// filepath: tier34_gastroenterology_ext_203_ibd_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier34_gastroenterology_ext_203_ibd_engine');
const eps = ['ibd_classification','ibd_disease_activity','ibd_medication','ibd_surveillance','ibd_surgery'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
