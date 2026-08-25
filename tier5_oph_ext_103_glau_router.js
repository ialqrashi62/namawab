// filepath: tier5_oph_ext_103_glau_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_oph_ext_103_glau_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/iop', asyncH(async (req, res) => res.json(engine.funcs().iop(req.body))));
router.post('/disc', asyncH(async (req, res) => res.json(engine.funcs().optic_disc(req.body))));
router.post('/vf', asyncH(async (req, res) => res.json(engine.funcs().visual_field(req.body))));
router.post('/med', asyncH(async (req, res) => res.json(engine.funcs().medication(req.body))));
router.post('/laser', asyncH(async (req, res) => res.json(engine.funcs().laser(req.body))));
router.post('/surg', asyncH(async (req, res) => res.json(engine.funcs().surgery(req.body))));
module.exports = router;