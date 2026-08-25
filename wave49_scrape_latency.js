/**
 * wave49_scrape_latency.js -- Wave 49: Scrape Latency Tracking
 *
 * PROBLEM:
 *   /api/metrics (the Prometheus scrape endpoint) takes 250-430ms per scrape.
 *   That's ~5x slower than ideal for a scrape endpoint. Slow scrapes mean:
 *   - Prometheus scrape timeout risk (default 10s)
 *   - Cascading failures when sub-aggregator (wave46/47/48) latency spikes
 *   - No visibility into WHICH sub-module is the bottleneck
 *
 * WAVE 49 SHIPS:
 *   1. makeScrapeTimer() — middleware that records start/end of /api/metrics
 *   2. recordScrapeStart() / recordScrapeEnd() — counters keyed by sub-module name
 *   3. getCounters() — returns { total, bySubModule: {wave32, wave46, wave47, wave48},
 *                                totalDurationMs, avgDurationMs, maxDurationMs,
 *                                lastDurationMs, slowCount (over 100ms) }
 *   4. toPrometheusMetrics() — exposes gauges for each sub-module + summary
 *
 * Why this matters:
 *   - Alerts: "scrape taking >1s" fires BEFORE Prometheus gives up
 *   - Bottleneck detection: per-sub-module duration isolates the problem
 *   - Capacity planning: trend scrape latency over time
 *
 * Safety rails (AGENTS.md section 2.2):
 *   - Rail 11 (fail-closed on missing context): if a sub-module is unknown,
 *     label it as 'unknown' so we never lose visibility.
 *   - Rail 12 (no secret log): only durations are recorded, no body content.
 *
 * Public API:
 *   - makeScrapeTimer(name) → () → () returns startFn; calling endFn logs.
 *   - recordScrapeStart(name) / recordScrapeEnd(name, startMs) → void
 *   - getCounters() → counters object
 *   - reset() → clears counters
 *   - toPrometheusMetrics(counters) → Prometheus text
 *   - listSubModules() → ['wave32', 'wave46', 'wave47', 'wave48', 'unknown']
 */

'use strict';

// In-memory counters
const _counters = {
    started_at: new Date().toISOString(),
    total: 0,                       // total scrape observations
    bySubModule: {},                // { wave32: { count, totalMs, maxMs, slowCount }, ... }
    lastDurationMs: 0,
    lastAt: null,
    lastSubModule: null,
    totalDurationMs: 0,
    maxDurationMs: 0,
    slowThresholdMs: 100,
    slowCount: 0,                   // scrapes over slowThresholdMs
};

// ----- Sub-module catalog -----
const KNOWN_SUB_MODULES = ['wave32', 'wave46', 'wave47', 'wave48', 'unknown'];

function listSubModules() {
    return KNOWN_SUB_MODULES.slice();
}

function _getOrInit(name) {
    if (!_counters.bySubModule[name]) {
        _counters.bySubModule[name] = {
            count: 0,
            totalMs: 0,
            maxMs: 0,
            slowCount: 0,
            lastDurationMs: 0,
        };
    }
    return _counters.bySubModule[name];
}

// ----- Public API -----

/**
 * Record the start of a scrape for a given sub-module.
 * Returns the start timestamp (in ms since process start).
 *
 * @param {string} name  -- sub-module name (e.g. 'wave32', 'wave46')
 * @returns {number}     -- start time (Date.now())
 */
function recordScrapeStart(name) {
    return Date.now();
}

/**
 * Record the end of a scrape.
 *
 * @param {string} name       -- sub-module name (matched against KNOWN_SUB_MODULES)
 * @param {number} startMs    -- start time from recordScrapeStart()
 */
function recordScrapeEnd(name, startMs) {
    const subName = KNOWN_SUB_MODULES.indexOf(name) !== -1 ? name : 'unknown';
    const sub = _getOrInit(subName);
    const durationMs = Date.now() - startMs;
    if (durationMs < 0) return; // clock skew — ignore
    _counters.total += 1;
    sub.count += 1;
    sub.totalMs += durationMs;
    sub.lastDurationMs = durationMs;
    if (durationMs > sub.maxMs) sub.maxMs = durationMs;
    if (durationMs > _counters.slowThresholdMs) {
        sub.slowCount += 1;
        _counters.slowCount += 1;
    }
    _counters.totalDurationMs += durationMs;
    if (durationMs > _counters.maxDurationMs) _counters.maxDurationMs = durationMs;
    _counters.lastDurationMs = durationMs;
    _counters.lastAt = new Date().toISOString();
    _counters.lastSubModule = subName;
}

/**
 * One-call helper that returns a pair (start, end) closures.
 *
 * @param {string} name  -- sub-module name
 * @returns {{start: Function, end: Function}}
 */
function makeScrapeTimer(name) {
    let startMs = 0;
    return {
        start: () => { startMs = Date.now(); return startMs; },
        end:   () => { if (startMs) recordScrapeEnd(name, startMs); startMs = 0; },
    };
}

/**
 * Snapshot the current counters. Always returns a fresh object (never the
 * internal reference) so callers cannot mutate the live counters.
 *
 * @returns {object}
 */
function getCounters() {
    const out = {
        started_at: _counters.started_at,
        total: _counters.total,
        bySubModule: {},
        lastDurationMs: _counters.lastDurationMs,
        lastAt: _counters.lastAt,
        lastSubModule: _counters.lastSubModule,
        totalDurationMs: _counters.totalDurationMs,
        avgDurationMs: _counters.total > 0
            ? Number((_counters.totalDurationMs / _counters.total).toFixed(2))
            : 0,
        maxDurationMs: _counters.maxDurationMs,
        slowThresholdMs: _counters.slowThresholdMs,
        slowCount: _counters.slowCount,
        since: _counters.started_at,
    };
    for (const k of Object.keys(_counters.bySubModule)) {
        const s = _counters.bySubModule[k];
        out.bySubModule[k] = {
            count: s.count,
            totalMs: s.totalMs,
            maxMs: s.maxMs,
            slowCount: s.slowCount,
            lastDurationMs: s.lastDurationMs,
            avgMs: s.count > 0 ? Number((s.totalMs / s.count).toFixed(2)) : 0,
        };
    }
    return out;
}

function reset() {
    _counters.started_at = new Date().toISOString();
    _counters.total = 0;
    _counters.bySubModule = {};
    _counters.lastDurationMs = 0;
    _counters.lastAt = null;
    _counters.lastSubModule = null;
    _counters.totalDurationMs = 0;
    _counters.maxDurationMs = 0;
    _counters.slowCount = 0;
}

// ----- Prometheus exposition -----

function toPrometheusMetrics(counters) {
    const c = counters || getCounters();

    const lines = [
        '# HELP nama_scrape_total Total /api/metrics scrapes observed',
        '# TYPE nama_scrape_total counter',
        `nama_scrape_total ${c.total || 0}`,
        '# HELP nama_scrape_avg_duration_ms Average scrape duration (ms)',
        '# TYPE nama_scrape_avg_duration_ms gauge',
        `nama_scrape_avg_duration_ms ${c.avgDurationMs || 0}`,
        '# HELP nama_scrape_max_duration_ms Worst scrape duration observed (ms)',
        '# TYPE nama_scrape_max_duration_ms gauge',
        `nama_scrape_max_duration_ms ${c.maxDurationMs || 0}`,
        '# HELP nama_scrape_last_duration_ms Most recent scrape duration (ms)',
        '# TYPE nama_scrape_last_duration_ms gauge',
        `nama_scrape_last_duration_ms ${c.lastDurationMs || 0}`,
        '# HELP nama_scrape_slow_total Number of scrapes over the slow threshold (100ms)',
        '# TYPE nama_scrape_slow_total counter',
        `nama_scrape_slow_total ${c.slowCount || 0}`,
    ];

    // Per-sub-module gauges
    for (const subName of KNOWN_SUB_MODULES) {
        const s = (c.bySubModule || {})[subName] || { count: 0, totalMs: 0, maxMs: 0, slowCount: 0, avgMs: 0 };
        lines.push(`# HELP nama_scrape_${subName}_count Scrape observations for ${subName}`);
        lines.push(`# TYPE nama_scrape_${subName}_count counter`);
        lines.push(`nama_scrape_${subName}_count ${s.count || 0}`);
        lines.push(`# HELP nama_scrape_${subName}_avg_ms Average duration for ${subName} (ms)`);
        lines.push(`# TYPE nama_scrape_${subName}_avg_ms gauge`);
        lines.push(`nama_scrape_${subName}_avg_ms ${s.avgMs || 0}`);
        lines.push(`# HELP nama_scrape_${subName}_max_ms Worst duration for ${subName} (ms)`);
        lines.push(`# TYPE nama_scrape_${subName}_max_ms gauge`);
        lines.push(`nama_scrape_${subName}_max_ms ${s.maxMs || 0}`);
    }

    return lines.join('\n') + '\n';
}

module.exports = {
    recordScrapeStart,
    recordScrapeEnd,
    makeScrapeTimer,
    getCounters,
    reset,
    toPrometheusMetrics,
    listSubModules,
    KNOWN_SUB_MODULES,
};
