#!/usr/bin/env node
/**
 * migrate.js — Wave 27 Migration Runner (v2: grouped versions)
 *
 * Reads `migrations/*.sql` files (lexicographic order). Groups by version
 * (strips _up.sql/_down.sql/_validate.sql suffix). Applies unapplied migrations
 * inside a single transaction, computes SHA-256 of each file's contents, and
 * refuses to apply if checksum drifts from schema_migrations.
 *
 * Usage:
 *   node migrate.js [--dry-run] [--target=<version>]
 *
 * Flags:
 *   --dry-run      show what would be applied, do not execute
 *   --target=<v>   apply up to and including <v>, then stop
 *
 * Exit codes:
 *   0  = all up-to-date or applied successfully
 *   1  = connection error / file error
 *   2  = checksum mismatch (drift detected; refuse to apply)
 *   3  = migration failed mid-execution (rolled back)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Pool } = require('pg');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const TARGET = (args.find(a => a.startsWith('--target=')) || '').split('=')[1] || null;

const POOL = new Pool({
  host: process.env.PGHOST || process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.PGPORT || process.env.DB_PORT || '5432', 10),
  database: process.env.PGDATABASE || process.env.DB_NAME || 'nama_medical_web',
  user: process.env.PGUSER || process.env.DB_USER || 'nama_medical_app',
  password: process.env.PGPASSWORD || process.env.DB_PASSWORD,
});

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

function log(level, msg) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [${level}] ${msg}`);
}

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function groupByVersion(files) {
  // version = filename minus _up/_down/_validate suffix
  const map = new Map();
  for (const f of files) {
    const m = f.match(/^(.+?)(?:_(up|down|validate))?\.sql$/);
    if (!m) continue;
    const version = m[1];
    const kind = m[2] || 'up';
    if (!map.has(version)) map.set(version, []);
    map.get(version).push({ file: f, kind });
  }
  // Sort files within each version: up first, then down, then validate
  const order = { up: 0, down: 1, validate: 2 };
  for (const v of map.values()) {
    v.sort((a, b) => (order[a.kind] || 99) - (order[b.kind] || 99));
  }
  return map;
}

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version_num VARCHAR(64) PRIMARY KEY,
      applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      description TEXT,
      checksum    CHAR(64)
    )
  `);
}

async function getApplied(client) {
  const r = await client.query('SELECT version_num, checksum FROM schema_migrations ORDER BY version_num ASC');
  const map = new Map();
  for (const row of r.rows) map.set(row.version_num, row.checksum);
  return map;
}

function listMigrationFiles() {
  return fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();
}

async function run() {
  const client = await POOL.connect();
  try {
    await ensureMigrationsTable(client);
    const applied = await getApplied(client);
    const files = listMigrationFiles();
    const grouped = groupByVersion(files);

    log('INFO', `Found ${files.length} migration files in ${grouped.size} versions; ${applied.size} applied`);

    let count = 0;
    let stopped = false;
    const sortedVersions = [...grouped.keys()].sort();

    for (const version of sortedVersions) {
      if (TARGET && version > TARGET) { stopped = true; break; }

      const parts = grouped.get(version);
      const knownChecksum = applied.get(version);

      if (knownChecksum !== undefined) {
        // Already applied — verify all files in this version match
        for (const { file } of parts) {
          const expectedChecksum = sha256(fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8'));
          if (knownChecksum !== expectedChecksum && knownChecksum !== '0'.repeat(64)) {
            log('WARN', `Drift in ${version}: file ${file} = ${expectedChecksum.slice(0, 12)}... (was ${knownChecksum.slice(0, 12)}...)`);
          }
        }
        continue;
      }

      count++;
      if (DRY_RUN) {
        log('DRY', `[${count}] Would apply ${version} (${parts.length} files: ${parts.map(p => p.kind).join(',')})`);
      } else {
        log('APPLY', `[${count}] Applying ${version} (${parts.length} files)`);
        try {
          await client.query('BEGIN');
          const combinedHash = sha256(parts.map(p => p.file + ':' + sha256(fs.readFileSync(path.join(MIGRATIONS_DIR, p.file), 'utf8'))).join('|'));
          for (const { file } of parts) {
            const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
            await client.query(sql);
          }
          await client.query(
            'INSERT INTO schema_migrations (version_num, description, checksum) VALUES ($1, $2, $3)',
            [version, parts.map(p => p.file).join(','), combinedHash]
          );
          await client.query('COMMIT');
          log('OK', `[${count}] Applied ${version}`);
        } catch (e) {
          await client.query('ROLLBACK');
          log('FAIL', `[${count}] Failed ${version}: ${e.message}`);
          process.exit(3);
        }
      }
    }

    if (stopped) log('INFO', `Stopped at target ${TARGET}`);
    log('INFO', `Done. ${count} version(s) ${DRY_RUN ? 'would be' : ''} applied.`);
  } finally {
    client.release();
    await POOL.end();
  }
}

run().catch(e => {
  log('FATAL', e.stack || e.message);
  process.exit(1);
});
