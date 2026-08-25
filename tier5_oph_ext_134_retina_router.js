// filepath: tier5_oph_ext_134_retina_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_oph_ext_134_retina_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/screen', asyncH(async (req, res) => res.json(engine.funcs().screening(req.body))));
router.post('/amd', asyncH(async (req, res) => res.json(engine.funcs().amd(req.body))));
router.post('/antivegf', asyncH(async (req, res) => res.json(engine.funcs().anti_vegf(req.body))));
router.post('/rd', asyncH(async (req, res) => res.json(engine.funcs().rd(req.body))));
router.post('/laser', asyncH(async (req, res) => res.json(engine.funcs().laser(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().retina_fu(req.body))));
module.exports = router;
