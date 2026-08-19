// filepath: tier73_cardio_ext_384_cardio_imaging_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier73_cardio_ext_384_cardio_imaging_engine');
const eps = ['echo_complete','stress_echo','stress_nuclear','ct_angiography_coronary','cardiac_mri'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
