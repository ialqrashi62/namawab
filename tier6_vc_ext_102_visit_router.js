// filepath: tier6_vc_ext_102_visit_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier6_vc_ext_102_visit_engine');

function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }

const eps = ['visit_schedule','visit_room','visit_recording','visit_eprescribe','visit_follow_up'];
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});

module.exports = router;