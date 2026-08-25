// filepath: tier5_wound_ostomy_ext_104_burn_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_wound_ostomy_ext_104_burn_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/assess', asyncH(async (req, res) => res.json(engine.funcs().assessment(req.body))));
router.post('/resus', asyncH(async (req, res) => res.json(engine.funcs().resuscitation(req.body))));
router.post('/esch', asyncH(async (req, res) => res.json(engine.funcs().escharotomy(req.body))));
router.post('/dress', asyncH(async (req, res) => res.json(engine.funcs().dressing(req.body))));
router.post('/infect', asyncH(async (req, res) => res.json(engine.funcs().infection(req.body))));
router.post('/rehab', asyncH(async (req, res) => res.json(engine.funcs().rehabilitation(req.body))));
module.exports = router;
