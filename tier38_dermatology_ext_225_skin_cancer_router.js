// filepath: tier38_dermatology_ext_225_skin_cancer_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier38_dermatology_ext_225_skin_cancer_engine');
const eps = ['melanoma_staging','basal_cell','squamous_cell','actinic_keratosis','mohs_surgery'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
