'use strict';
const express = require('express');
const router = express.Router();
const Engine = require('./obgyn_engine');

const authenticate = (req, res, next) => {
  if (!req.headers.authorization) return res.status(401).json({ error: 'missing auth' });
  next();
};

router.post('/records', authenticate, (req, res) => {
  const id = require('crypto').randomUUID();
  res.status(201).json({ id, tenantId: req.body.tenantId, ...req.body, status: 'created' });
});

router.get('/records', authenticate, async (_req, res) => { res.json([]); });

router.get('/records/:id', authenticate, async (req, res) => {
  res.json({ id: req.params.id, record: { id: req.params.id } });
});

router.get('/decision/bishop', authenticate, (req, res) => {
  res.json({ decision: 'bishop', module: 'obgyn' });
});

module.exports = router;
