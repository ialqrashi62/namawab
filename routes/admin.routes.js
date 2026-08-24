const crypto = require('crypto');
const fs = require('fs');
const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeAdminRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, canViewAdminAuditTrail, optionalReadFallback }) {
    const router = express.Router();
router.get('/api/admin/audit-log', requireAuth, async (req, res) => {

  try {

    const user = req.session.user;

    if (!canViewAdminAuditTrail(user)) return res.status(403).json({ error: 'Forbidden' });

    const { search, module: mod, from } = req.query;

    const conditions = [];

    const params = [];

    let idx = 1;

    if (search) { conditions.push(`(action ILIKE $${idx} OR module ILIKE $${idx} OR user_name ILIKE $${idx} OR details ILIKE $${idx})`); params.push('%' + search + '%'); idx++; }

    if (mod) { conditions.push(`module=$${idx}`); params.push(mod); idx++; }

    if (from) { conditions.push(`created_at>=$${idx}`); params.push(new Date(from)); idx++; }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const rows = (await pool.query(

      `SELECT id, user_id, user_name, action, module, details, ip_address AS ip, created_at FROM audit_trail ${where} ORDER BY created_at DESC LIMIT 500`,

      params

    )).rows;

    res.json(rows);

  } catch (e) {

    if (optionalReadFallback(res, e)) return;

    console.error('[AUDIT-LOG GET]', e.message); res.status(500).json({ error: 'Server error' });

  }

});

router.get('/api/admin/audit-trail/modules', requireAuth, async (req, res) => {

    try {

        if (!canViewAdminAuditTrail(req.session.user)) return res.status(403).json({ error: 'Forbidden' });

        const rows = (await pool.query('SELECT DISTINCT module FROM audit_trail WHERE module IS NOT NULL AND module <> $1 ORDER BY module LIMIT 100', [''])).rows;

        res.json(rows.map(r => r.module));

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/admin/audit-trail', requireAuth, async (req, res) => {

    try {

        if (!canViewAdminAuditTrail(req.session.user)) return res.status(403).json({ error: 'Forbidden' });

        const { module, action, limit: lim } = req.query;

        let query = 'SELECT * FROM audit_trail';

        const conds = [], params = [];

        if (module) { conds.push('module=$' + (params.length + 1)); params.push(module); }

        if (action) { conds.push('action=$' + (params.length + 1)); params.push(action); }

        if (conds.length) query += ' WHERE ' + conds.join(' AND ');

        query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);

        params.push(parseInt(lim) || 100);

        res.json((await pool.query(query, params)).rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/admin/backup-info', requireAuth, async (req, res) => {

    try {

        if (req.session.user?.role !== 'Admin') return res.status(403).json({ error: 'Admin only' });

        const tables = (await pool.query("SELECT tablename, pg_total_relation_size(quote_ident(tablename)) as size FROM pg_tables WHERE schemaname='public' ORDER BY size DESC")).rows;

        const dbSize = (await pool.query("SELECT pg_database_size(current_database()) as size")).rows[0];

        res.json({

            database: process.env.DB_NAME || 'nama_medical_web',

            totalSize: dbSize.size,

            totalSizeMB: (dbSize.size / 1024 / 1024).toFixed(2),

            tables: tables.map(t => ({ name: t.tablename, sizeMB: (t.size / 1024 / 1024).toFixed(2) })),

            backupCommand: 'pg_dump -U ' + (process.env.DB_USER || 'postgres') + ' -h ' + (process.env.DB_HOST || 'localhost') + ' ' + (process.env.DB_NAME || 'nama_medical_web') + ' > backup.sql'

        });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/admin/backup', requireAuth, async (req, res) => {

    try {

        if (req.session.user?.role !== 'Admin') return res.status(403).json({ error: 'Admin only' });



        const { spawnSync } = require('child_process');

        const crypto = require('crypto');

        const zlib = require('zlib');

        const fs = require('fs');

        const pathMod = require('path');



        // FAIL-CLOSED: never write a PLAINTEXT PHI database dump. An encryption key is REQUIRED.

        const keyMaterial = process.env.BACKUP_ENCRYPTION_KEY;

        if (!keyMaterial || String(keyMaterial).length < 16) {

            return res.status(400).json({ error: 'BACKUP_ENCRYPTION_KEY (>=16 chars) must be set; refusing to write an unencrypted PHI backup', code: 'BACKUP_KEY_REQUIRED' });

        }



        const backupDir = pathMod.join(__dirname, 'backups');

        if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);

        const filename = 'nama_backup_' + timestamp + '.sql.gz.enc';

        const filepath = pathMod.join(backupDir, filename);



        // Build pg_dump args from env (NO shell, NO hardcoded credentials). Prefer DATABASE_URL; else

        // assemble from DB_* and pass the password via PGPASSWORD env (never on the command line).

        const env = Object.assign({}, process.env);

        let dumpArgs;

        if (process.env.DATABASE_URL) {

            dumpArgs = [process.env.DATABASE_URL];

        } else {

            if (!process.env.DB_PASSWORD) {

                return res.status(400).json({ error: 'DATABASE_URL or DB_PASSWORD must be set for backup', code: 'BACKUP_DB_CREDS_REQUIRED' });

            }

            dumpArgs = ['-h', process.env.DB_HOST || 'localhost', '-p', String(process.env.DB_PORT || 5432),

                '-U', process.env.DB_USER || 'postgres', process.env.DB_NAME || 'nama_medical_web'];

            env.PGPASSWORD = process.env.DB_PASSWORD;

        }



        const dump = spawnSync('pg_dump', dumpArgs, { timeout: 120000, maxBuffer: 512 * 1024 * 1024, env });

        if (dump.status !== 0 || !dump.stdout) {

            return res.status(500).json({ error: 'pg_dump failed' });

        }



        // gzip then AES-256-GCM. On-disk layout = [salt(16)][iv(12)][authTag(16)][ciphertext].

        const gz = zlib.gzipSync(dump.stdout);

        const salt = crypto.randomBytes(16);

        const iv = crypto.randomBytes(12);

        const key = crypto.scryptSync(String(keyMaterial), salt, 32);

        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

        const enc = Buffer.concat([cipher.update(gz), cipher.final()]);

        const tag = cipher.getAuthTag();

        fs.writeFileSync(filepath, Buffer.concat([salt, iv, tag, enc]));



        logAudit(req.session.user.id, req.session.user.display_name, 'DATABASE_BACKUP', 'Admin', filename + ' (encrypted)', req.ip);



        res.download(filepath, filename, (err) => {

            if (err && !res.headersSent) res.status(500).json({ error: 'Download failed' });

        });

    } catch (e) { console.error(e); res.status(500).json({ error: 'Backup failed: ' + e.message }); }

});

router.get('/api/admin/backups', requireAuth, async (req, res) => {

    try {

        if (req.session.user?.role !== 'Admin') return res.status(403).json({ error: 'Admin only' });

        const backupDir = require('path').join(__dirname, 'backups');

        if (!require('fs').existsSync(backupDir)) return res.json([]);

        const files = require('fs').readdirSync(backupDir).filter(f => f.endsWith('.sql') || f.endsWith('.enc')).map(f => {

            const stat = require('fs').statSync(require('path').join(backupDir, f));

            return { name: f, size: (stat.size / 1024 / 1024).toFixed(2) + ' MB', date: stat.mtime };

        }).sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json(files);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
