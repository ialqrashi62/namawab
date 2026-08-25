'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_paediatric_103_newbornexam_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/exam', asyncH((req, res) => res.json(engine.newbornExam(req.body))));
router.post('/hip', asyncH((req, res) => res.json(engine.newbornHipScreening(req.body))));
module.exports = router;