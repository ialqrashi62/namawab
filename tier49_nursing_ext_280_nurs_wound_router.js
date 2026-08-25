// filepath: tier49_nursing_ext_280_nurs_wound_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier49_nursing_ext_280_nurs_wound_engine');
const eps = ['wound_assessment','dressing_change','ostomy_care','trach_care','suctioning'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
