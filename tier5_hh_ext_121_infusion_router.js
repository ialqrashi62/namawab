// filepath: tier5_hh_ext_121_infusion_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_hh_ext_121_infusion_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/order', asyncH(async (req, res) => res.json(engine.funcs().infusion_order(req.body))));
router.post('/access', asyncH(async (req, res) => res.json(engine.funcs().vascular_access(req.body))));
router.post('/admin', asyncH(async (req, res) => res.json(engine.funcs().infusion_admin(req.body))));
router.post('/lab', asyncH(async (req, res) => res.json(engine.funcs().lab_drug(req.body))));
router.post('/adr', asyncH(async (req, res) => res.json(engine.funcs().adr(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().infusion_fu(req.body))));
module.exports = router;
