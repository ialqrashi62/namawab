// filepath: tier5_oph_ext_105_pedi_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_oph_ext_105_pedi_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/scr', asyncH(async (req, res) => res.json(engine.funcs().screening(req.body))));
router.post('/amb', asyncH(async (req, res) => res.json(engine.funcs().amblyopia(req.body))));
router.post('/stra', asyncH(async (req, res) => res.json(engine.funcs().strabismus(req.body))));
router.post('/rb', asyncH(async (req, res) => res.json(engine.funcs().retinoblastoma(req.body))));
router.post('/cat', asyncH(async (req, res) => res.json(engine.funcs().cong_cataract(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().followup(req.body))));
module.exports = router;