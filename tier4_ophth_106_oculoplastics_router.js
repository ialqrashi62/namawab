'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_ophth_106_oculoplastics_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/ptosis', asyncH((req, res) => res.json(engine.ptosis(req.body))));
router.post('/laceration', asyncH((req, res) => res.json(engine.eyelidLaceration(req.body))));
module.exports = router;