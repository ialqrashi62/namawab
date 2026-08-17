// filepath: tier57_imaging_ext_321_img_msk_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier57_imaging_ext_321_img_msk_engine');
const eps = ['joint_mri','spine_imaging','bone_scan','three_tesla_mri','arthrogram_mri'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
