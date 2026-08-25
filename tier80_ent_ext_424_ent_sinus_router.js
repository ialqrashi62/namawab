// filepath: tier80_ent_ext_424_ent_sinus_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier80_ent_ext_424_ent_sinus_engine');
const eps = ['sinusitis_eval','sinus_surgery','allergic_rhinitis','epistaxis','nasal_endoscopy'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
