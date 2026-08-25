// filepath: tier5_oph_ext_136_pedi_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_oph_ext_136_pedi_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/redeye', asyncH(async (req, res) => res.json(engine.funcs().red_eye(req.body))));
router.post('/strab', asyncH(async (req, res) => res.json(engine.funcs().strabismus(req.body))));
router.post('/amblyopia', asyncH(async (req, res) => res.json(engine.funcs().amblyopia(req.body))));
router.post('/rop', asyncH(async (req, res) => res.json(engine.funcs().rop(req.body))));
router.post('/exam_ae', asyncH(async (req, res) => res.json(engine.funcs().exam_anest(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().pedi_fu(req.body))));
module.exports = router;
