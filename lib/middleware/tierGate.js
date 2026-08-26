// lib/middleware/tierGate.js — READY-TO-ENABLE auth gate for /tier* surface
// Enable: set env TIER_AUTH_REQUIRED=1 and wire once after express.json+session:
//   if (process.env.TIER_AUTH_REQUIRED === '1') app.use(require('./lib/middleware/tierGate')());
// Accepts: authenticated session (req.session.user) OR x-api-key === TIER_API_KEY.
// Everything else under /tier → 401 JSON.
'use strict';
const crypto = require('crypto');

module.exports = function tierGate() {
  return (req, res, next) => {
    if (!req.path.startsWith('/tier')) return next();
    // 1) session user
    if (req.session && req.session.user && req.session.user.id) return next();
    // 2) integration API key
    const key = req.get('x-api-key');
    const expected = process.env.TIER_API_KEY;
    if (expected && key && key.length === expected.length &&
        crypto.timingSafeEqual(Buffer.from(key), Buffer.from(expected))) {
      return next();
    }
    return res.status(401).json({ ok: false, error: 'authentication required for tier endpoints' });
  };
};
