// filepath: tier5_forensic_ext_103_work_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_forensic_ext_103_work_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/injury', asyncH(async (req, res) => res.json(engine.funcs().workplace_injury(req.body))));
router.post('/exposure', asyncH(async (req, res) => res.json(engine.funcs().occ_exposure(req.body))));
router.post('/transition', asyncH(async (req, res) => res.json(engine.funcs().return_to_duty(req.body))));
router.post('/discrim', asyncH(async (req, res) => res.json(engine.funcs().workplace_discrim(req.body))));
router.post('/employ', asyncH(async (req, res) => res.json(engine.funcs().employee_health(req.body))));

module.exports = router;
