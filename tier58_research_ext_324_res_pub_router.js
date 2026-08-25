// filepath: tier58_research_ext_324_res_pub_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier58_research_ext_324_res_pub_engine');
const eps = ['manuscript_submission','peer_review_status','abstract_submission','poster_presentation','author_contribution'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
