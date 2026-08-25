// filepath: tier5_pall_care_ext_106_goals_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pall_care_ext_106_goals_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/goc', asyncH(async (req, res) => res.json(engine.funcs().goals_care_discussion(req.body))));
router.post('/code', asyncH(async (req, res) => res.json(engine.funcs().code_status(req.body))));
router.post('/molst', asyncH(async (req, res) => res.json(engine.funcs().molst_polst(req.body))));
router.post('/proxy', asyncH(async (req, res) => res.json(engine.funcs().proxy_decision(req.body))));
router.post('/conflict', asyncH(async (req, res) => res.json(engine.funcs().conflict_resolution(req.body))));
router.post('/doc', asyncH(async (req, res) => res.json(engine.funcs().document_review(req.body))));
module.exports = router;
