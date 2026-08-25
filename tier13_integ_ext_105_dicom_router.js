// filepath: tier13_integ_ext_105_dicom_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier13_integ_ext_105_dicom_engine');
const eps = ['dicom_c_store','dicom_c_find','dicom_wado','dicom_mwl','dicom_sr_evaluate'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
