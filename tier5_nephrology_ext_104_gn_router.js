// filepath: tier5_nephrology_ext_104_gn_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_nephrology_ext_104_gn_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/pres', asyncH(async (req, res) => res.json(engine.funcs().presentation(req.body))));
router.post('/biop', asyncH(async (req, res) => res.json(engine.funcs().biopsy(req.body))));
router.post('/immu', asyncH(async (req, res) => res.json(engine.funcs().immunosuppression(req.body))));
router.post('/supp', asyncH(async (req, res) => res.json(engine.funcs().supportive(req.body))));
router.post('/mon', asyncH(async (req, res) => res.json(engine.funcs().monitoring(req.body))));
router.post('/tx', asyncH(async (req, res) => res.json(engine.funcs().transplant(req.body))));
module.exports = router;