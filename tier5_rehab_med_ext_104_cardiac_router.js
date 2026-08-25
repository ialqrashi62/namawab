// filepath: tier5_rehab_med_ext_104_cardiac_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_rehab_med_ext_104_cardiac_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/risk', asyncH(async (req, res) => res.json(engine.funcs().risk(req.body))));
router.post('/ex', asyncH(async (req, res) => res.json(engine.funcs().exercise(req.body))));
router.post('/ph', asyncH(async (req, res) => res.json(engine.funcs().phases(req.body))));
router.post('/edu', asyncH(async (req, res) => res.json(engine.funcs().education(req.body))));
router.post('/sec', asyncH(async (req, res) => res.json(engine.funcs().secondary_prev(req.body))));
router.post('/psy', asyncH(async (req, res) => res.json(engine.funcs().psychosocial(req.body))));
module.exports = router;
