// filepath: tier50_cardiology_ext_287_card_cong_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier50_cardiology_ext_287_card_cong_engine');
const eps = ['atrial_septal_defect','ventricular_septal_defect','patent_ductus','coarctation_aorta','tetralogy'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
