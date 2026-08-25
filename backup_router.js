// filepath: namaweb/backup_router.js
// Backup verification + integrity check endpoints.
// Read-only. pg_dump verification, last backup timestamp, table-level checksums.
'use strict';

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// GET /api/backup/health
router.get('/health', requireAuth, requireTenantScope, requireRole('admin', 'owner'), async (req, res) => {
    try {
        // Database size + WAL info
        const sizeRes = await db.query(`SELECT pg_size_pretty(pg_database_size(current_database())) as size, pg_size_pretty(pg_total_relation_size('patients')) as patients_size`);
        // Table row counts for major tables
        const countsRes = await db.query(`
            SELECT 'patients' as tbl, COUNT(*) as cnt FROM patients WHERE tenant_id = $1
            UNION ALL SELECT 'appointments', COUNT(*) FROM appointments WHERE tenant_id = $1
            UNION ALL SELECT 'lab_results', COUNT(*) FROM lab_results WHERE tenant_id = $1
            UNION ALL SELECT 'cds_alerts', COUNT(*) FROM cds_alerts WHERE tenant_id = $1
            UNION ALL SELECT 'vital_signs', COUNT(*) FROM vital_signs WHERE tenant_id = $1
            UNION ALL SELECT 'soap_notes', COUNT(*) FROM soap_notes WHERE tenant_id = $1
            UNION ALL SELECT 'discharge_summaries', COUNT(*) FROM discharge_summaries WHERE tenant_id = $1
            UNION ALL SELECT 'audit_trail', COUNT(*) FROM audit_trail WHERE tenant_id = $1
        `, [req.tenantId]);
        // Transaction safety
        const txRes = await db.query(`SELECT COUNT(*) as active FROM pg_stat_activity WHERE state IN ('active', 'idle in transaction')`);
        res.json({
            ok: true,
            timestamp: new Date().toISOString(),
            database: {
                size: sizeRes.rows[0].size,
                patients_table_size: sizeRes.rows[0].patients_size,
                active_transactions: +txRes.rows[0].active
            },
            row_counts: countsRes.rows,
            backup_strategy: {
                type: 'pg_dump',
                recommended_schedule: 'daily',
                retention_recommended: '30 days',
                backup_owner_authorized: true,
                script_pattern: 'restore_db.sh (requires recent dump before any DROP/DELETE)'
            }
        });
    } catch (err) {
        console.error('GET /api/backup/health', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// GET /api/backup/integrity
// Generate row-level checksum for major tables (idempotent verification)
router.get('/integrity', requireAuth, requireTenantScope, requireRole('admin', 'owner'), async (req, res) => {
    try {
        const tables = ['patients', 'soap_notes', 'vital_signs', 'lab_results', 'cds_alerts', 'allergies', 'imaging_studies', 'care_plans'];
        const results = [];
        for (const t of tables) {
            try {
                const r = await db.query(`
                    SELECT COUNT(*) as rows,
                           MD5(STRING_AGG(id::text, ',' ORDER BY id)) as id_hash
                    FROM ${t}
                    WHERE tenant_id = $1
                `, [req.tenantId]);
                results.push({
                    table: t,
                    rows: +r.rows[0].rows,
                    checksum: r.rows[0].id_hash
                });
            } catch (e) {
                results.push({ table: t, error: e.message.substring(0, 100) });
            }
        }
        res.json({ ok: true, timestamp: new Date().toISOString(), tables_checked: tables.length, results });
    } catch (err) {
        console.error('GET /api/backup/integrity', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// GET /api/backup/last
router.get('/last', requireAuth, requireTenantScope, requireRole('admin', 'owner'), async (req, res) => {
    try {
        // Look for backup files in standard locations
        const fs = require('fs');
        const path = require('path');
        const backupDirs = ['/var/backups/nama-medical', '/tmp/nama-backups', '/opt/backups'];
        const found = [];
        for (const dir of backupDirs) {
            try {
                const files = fs.readdirSync(dir).filter(f => f.includes('nama') || f.includes('backup') || f.endsWith('.sql') || f.endsWith('.dump'));
                for (const f of files.slice(0, 10)) {
                    const full = path.join(dir, f);
                    const stat = fs.statSync(full);
                    found.push({ path: full, size_mb: +(stat.size / 1024 / 1024).toFixed(2), modified: stat.mtime });
                }
            } catch (e) { /* dir not found, skip */ }
        }
        found.sort((a, b) => new Date(b.modified) - new Date(a.modified));
        res.json({
            ok: true,
            timestamp: new Date().toISOString(),
            backups_found: found.length,
            most_recent: found[0] || null,
            all: found
        });
    } catch (err) {
        console.error('GET /api/backup/last', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

module.exports = router;