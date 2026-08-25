// filepath: tier6_vc_ext_104_async_care_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier6_vc_ext_104_async_care_engine');
const eps = ['async_econsult','async_store_forward','async_photo_review','async_message_triage','async_second_opinion'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;