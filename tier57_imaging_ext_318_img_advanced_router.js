// filepath: tier57_imaging_ext_318_img_advanced_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier57_imaging_ext_318_img_advanced_engine');
const eps = ['pet_ct','pet_mri','spect_ct','mr_spectroscopy','fusion_imaging'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
