// filepath: tier62_spec_care_ext_343_sp_geri_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier62_spec_care_ext_343_sp_geri_engine');
const eps = ['geriatric_assessment','polypharmacy_review','falls_clinic','delirium_screen','dementia_workup'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
