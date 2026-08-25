// filepath: tier80_ent_ext_423_ent_general_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier80_ent_ext_423_ent_general_engine');
const eps = ['ent_clinic','audiometry','hearing_aid','cochlear_impl','ent_referral'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
