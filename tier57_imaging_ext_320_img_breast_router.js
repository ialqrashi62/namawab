// filepath: tier57_imaging_ext_320_img_breast_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier57_imaging_ext_320_img_breast_engine');
const eps = ['mammography_diagnostic','breast_mri','breast_ultrasound','breast_biopsy_stereo','breast_ductogram'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
