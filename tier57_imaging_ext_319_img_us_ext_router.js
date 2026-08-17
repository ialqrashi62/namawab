// filepath: tier57_imaging_ext_319_img_us_ext_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier57_imaging_ext_319_img_us_ext_engine');
const eps = ['us_musculoskeletal','us_thyroid','us_vascular_dvt','us_obstetric_advanced','us_contrast'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
