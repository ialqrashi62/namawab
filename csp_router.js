// filepath: namaweb/csp_router.js
// CSP (Content Security Policy) configuration + enforce-mode toggle + report viewer.
// Owner-only operation.
'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// ============================================================
// GET /api/csp/current — view current CSP policy
// ============================================================
router.get('/current', requireAuth, requireTenantScope, requireRole('admin', 'owner'), (req, res) => {
    res.json({
        ok: true,
        mode: 'report-only', // ⚠️ per safety rail #8: CSP is report-only by default
        enforce_flag: process.env.CSP_ENFORCE === 'true',
        policy: {
            'default-src': "'self'",
            'script-src': "'self' 'unsafe-inline' https://cdn.jsdelivr.net",
            'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
            'font-src': "'self' https://fonts.gstatic.com data:",
            'img-src': "'self' data: blob: https://lh3.googleusercontent.com",
            'media-src': "'self' https://res.cloudinary.com",
            'connect-src': "'self'",
            'frame-ancestors': "'self'",
            'object-src': "'none'",
            'base-uri': "'self'",
            'report-uri': '/api/csp-report'
        },
        warning: 'Switching to enforce mode requires owner authorization + browser testing. Inline scripts may break.',
        timestamp: new Date().toISOString()
    });
});

// ============================================================
// POST /api/csp/enforce — toggle enforce mode (owner only, audit-logged)
// ============================================================
router.post('/enforce', requireAuth, requireTenantScope, requireRole('owner'), (req, res) => {
    try {
        const { enabled } = req.body;
        if (typeof enabled !== 'boolean') return res.status(400).json({ error: 'missing_enabled_boolean' });
        process.env.CSP_ENFORCE = enabled ? 'true' : 'false';
        // Audit log
        console.log(`[CSP_AUDIT] tenant=${req.tenantId} user=${req.userId} enforce=${enabled} at=${new Date().toISOString()}`);
        res.json({
            ok: true,
            enforce_mode: enabled,
            requires_restart: true,
            next_steps: enabled
                ? 'PM2 restart required. Inline scripts may break. Test all flows thoroughly before keeping enforced.'
                : 'CSP back to report-only mode. Restart recommended.',
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('POST /api/csp/enforce', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// POST /api/csp-report — receive CSP violation reports from browsers
// ============================================================
router.post('/report', express.json({ type: '*/*' }), (req, res) => {
    try {
        const report = req.body['csp-report'] || req.body;
        console.warn('[CSP_VIOLATION]', JSON.stringify(report).substring(0, 300));
        // Could persist to a csp_violations table — minimal for now
        res.status(204).end();
    } catch (e) {
        res.status(204).end();
    }
});

// ============================================================
// GET /api/csp/violations — read recent violations from log file
// ============================================================
router.get('/violations', requireAuth, requireTenantScope, requireRole('admin', 'owner'), (req, res) => {
    try {
        const logPath = '/var/log/nama-csp-violations.log';
        let lines = [];
        try {
            const content = fs.readFileSync(logPath, 'utf8');
            lines = content.split('\n').filter(Boolean).slice(-50);
        } catch (e) {
            lines = ['(no log file yet — violations logged to PM2 stdout)'];
        }
        res.json({ ok: true, total: lines.length, recent: lines });
    } catch (err) {
        console.error('GET /api/csp/violations', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', mode: process.env.CSP_ENFORCE === 'true' ? 'enforce' : 'report-only', timestamp: new Date().toISOString() });
});

module.exports = router;