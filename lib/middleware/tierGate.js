// lib/middleware/tierGate.js — READY-TO-ENABLE auth gate for /tier* surface
// NOT wired by default. Enable: in server.js after express.json:
//   if (process.env.TIER_AUTH_REQUIRED === '1') app.use(require('./lib/middleware/tierGate')({ requireAuth }));
// Rationale: 731 tier routes currently unauthenticated (pre-existing pattern).
'use strict';
module.exports = function tierGate({ requireAuth }) {
  if (typeof requireAuth !== 'function') throw new Error('tierGate requires requireAuth middleware');
  return (req, res, next) => {
    if (!req.path.startsWith('/tier')) return next();
    return requireAuth(req, res, next);
  };
};
