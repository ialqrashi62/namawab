// filepath: tier5_dental_ext_102_ortho_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_dental_ext_102_ortho_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/angle', asyncH(async (req, res) => res.json(engine.funcs().angle_class(req.body))));
router.post('/cross', asyncH(async (req, res) => res.json(engine.funcs().crossbite(req.body))));
router.post('/open', asyncH(async (req, res) => res.json(engine.funcs().openbite(req.body))));
router.post('/deep', asyncH(async (req, res) => res.json(engine.funcs().deepbite(req.body))));
router.post('/surg', asyncH(async (req, res) => res.json(engine.funcs().orthognathic(req.body))));
router.post('/retn', asyncH(async (req, res) => res.json(engine.funcs().retainer(req.body))));

module.exports = router;
