// filepath: tier39_ent_ext_230_laryngology_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier39_ent_ext_230_laryngology_engine');
const eps = ['hoarseness','vocal_cord_nodules','subglottic_stenosis','laryngeal_cancer','tracheostomy_care'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
