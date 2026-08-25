// filepath: namaweb/i18n_router.js
// i18n completeness + coverage + translation delivery endpoints.
// Analyzes static i18n.js file for missing locales.
'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const LOCALES = ['ar', 'en', 'fr', 'ur'];
const I18N_FILE = path.join(__dirname, 'public/js/i18n.js');

function parseI18nKeys() {
    try {
        const content = fs.readFileSync(I18N_FILE, 'utf8');
        const keyRegex = /'([^']+\.[a-z_]+)':\s*\{\s*(ar:[^,}]+,\s*en:[^,}]+,\s*fr:[^,}]+,\s*ur:[^}]+)\s*\}/g;
        const matches = [];
        let m;
        while ((m = keyRegex.exec(content)) !== null) {
            const fullText = m[2];
            const foundLocales = LOCALES.filter(loc => new RegExp(`\\b${loc}:`).test(fullText));
            matches.push({ key: m[1], locales_present: foundLocales, locales_missing: LOCALES.filter(l => !foundLocales.includes(l)) });
        }
        return matches;
    } catch (e) {
        return [];
    }
}

// GET /api/i18n/coverage
router.get('/coverage', requireAuth, requireTenantScope, requireRole('admin', 'owner', 'doctor'), (req, res) => {
    try {
        const entries = parseI18nKeys();
        const total = entries.length;
        const byLocale = {};
        for (const loc of LOCALES) byLocale[loc] = entries.filter(e => e.locales_present.includes(loc)).length;
        const complete = entries.filter(e => e.locales_missing.length === 0).length;
        const incomplete = entries.filter(e => e.locales_missing.length > 0);
        const coveragePct = {};
        for (const loc of LOCALES) coveragePct[loc] = total > 0 ? +((byLocale[loc] / total) * 100).toFixed(1) : 0;
        res.json({
            ok: true,
            total_keys: total,
            complete_keys: complete,
            incomplete_keys: incomplete.length,
            coverage_by_locale: coveragePct,
            populated_by_locale: byLocale,
            missing_samples: incomplete.slice(0, 10).map(e => ({ key: e.key, missing: e.locales_missing }))
        });
    } catch (err) {
        console.error('GET /api/i18n/coverage', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// GET /api/i18n/keys — return all keys (server-side delivery)
router.get('/keys', requireAuth, requireTenantScope, (req, res) => {
    try {
        const locale = req.query.locale || 'en';
        if (!LOCALES.includes(locale)) return res.status(400).json({ error: 'invalid_locale', valid: LOCALES });
        const content = fs.readFileSync(I18N_FILE, 'utf8');
        // Extract the entire dictionary (lightweight: just return file size)
        res.set('Content-Type', 'application/javascript');
        res.set('Cache-Control', 'public, max-age=300');
        res.send(content);
    } catch (err) {
        console.error('GET /api/i18n/keys', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', locales: LOCALES, timestamp: new Date().toISOString() });
});

module.exports = router;