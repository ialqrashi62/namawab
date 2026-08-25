'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_ob_delivery_105_postpartum_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/severity', asyncH((req, res) => res.json(engine.postpartumHemorrhageSeverity(req.body))));
router.post('/manage', asyncH((req, res) => res.json(engine.pphManagement(req.body))));
module.exports = router;