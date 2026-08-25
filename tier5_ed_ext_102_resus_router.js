// filepath: tier5_ed_ext_102_resus_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ed_ext_102_resus_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/acls', asyncH(async (req, res) => res.json(engine.funcs().acls(req.body))));
router.post('/atls', asyncH(async (req, res) => res.json(engine.funcs().atls(req.body))));
router.post('/sepsis', asyncH(async (req, res) => res.json(engine.funcs().sepsis_bundle(req.body))));
router.post('/heme', asyncH(async (req, res) => res.json(engine.funcs().hemorrhage(req.body))));
router.post('/stroke', asyncH(async (req, res) => res.json(engine.funcs().stroke_alert(req.body))));
router.post('/ami', asyncH(async (req, res) => res.json(engine.funcs().ami_pathway(req.body))));

module.exports = router;
