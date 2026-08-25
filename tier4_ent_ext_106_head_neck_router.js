'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_ent_ext_106_head_neck_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/neck', asyncH((req, res) => res.json(engine.neckMassWorkup(req.body))));
router.post('/tonsil', asyncH((req, res) => res.json(engine.tonsilCancerStaging(req.body))));
module.exports = router;