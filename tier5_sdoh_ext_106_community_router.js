// filepath: tier5_sdoh_ext_106_community_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_sdoh_ext_106_community_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/match', asyncH(async (req, res) => res.json(engine.funcs().resource_match(req.body))));
router.post('/make', asyncH(async (req, res) => res.json(engine.funcs().make_referral(req.body))));
router.post('/track', asyncH(async (req, res) => res.json(engine.funcs().track_referral(req.body))));
router.post('/privacy', asyncH(async (req, res) => res.json(engine.funcs().privacy_consent(req.body))));
router.post('/handoff', asyncH(async (req, res) => res.json(engine.funcs().warm_handoff(req.body))));

module.exports = router;
