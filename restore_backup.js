#!/usr/bin/env node
/**
 * restore_backup.js — decrypt an encrypted Nama DB backup (.sql.gz.enc) produced by
 * POST /api/admin/backup back to a plaintext .sql file.
 *
 * On-disk layout written by the server: [salt(16)][iv(12)][authTag(16)][ciphertext]
 *   key = scrypt(BACKUP_ENCRYPTION_KEY, salt, 32);  cipher = AES-256-GCM over gzip(pg_dump output)
 *
 * Usage:
 *   BACKUP_ENCRYPTION_KEY=... node restore_backup.js <file.sql.gz.enc> [out.sql]
 * Then restore (review first!):
 *   psql "$DATABASE_URL" < out.sql        # or: psql -h .. -U .. -d .. -f out.sql
 *
 * This script ONLY decrypts; it never connects to or modifies any database.
 */
'use strict';
const fs = require('fs');
const crypto = require('crypto');
const zlib = require('zlib');

const keyMaterial = process.env.BACKUP_ENCRYPTION_KEY;
if (!keyMaterial) {
    console.error('ERROR: set BACKUP_ENCRYPTION_KEY (the same value used when the backup was created).');
    process.exit(1);
}
const inFile = process.argv[2];
if (!inFile) {
    console.error('Usage: BACKUP_ENCRYPTION_KEY=... node restore_backup.js <file.sql.gz.enc> [out.sql]');
    process.exit(1);
}
const outFile = process.argv[3] || inFile.replace(/\.gz\.enc$/i, '').replace(/\.enc$/i, '') || 'restored.sql';

let buf;
try { buf = fs.readFileSync(inFile); } catch (e) { console.error('Cannot read', inFile, '-', e.message); process.exit(1); }
if (buf.length < 44) { console.error('File too small / not a valid encrypted backup.'); process.exit(1); }

const salt = buf.subarray(0, 16);
const iv = buf.subarray(16, 28);
const tag = buf.subarray(28, 44);
const ct = buf.subarray(44);
try {
    const key = crypto.scryptSync(String(keyMaterial), salt, 32);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const gz = Buffer.concat([decipher.update(ct), decipher.final()]); // throws if key wrong / tampered
    const sql = zlib.gunzipSync(gz);
    fs.writeFileSync(outFile, sql);
    console.log('Decrypted ->', outFile, '(' + sql.length + ' bytes).');
    console.log('Restore (review the SQL first): psql "$DATABASE_URL" < ' + outFile);
} catch (e) {
    console.error('Decryption FAILED (wrong key or corrupted/tampered file):', e.message);
    process.exit(1);
}
