// filepath: tier5_telehealth_ext_102_video_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_telehealth_ext_102_video_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/pre', asyncH(async (req, res) => res.json(engine.funcs().pre_visit(req.body))));
router.post('/conn', asyncH(async (req, res) => res.json(engine.funcs().connection(req.body))));
router.post('/ex', asyncH(async (req, res) => res.json(engine.funcs().exam(req.body))));
router.post('/rx', asyncH(async (req, res) => res.json(engine.funcs().prescribing(req.body))));
router.post('/rem', asyncH(async (req, res) => res.json(engine.funcs().reminders(req.body))));
router.post('/after', asyncH(async (req, res) => res.json(engine.funcs().after(req.body))));
module.exports = router;
