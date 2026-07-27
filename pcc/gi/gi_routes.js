'use strict';
const express = require('express');
const router = express.Router();
const Engine = require('./gi_engine');

const authenticate = (req, res, next) => {
  if (!req.headers.authorization) return res.status(401).json({ error: 'missing auth' });
  next();
};

router.post('/admissions', authenticate, (req, res) => {
  const id = require('crypto').randomUUID();
  res.status(201).json({ id, tenantId: req.body.tenantId, ...req.body, status: 'admitted' });
});

router.get('/admissions', authenticate, async (_req, res) => { res.json([]); });

router.get('/admissions/:id', authenticate, async (req, res) => {
  res.json({ id: req.params.id, admission: { id: req.params.id } });
});

router.post('/admissions/:id/vitals', authenticate, (req, res) => {
  res.status(201).json({ id: require('crypto').randomUUID(), admissionId: req.params.id });
});

router.get('/decision/child-pugh', authenticate, (req, res) => {
  res.json({ decision: 'child-pugh', module: 'gi' });
});

module.exports = router;
