const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeCspReportRouter({ cspReportLimiter }) {
    const router = express.Router();
router.post('/api/csp-report',

    cspReportLimiter,

    express.json({ type: ['application/csp-report', 'application/reports+json', 'application/json'], limit: '16kb' }),

    (req, res) => {

        try {

            const r = (req.body && (req.body['csp-report'] || req.body)) || {};

            const summary = {

                doc: String(r['document-uri'] || r.documentURL || '').slice(0, 200),

                directive: String(r['violated-directive'] || r['effective-directive'] || r.effectiveDirective || '').slice(0, 120),

                blocked: String(r['blocked-uri'] || r.blockedURL || '').slice(0, 200)

            };

            console.warn('[CSP-REPORT]', JSON.stringify(summary));

        } catch (e) { /* ignore malformed report */ }

        res.status(204).end();

    });


    return router;
}
