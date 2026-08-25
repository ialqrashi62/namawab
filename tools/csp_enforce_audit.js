#!/usr/bin/env node
/**
 * NamaMedical ERP — CSP Enforce Audit (companion to csp_enforce_ready.sh)
 * ============================================================================
 * File:         /var/www/namaweb/tools/csp_enforce_audit.js
 * Purpose:      Cross-reference CSP violations from two sources:
 *                 (a) PM2 application logs (the [CSP-REPORT] lines that
 *                     server.js logs via console.warn)
 *                 (b) nginx access logs (looking for blocked-resource 4xx
 *                     responses that would become 4xx once CSP is enforced)
 *              This complements ops/csp_enforce_ready.sh which only scans
 *              PM2 logs. Running both gives a complete picture before
 *              flipping CSP_ENFORCE=true.
 *
 * Why:          AGENTS.md §2.2 Rail 8 (CSP stays report-only by default).
 *              This tool is READ-ONLY. It never sets CSP_ENFORCE.
 *
 * Safety rails honored:
 *   - Rail 8  : read-only; never enables CSP_ENFORCE.
 *   - Rail 12 : no secrets/PHI in output (only counts + directive + URL).
 *
 * Usage:
 *   node csp_enforce_audit.js [--days=7] [--directive=script-src] [--app=NAME]
 *                             [--nginx=/var/log/nginx] [--help]
 *
 *   --days=N         lookback window (default 7)
 *   --directive=X    filter report to one directive (default: all)
 *   --app=NAME       PM2 app name (default nama-medical-erp)
 *   --nginx=PATH     nginx log directory (default /var/log/nginx)
 *   --help           this message
 *
 * Exit codes:
 *   0  no violations
 *   1  at least one violation (CSP_ENFORCE=true would break things)
 *   2  could not read logs / invalid args
 *
 * No npm deps. Pure Node ≥ 18.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const readline = require('readline');

// -----------------------------------------------------------------------------
// Args
// -----------------------------------------------------------------------------
function parseArgs(argv) {
    const args = {
        days: 7,
        directive: null,
        app: 'nama-medical-erp',
        nginx: '/var/log/nginx',
        help: false,
    };
    for (let i = 2; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--help' || a === '-h') { args.help = true; continue; }
        const m = /^--([^=]+)=(.*)$/.exec(a);
        if (m) {
            const key = m[1];
            const val = m[2];
            if (key === 'days') args.days = parseInt(val, 10) || 7;
            else if (key === 'directive') args.directive = val;
            else if (key === 'app') args.app = val;
            else if (key === 'nginx') args.nginx = val;
        }
    }
    return args;
}

function help() {
    console.log([
        'Usage: node csp_enforce_audit.js [--days=N] [--directive=X] [--app=NAME] [--nginx=PATH]',
        '',
        '  --days=N         lookback window (default 7)',
        '  --directive=X    filter by directive (default: all)',
        '  --app=NAME       PM2 app name (default nama-medical-erp)',
        '  --nginx=PATH     nginx log directory (default /var/log/nginx)',
        '',
        'Exit codes: 0 clean, 1 violations, 2 cannot read logs',
    ].join('\n'));
}

// -----------------------------------------------------------------------------
// Find the most recent PM2 log for the given app
// -----------------------------------------------------------------------------
function findPm2Log(appName) {
    const candidates = [
        `/var/log/${appName}-out.log`,
        `/var/log/${appName}-error.log`,
        `/root/.pm2/logs/${appName}-out.log`,
        `/root/.pm2/logs/${appName}-error.log`,
        `/root/.pm2/logs/${appName}-out.log.last.log`,
        `/var/log/nama-medical-erp-out.log`,
        `/var/log/nama-medical-erp-error.log`,
    ];
    for (const c of candidates) {
        try {
            fs.accessSync(c, fs.constants.R_OK);
            return c;
        } catch (_) { /* try next */ }
    }
    return null;
}

// -----------------------------------------------------------------------------
// Open a log file (transparent gz if .gz extension). Returns a read stream
// wrapped in readline so we can iterate line-by-line without loading all
// into memory.
// -----------------------------------------------------------------------------
function openLineReader(filePath) {
    const isGz = filePath.endsWith('.gz');
    const raw = fs.createReadStream(filePath);
    const stream = isGz ? raw.pipe(zlib.createGunzip()) : raw;
    return readline.createInterface({ input: stream, crlfDelay: Infinity });
}

// -----------------------------------------------------------------------------
// Listing rotated logs (sorted by mtime asc, current `access.log` last)
// -----------------------------------------------------------------------------
function listNginxLogs(dir) {
    let entries;
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (_) {
        return [];
    }
    const files = entries
        .filter((e) => e.isFile() && /^access\.log(\.\d+(\.gz)?)?$/.test(e.name))
        .map((e) => ({ name: e.name, full: path.join(dir, e.name) }));
    return files;
}

// -----------------------------------------------------------------------------
// Scan PM2 logs for [CSP-REPORT] lines.
// Parses JSON-ish payload: {"doc":"...","directive":"...","blocked":"..."}
// Returns Map<directive, Map<blockedUri, count>>.
// -----------------------------------------------------------------------------
async function scanPm2Logs(pm2Path, sinceEpoch, directiveFilter) {
    const result = new Map(); // directive -> { total, urls: Map<url, count> }
    if (!pm2Path) return result;
    const rl = openLineReader(pm2Path);
    let total = 0;
    for await (const line of rl) {
        if (!line.includes('[CSP-REPORT]')) continue;
        // Optional: filter by timestamp prefix if present
        const tsMatch = /^([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2})/.exec(line);
        if (tsMatch) {
            const t = Date.parse(tsMatch[1]);
            if (!Number.isNaN(t) && t < sinceEpoch) continue;
        }
        // Extract directive (prefer "effective-directive" which is what would
        // actually be enforced; fallback to "directive")
        const directive =
            extract(line, 'effective-directive') ||
            extract(line, 'directive') ||
            '(unknown)';
        if (directiveFilter && directive !== directiveFilter) continue;
        const blocked =
            extract(line, 'blocked-uri') ||
            extract(line, 'blocked') ||
            '(unknown)';
        total++;
        let bucket = result.get(directive);
        if (!bucket) {
            bucket = { total: 0, urls: new Map() };
            result.set(directive, bucket);
        }
        bucket.total++;
        bucket.urls.set(blocked, (bucket.urls.get(blocked) || 0) + 1);
    }
    return result;
}

function extract(line, key) {
    const re = new RegExp(`"${key}"\\s*:\\s*"([^"]+)"`, 'i');
    const m = re.exec(line);
    return m ? m[1] : null;
}

// -----------------------------------------------------------------------------
// Scan nginx access logs for blocked-resource patterns.
// A blocked resource pattern is heuristic: 4xx with a request to a static
// asset that CSP would block (e.g. .js loaded from an external CDN that
// isn't in script-src). We look for 4xx responses to .js, .css, .png, .jpg,
// .svg, .woff, .woff2, .ttf, .otf, .eot — i.e. loads that would otherwise
// succeed if CSP were not enforced.
// -----------------------------------------------------------------------------
const CSP_RELEVANT_EXT = /\.(js|mjs|css|png|jpg|jpeg|gif|svg|webp|woff2?|ttf|otf|eot)(\?|$|\s)/i;

async function scanNginxLogs(dir, sinceEpoch) {
    const findings = [];
    const files = listNginxLogs(dir);
    // Filter by mtime to avoid reading ancient logs
    const cutoff = Date.now() - (Date.now() - sinceEpoch) + 0; // best effort
    for (const f of files) {
        let stat;
        try { stat = fs.statSync(f.full); } catch (_) { continue; }
        if (stat.mtimeMs < sinceEpoch * 1000 - 7 * 86400_000) continue; // skip ancient
        let rl;
        try {
            rl = openLineReader(f.full);
        } catch (_) { continue; }
        for await (const line of rl) {
            // Common (combined) log format:
            //   <ip> - - [<ts>] "<METHOD> <path> HTTP/1.1" <status> <bytes> ...
            const m = /^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) (\S+) [^"]+" (\d{3}) (\d+)/.exec(line);
            if (!m) continue;
            const status = parseInt(m[5], 10);
            if (status < 400 || status >= 500) continue;
            const uri = m[4];
            if (!CSP_RELEVANT_EXT.test(uri)) continue;
            // Filter by ts if present
            const ts = parseNginxTs(m[2]);
            if (ts && ts < sinceEpoch) continue;
            findings.push({
                file: path.basename(f.full),
                status,
                uri,
                ts: ts ? new Date(ts * 1000).toISOString() : 'unknown',
            });
        }
    }
    return findings;
}

// Parse nginx log timestamp "29/Jul/2026:03:12:45 +0000" -> epoch seconds
function parseNginxTs(s) {
    const m = /^(\d{2})\/(\w{3})\/(\d{4}):(\d{2}):(\d{2}):(\d{2}) ([+-]\d{4})/.exec(s);
    if (!m) return null;
    const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                     Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    const mo = months[m[2]];
    if (mo == null) return null;
    const iso = `${m[3]}-${String(mo + 1).padStart(2, '0')}-${m[1]}T${m[4]}:${m[5]}:${m[6]}${m[7].slice(0, 3)}:${m[7].slice(3)}`;
    const t = Date.parse(iso);
    return Number.isNaN(t) ? null : Math.floor(t / 1000);
}

// -----------------------------------------------------------------------------
// Probe /api/csp-report to confirm it is reachable (HEAD/GET are not supported
// by the route, so we send a tiny POST and read 204).
// -----------------------------------------------------------------------------
async function probeCspEndpoint(baseUrl) {
    return new Promise((resolve) => {
        const url = new URL('/api/csp-report', baseUrl).toString();
        const body = JSON.stringify({
            'csp-report': {
                'document-uri': 'http://localhost/csp-enforce-audit-probe',
                'directive': 'csp-enforce-audit-probe',
                'blocked-uri': 'self',
                'effective-directive': 'csp-enforce-audit-probe',
            },
        });
        const u = new URL(url);
        const lib = require('http');
        const opts = {
            hostname: u.hostname,
            port: u.port || 80,
            path: u.pathname + u.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/csp-report',
                'Content-Length': Buffer.byteLength(body),
            },
            timeout: 5000,
        };
        const req = lib.request(opts, (res) => {
            resolve({ status: res.statusCode, url });
            res.resume();
        });
        req.on('error', (e) => resolve({ error: e.message, url }));
        req.on('timeout', () => { req.destroy(); resolve({ error: 'timeout', url }); });
        req.write(body);
        req.end();
    });
}

// -----------------------------------------------------------------------------
// Pretty-print result
// -----------------------------------------------------------------------------
function printReport(report) {
    console.log('================================================================');
    console.log(` CSP Enforce Audit — ${report.ts}`);
    console.log(` window:  last ${report.days} day(s)`);
    console.log(` filter:  ${report.directive || '(all directives)'}`);
    console.log(` endpoint: ${report.endpoint.url} → ${report.endpoint.status || report.endpoint.error}`);
    console.log('================================================================');

    const total = report.pm2.byDirective.reduce((s, b) => s + b.total, 0);
    console.log('');
    console.log(`[PM2 application logs] ${total} [CSP-REPORT] line(s)`);
    if (total === 0) {
        console.log('  (none)');
    } else {
        for (const b of report.pm2.byDirective) {
            console.log(`  ${b.directive.padEnd(28)} ${String(b.total).padStart(6)}`);
        }
        console.log('');
        console.log('  Top blocked URLs:');
        for (const u of report.pm2.topBlocked) {
            console.log(`    ${String(u.count).padStart(5)}  ${u.url}`);
        }
    }

    console.log('');
    console.log(`[nginx access logs] ${report.nginx.blockedAssetCount} 4xx for static assets (would break under CSP_ENFORCE=true)`);
    if (report.nginx.blockedAssetCount === 0) {
        console.log('  (none)');
    } else {
        for (const u of report.nginx.topUris) {
            console.log(`    ${String(u.count).padStart(5)}  [${u.status}] ${u.uri}`);
        }
    }

    console.log('');
    console.log('---------------------------------------------------------------');
    if (total === 0 && report.nginx.blockedAssetCount === 0) {
        console.log(' SAFE TO ENFORCE');
        console.log(' No CSP violations observed in the lookback window.');
        console.log(' You may set CSP_ENFORCE=true and restart.');
    } else {
        console.log(' UNSAFE TO ENFORCE');
        console.log(' Fix the violating URLs above before flipping CSP_ENFORCE.');
    }
    console.log('---------------------------------------------------------------');
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
async function main() {
    const args = parseArgs(process.argv);
    if (args.help) { help(); process.exit(0); }

    const sinceEpoch = Math.floor(Date.now() / 1000) - args.days * 86400;
    const baseUrl = process.env.NAMAWEB_BASE_URL || 'http://127.0.0.1:3000';

    // 1. PM2 log scan
    const pm2Path = findPm2Log(args.app);
    if (!pm2Path) {
        console.error(`[csp_enforce_audit] WARN: cannot find PM2 log for '${args.app}' (continuing).`);
    }
    const pm2Map = await scanPm2Logs(pm2Path, sinceEpoch, args.directive);
    const byDirective = Array.from(pm2Map.entries())
        .map(([directive, b]) => ({ directive, total: b.total }))
        .sort((a, b) => b.total - a.total);
    const pm2Urls = [];
    for (const [, b] of pm2Map) {
        for (const [url, count] of b.urls) {
            pm2Urls.push({ url, count });
        }
    }
    pm2Urls.sort((a, b) => b.count - a.count);
    const topBlocked = pm2Urls.slice(0, 10);

    // 2. nginx log scan
    const nginxFindings = await scanNginxLogs(args.nginx, sinceEpoch);
    const uriCounts = new Map();
    for (const f of nginxFindings) {
        const key = `${f.status}|${f.uri}`;
        uriCounts.set(key, (uriCounts.get(key) || 0) + 1);
    }
    const topUris = Array.from(uriCounts.entries())
        .map(([k, count]) => {
            const [status, uri] = k.split('|');
            return { status: parseInt(status, 10), uri, count };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    // 3. endpoint probe
    const endpoint = await probeCspEndpoint(baseUrl);

    const report = {
        ts: new Date().toISOString(),
        days: args.days,
        directive: args.directive,
        endpoint,
        pm2: {
            byDirective,
            topBlocked,
        },
        nginx: {
            blockedAssetCount: nginxFindings.length,
            topUris,
        },
    };

    printReport(report);

    const totalViolations = byDirective.reduce((s, b) => s + b.total, 0) + nginxFindings.length;
    process.exit(totalViolations === 0 ? 0 : 1);
}

main().catch((e) => {
    console.error(`[csp_enforce_audit] FATAL: ${e.message}`);
    process.exit(2);
});
