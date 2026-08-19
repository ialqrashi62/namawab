// filepath: tier80_ent_ext_426_ent_head_neck_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier80_ent_ext_426_ent_head_neck_engine');
const eps = ['thyroid_nodule','thyroidectomy','neck_mass','salivary_gland','head_neck_cancer'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
