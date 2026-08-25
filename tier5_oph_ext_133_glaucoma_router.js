// filepath: tier5_oph_ext_133_glaucoma_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_oph_ext_133_glaucoma_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/screen', asyncH(async (req, res) => res.json(engine.funcs().screen(req.body))));
router.post('/diag', asyncH(async (req, res) => res.json(engine.funcs().diagnose(req.body))));
router.post('/med', asyncH(async (req, res) => res.json(engine.funcs().med(req.body))));
router.post('/laser', asyncH(async (req, res) => res.json(engine.funcs().laser(req.body))));
router.post('/surgery', asyncH(async (req, res) => res.json(engine.funcs().surgery(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().glaucoma_fu(req.body))));
module.exports = router;
