// filepath: tier5_pall_care_ext2_106_reassess_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pall_care_ext2_106_reassess_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/pain', asyncH(async (req, res) => res.json(engine.funcs().pain_reassess(req.body))));
router.post('/dys', asyncH(async (req, res) => res.json(engine.funcs().dyspnea_reassess(req.body))));
router.post('/del', asyncH(async (req, res) => res.json(engine.funcs().delirium_reassess(req.body))));
router.post('/nau', asyncH(async (req, res) => res.json(engine.funcs().nausea_reassess(req.body))));
router.post('/con', asyncH(async (req, res) => res.json(engine.funcs().constipation(req.body))));
router.post('/fat', asyncH(async (req, res) => res.json(engine.funcs().fatigue_reassess(req.body))));
module.exports = router;
