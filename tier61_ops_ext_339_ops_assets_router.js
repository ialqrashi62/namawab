// filepath: tier61_ops_ext_339_ops_assets_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier61_ops_ext_339_ops_assets_engine');
const eps = ['asset_inventory','asset_depreciation','asset_disposal','asset_audit','asset_maintenance'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
