// filepath: tier5_oph_ext_132_cataract_router.js
const express = require('express');
const router = express.Router();
const engine = require('./tier5_oph_ext_132_cataract_engine');
const asyncH = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.post('/indication', asyncH(async (req, res) => res.json(engine.funcs().indication(req.body))));
router.post('/biometry', asyncH(async (req, res) => res.json(engine.funcs().biometry(req.body))));
router.post('/surgery', asyncH(async (req, res) => res.json(engine.funcs().surgery(req.body))));
router.post('/intraop', asyncH(async (req, res) => res.json(engine.funcs().intraop(req.body))));
router.post('/postop', asyncH(async (req, res) => res.json(engine.funcs().post_op(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().cataract_fu(req.body))));
module.exports = router;
