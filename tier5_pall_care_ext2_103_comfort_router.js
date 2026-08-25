// filepath: tier5_pall_care_ext2_103_comfort_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pall_care_ext2_103_comfort_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/ord', asyncH(async (req, res) => res.json(engine.funcs().comfort_order(req.body))));
router.post('/op', asyncH(async (req, res) => res.json(engine.funcs().opioids(req.body))));
router.post('/agi', asyncH(async (req, res) => res.json(engine.funcs().agitation(req.body))));
router.post('/dys', asyncH(async (req, res) => res.json(engine.funcs().dyspnea(req.body))));
router.post('/td', asyncH(async (req, res) => res.json(engine.funcs().delirium_terminal(req.body))));
router.post('/np', asyncH(async (req, res) => res.json(engine.funcs().non_pharm(req.body))));
module.exports = router;
