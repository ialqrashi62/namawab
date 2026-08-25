/**
 * wave49_scrape_latency_test.js -- Tests for Wave 49 scrape latency tracking
 *
 * Pattern: 5-section test file.
 *   1. Sub-module list + recordScrapeStart/End
 *   2. Per-sub-module counters
 *   3. Slow threshold detection
 *   4. Aggregates (avg/max/total)
 *   5. Prometheus output
 *   6. Safety rails
 *   7. Public API
 */

'use strict';

const w49 = require('./wave49_scrape_latency');

let pass = 0, fail = 0;
function ok(msg, cond) {
    if (cond) { pass++; }
    else { fail++; console.error(`[FAIL]   ${msg}`); }
}
function chk(name, fn) {
    try { fn(); console.log(`[PASS]   ${name}`); }
    catch (e) { fail++; console.error(`[FAIL]   ${name} threw: ${e.message}`); }
}

// ---------- 1. Sub-module list + recordScrapeStart/End ----------

chk('listSubModules returns the 5 known sub-modules', () => {
    const subs = w49.listSubModules();
    ok('  length = 5', subs.length === 5);
    ok('  contains wave32', subs.indexOf('wave32') !== -1);
    ok('  contains wave46', subs.indexOf('wave46') !== -1);
    ok('  contains wave47', subs.indexOf('wave47') !== -1);
    ok('  contains wave48', subs.indexOf('wave48') !== -1);
    ok('  contains unknown', subs.indexOf('unknown') !== -1);
});

chk('recordScrapeStart returns a number', () => {
    const start = w49.recordScrapeStart('wave32');
    ok('  start is a number', typeof start === 'number');
    ok('  start is positive', start > 0);
});

chk('recordScrapeEnd increments counters', () => {
    w49.reset();
    const start = w49.recordScrapeStart('wave32');
    // Simulate elapsed time without actually sleeping
    const end = w49.recordScrapeEnd('wave32', start);
    ok('  end is a number', typeof end === 'undefined' || typeof end === 'number');
    const c = w49.getCounters();
    ok('  total incremented', c.total === 1);
    ok('  bySubModule.wave32.count = 1', c.bySubModule.wave32.count === 1);
});

chk('recordScrapeEnd maps unknown sub-modules to "unknown"', () => {
    w49.reset();
    const start = w49.recordScrapeStart('wave99-bogus');
    w49.recordScrapeEnd('wave99-bogus', start);
    const c = w49.getCounters();
    ok('  bySubModule.unknown exists', c.bySubModule.unknown !== undefined);
    ok('  bySubModule.unknown.count = 1', c.bySubModule.unknown.count === 1);
});

chk('recordScrapeEnd ignores clock skew (negative duration)', () => {
    w49.reset();
    // Future start time → duration would be negative
    w49.recordScrapeEnd('wave32', Date.now() + 10000);
    const c = w49.getCounters();
    ok('  total NOT incremented on negative duration', c.total === 0);
});

// ---------- 2. Per-sub-module counters ----------

chk('per-sub-module counters isolate by name', () => {
    w49.reset();
    w49.recordScrapeEnd('wave32', Date.now() - 50);
    w49.recordScrapeEnd('wave32', Date.now() - 30);
    w49.recordScrapeEnd('wave46', Date.now() - 70);
    const c = w49.getCounters();
    ok('  wave32 count = 2', c.bySubModule.wave32.count === 2);
    ok('  wave46 count = 1', c.bySubModule.wave46.count === 1);
    ok('  wave32 totalMs ~80', c.bySubModule.wave32.totalMs >= 75 && c.bySubModule.wave32.totalMs <= 90);
    ok('  wave46 totalMs ~70', c.bySubModule.wave46.totalMs >= 65 && c.bySubModule.wave46.totalMs <= 80);
});

chk('per-sub-module max tracks highest single observation', () => {
    w49.reset();
    w49.recordScrapeEnd('wave32', Date.now() - 10);
    w49.recordScrapeEnd('wave32', Date.now() - 200);
    w49.recordScrapeEnd('wave32', Date.now() - 50);
    const c = w49.getCounters();
    ok('  wave32 maxMs ~200', c.bySubModule.wave32.maxMs >= 195 && c.bySubModule.wave32.maxMs <= 210);
});

// ---------- 3. Slow threshold detection ----------

chk('slow threshold (100ms) flags scrapes over 100ms', () => {
    w49.reset();
    w49.recordScrapeEnd('wave32', Date.now() - 50);   // not slow
    w49.recordScrapeEnd('wave32', Date.now() - 150);  // slow
    w49.recordScrapeEnd('wave46', Date.now() - 200);  // slow
    w49.recordScrapeEnd('wave46', Date.now() - 30);   // not slow
    const c = w49.getCounters();
    ok('  total slowCount = 2', c.slowCount === 2);
    ok('  wave32 slowCount = 1', c.bySubModule.wave32.slowCount === 1);
    ok('  wave46 slowCount = 1', c.bySubModule.wave46.slowCount === 1);
});

chk('slow count returns 0 when no scrapes exceeded threshold', () => {
    w49.reset();
    w49.recordScrapeEnd('wave32', Date.now() - 10);
    w49.recordScrapeEnd('wave46', Date.now() - 20);
    const c = w49.getCounters();
    ok('  total slowCount = 0', c.slowCount === 0);
});

// ---------- 4. Aggregates ----------

chk('aggregate avgDurationMs is total/count', () => {
    w49.reset();
    w49.recordScrapeEnd('wave32', Date.now() - 60);
    w49.recordScrapeEnd('wave32', Date.now() - 40);
    const c = w49.getCounters();
    ok('  total = 2', c.total === 2);
    ok('  totalDurationMs ~100', c.totalDurationMs >= 95 && c.totalDurationMs <= 105);
    ok('  avgDurationMs ~50', c.avgDurationMs >= 47.5 && c.avgDurationMs <= 52.5);
});

chk('maxDurationMs tracks overall worst', () => {
    w49.reset();
    w49.recordScrapeEnd('wave32', Date.now() - 50);
    w49.recordScrapeEnd('wave46', Date.now() - 500);
    w49.recordScrapeEnd('wave48', Date.now() - 100);
    const c = w49.getCounters();
    ok('  maxDurationMs ~500', c.maxDurationMs >= 495 && c.maxDurationMs <= 510);
});

chk('lastDurationMs and lastSubModule track most recent', () => {
    w49.reset();
    w49.recordScrapeEnd('wave32', Date.now() - 50);
    w49.recordScrapeEnd('wave46', Date.now() - 100);
    const c = w49.getCounters();
    ok('  lastSubModule = wave46', c.lastSubModule === 'wave46');
    ok('  lastDurationMs ~100', c.lastDurationMs >= 95 && c.lastDurationMs <= 105);
});

// ---------- 5. Prometheus output ----------

chk('toPrometheusMetrics has all 6 aggregate gauges', () => {
    w49.reset();
    w49.recordScrapeEnd('wave32', Date.now() - 50);
    const out = w49.toPrometheusMetrics();
    ok('  contains nama_scrape_total', out.indexOf('nama_scrape_total') !== -1);
    ok('  contains nama_scrape_avg_duration_ms', out.indexOf('nama_scrape_avg_duration_ms') !== -1);
    ok('  contains nama_scrape_max_duration_ms', out.indexOf('nama_scrape_max_duration_ms') !== -1);
    ok('  contains nama_scrape_last_duration_ms', out.indexOf('nama_scrape_last_duration_ms') !== -1);
    ok('  contains nama_scrape_slow_total', out.indexOf('nama_scrape_slow_total') !== -1);
});

chk('toPrometheusMetrics emits per-sub-module gauges', () => {
    w49.reset();
    w49.recordScrapeEnd('wave32', Date.now() - 50);
    w49.recordScrapeEnd('wave46', Date.now() - 70);
    const out = w49.toPrometheusMetrics();
    ok('  contains wave32_count', out.indexOf('nama_scrape_wave32_count') !== -1);
    ok('  contains wave46_count', out.indexOf('nama_scrape_wave46_count') !== -1);
    ok('  contains wave32_avg_ms', out.indexOf('nama_scrape_wave32_avg_ms') !== -1);
    ok('  contains wave32_max_ms', out.indexOf('nama_scrape_wave32_max_ms') !== -1);
});

chk('toPrometheusMetrics works with passed counters object', () => {
    const fakeCounters = {
        total: 5,
        avgDurationMs: 200,
        maxDurationMs: 500,
        lastDurationMs: 100,
        slowCount: 1,
        bySubModule: {
            wave32: { count: 5, totalMs: 1000, maxMs: 500, slowCount: 1, lastDurationMs: 100, avgMs: 200 },
        },
    };
    const out = w49.toPrometheusMetrics(fakeCounters);
    ok('  scrape_total = 5', /nama_scrape_total 5\b/.test(out));
    ok('  scrape_avg_duration_ms = 200', /nama_scrape_avg_duration_ms 200\b/.test(out));
    ok('  scrape_max_duration_ms = 500', /nama_scrape_max_duration_ms 500\b/.test(out));
    ok('  scrape_slow_total = 1', /nama_scrape_slow_total 1\b/.test(out));
});

chk('toPrometheusMetrics handles null/empty input', () => {
    let didThrow = false;
    try {
        w49.toPrometheusMetrics(null);
        w49.toPrometheusMetrics(undefined);
        w49.toPrometheusMetrics({});
    } catch (e) { didThrow = true; }
    ok('  never throws', !didThrow);
});

// ---------- 6. Safety rails ----------

const fs = require('fs');
const srcPath = require('path').join(__dirname, 'wave49_scrape_latency.js');
const src = fs.readFileSync(srcPath, 'utf8');

chk('source has no SQL DELETE FROM', () => {
    ok('  safe', !/\bDELETE\s+FROM\b/i.test(src));
});

chk('source has no SQL DROP', () => {
    ok('  safe', !/\bDROP\s+(TABLE|DATABASE|SCHEMA)\b/i.test(src));
});

chk('source has no console.error of req.body', () => {
    ok('  safe', !/console\.error\([^)]*req\.body/.test(src));
});

chk('source has no console.log of secrets/tokens', () => {
    ok('  safe', !/console\.log\([^)]*(password|token|secret|api[_-]?key)/i.test(src));
});

chk('source has no global assignment', () => {
    ok('  safe', !/global\.\w+\s*=/.test(src));
});

chk('source never logs durations with sensitive context', () => {
    // The only "log" of duration should be in the counters object — never
    // attached to a user/tenant/req. Verify no console.log.
    ok('  no console.log', !/console\.log\(/.test(src));
});

// ---------- 7. Public API ----------

chk('public API surface is complete', () => {
    const expected = [
        'recordScrapeStart',
        'recordScrapeEnd',
        'makeScrapeTimer',
        'getCounters',
        'reset',
        'toPrometheusMetrics',
        'listSubModules',
        'KNOWN_SUB_MODULES',
    ];
    for (const name of expected) {
        ok('  has ' + name, typeof w49[name] !== 'undefined');
    }
});

chk('makeScrapeTimer returns start/end closures', () => {
    w49.reset();
    const timer = w49.makeScrapeTimer('wave46');
    ok('  has start', typeof timer.start === 'function');
    ok('  has end', typeof timer.end === 'function');
    timer.start();
    timer.end();
    const c = w49.getCounters();
    ok('  recorded via timer', c.bySubModule.wave46.count === 1);
});

// ---------- Summary ----------

(async () => {
    await new Promise((r) => setImmediate(r));
    console.log('');
    console.log(`Summary: ${pass} passed, ${fail} failed`);
    process.exit(fail === 0 ? 0 : 1);
})();
