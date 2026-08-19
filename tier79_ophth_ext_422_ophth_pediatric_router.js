// filepath: tier79_ophth_ext_422_ophth_pediatric_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier79_ophth_ext_422_ophth_pediatric_engine');
const eps = ['pediatric_exam','amblyopia','strabismus','retinopathy_prematurity','pediatric_cataract'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
