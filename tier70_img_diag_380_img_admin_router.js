// filepath: tier70_img_diag_380_img_admin_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier70_img_diag_380_img_admin_engine');
const eps = ['image_ordering','scheduling_imaging','image_archive','image_share','image_quality_check'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
