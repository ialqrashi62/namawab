// filepath: tier5_endoscopy_ext_106_ent_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_endoscopy_ext_106_ent_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/naso', asyncH(async (req, res) => res.json(engine.funcs().naso(req.body))));
router.post('/find', asyncH(async (req, res) => res.json(engine.funcs().findings(req.body))));
router.post('/l', asyncH(async (req, res) => res.json(engine.funcs().laryngo(req.body))));
router.post('/oto', asyncH(async (req, res) => res.json(engine.funcs().otoscope(req.body))));
router.post('/biop', asyncH(async (req, res) => res.json(engine.funcs().biopsy(req.body))));
router.post('/post', asyncH(async (req, res) => res.json(engine.funcs().post(req.body))));
module.exports = router;