// filepath: tier69_mh_377_mh_community_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier69_mh_377_mh_community_engine');
const eps = ['case_management','peer_support','community_resources_wraparound','supported_employment','school_link'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
