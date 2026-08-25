// filepath: tier5_psych_ext_111_substance_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_psych_ext_111_substance_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/screen', asyncH(async (req, res) => res.json(engine.funcs().screen(req.body))));
router.post('/detox', asyncH(async (req, res) => res.json(engine.funcs().detox(req.body))));
router.post('/relapse_prev', asyncH(async (req, res) => res.json(engine.funcs().relapse_prev(req.body))));
router.post('/mat', asyncH(async (req, res) => res.json(engine.funcs().mat(req.body))));
router.post('/overdose_prev', asyncH(async (req, res) => res.json(engine.funcs().overdose_prev(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().substance_fu(req.body))));
module.exports = router;
