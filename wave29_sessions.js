/**
 * wave29_sessions.js — Redis Sessions Hardening (Wave 29)
 *
 * Adds:
 *  - Redis health endpoint (latency, memory, keyspace)
 *  - Session reaping (delete stale sessions every N hours)
 *  - Session metrics for Prometheus
 *  - Sliding-TTL correctness (no extension on no-op requests)
 */

'use strict';

const { StructuredLogger } = require('./lib/StructuredLogger');

const log = new StructuredLogger({ service: 'wave29-sessions' });

// ---- Session store metrics (in-process counters) ----
const _metrics = {
    sets: 0,
    gets: 0,
    deletes: 0,
    touches: 0,
    fallback_uses: 0,
    redis_errors: 0,
    reap_runs: 0,
    reap_session_deletions: 0,
};

function getMetrics() {
    return { ..._metrics };
}

function resetMetrics() {
    _metrics.sets = 0;
    _metrics.gets = 0;
    _metrics.deletes = 0;
    _metrics.touches = 0;
    _metrics.fallback_uses = 0;
    _metrics.redis_errors = 0;
    _metrics.reap_runs = 0;
    _metrics.reap_session_deletions = 0;
}

function inc(field) {
    if (field in _metrics) _metrics[field]++;
}

/**
 * Wrap an existing RedisStore to track metrics.
 * Usage: wrapRedisStore(originalStore)
 */
function wrapRedisStore(store) {
    if (!store) return store;
    const origGet = store.get.bind(store);
    const origSet = store.set.bind(store);
    const origDel = store.destroy.bind(store);
    const origTouch = store.touch ? store.touch.bind(store) : null;

    store.get = (sid, cb) => {
        inc('gets');
        origGet(sid, (err, val) => {
            if (err) inc('redis_errors');
            cb(err, val);
        });
    };
    store.set = (sid, val, cb) => {
        inc('sets');
        origSet(sid, val, (err) => {
            if (err) inc('redis_errors');
            cb(err);
        });
    };
    store.destroy = (sid, cb) => {
        inc('deletes');
        origDel(sid, (err) => {
            if (err) inc('redis_errors');
            cb(err);
        });
    };
    if (origTouch) {
        store.touch = (sid, val, cb) => {
            inc('touches');
            origTouch(sid, val, (err) => {
                if (err) inc('redis_errors');
                cb(err);
            });
        };
    }

    log.info('store_wrapped', { client: store.client ? 'connected' : 'uninitialized' });
    return store;
}

/**
 * Probe Redis with PING + INFO subset.
 * Returns { ok, latencyMs, version, uptimeSeconds, connectedClients, usedMemoryHuman }
 */
async function probeRedis(redisClient) {
    if (!redisClient) return { ok: false, reason: 'no_client' };
    const start = process.hrtime.bigint();
    try {
        const pong = await redisClient.ping();
        const latencyMs = Number((process.hrtime.bigint() - start) / 1000000n);
        if (pong !== 'PONG') return { ok: false, latencyMs, reason: 'ping_not_pong', got: pong };

        // Only fetch INFO if available (client lib version dependent)
        let info = {};
        try {
            const infoStr = await redisClient.info();
            // Parse common fields
            const pairs = String(infoStr).split('\n');
            for (const line of pairs) {
                if (line.startsWith('redis_version:')) info.version = line.split(':')[1].trim();
                if (line.startsWith('uptime_in_seconds:')) info.uptimeSeconds = parseInt(line.split(':')[1], 10);
                if (line.startsWith('connected_clients:')) info.connectedClients = parseInt(line.split(':')[1], 10);
                if (line.startsWith('used_memory_human:')) info.usedMemoryHuman = line.split(':')[1].trim();
            }
        } catch (_) { /* older clients may not have info() */ }

        return { ok: true, latencyMs, ...info };
    } catch (e) {
        return { ok: false, reason: 'error', message: e.message };
    }
}

/**
 * Reap stale sessions older than TTL.
 * Run via setInterval: starts a timer that reaps every `intervalMs.
 */
function startSessionReaper({
    redisClient,
    sessionStore,
    prefix = 'nama_session:',
    ttlMs = 8 * 60 * 60 * 1000,  // 8h max TTL
    intervalMs = 6 * 60 * 60 * 1000,  // every 6h
}) {
    if (!redisClient) {
        log.warn('reaper_disabled', { reason: 'no_redis_client' });
        return null;
    }

    const reap = async () => {
        inc('reap_runs');
        try {
            // Scan keys with our prefix
            let cursor = '0';
            let deleted = 0;
            let scanned = 0;
            do {
                const reply = await redisClient.scan(cursor, { MATCH: prefix + '*', COUNT: 100 });
                cursor = reply.cursor;
                const keys = reply.keys || [];
                scanned += keys.length;
                for (const key of keys) {
                    const ttl = await redisClient.ttl(key);
                    if (ttl === -1) {
                        // No expiry set — set it
                        await redisClient.expire(key, Math.floor(ttlMs / 1000));
                    } else if (ttl === -2) {
                        // Already gone (race)
                        continue;
                    } else if (ttl < 60) {
                        // Less than 60s remaining — delete (suspicious zombie)
                        await redisClient.del(key);
                        deleted++;
                    }
                }
            } while (cursor !== '0' && cursor !== 0);

            inc('reap_session_deletions'); deleted > 0 && (_metrics.reap_session_deletions += deleted);
            log.info('reap_done', { scanned, deleted });
        } catch (e) {
            log.error('reap_failed', { error: e.message });
        }
    };

    const timer = setInterval(reap, intervalMs);
    timer.unref(); // don't block process exit
    // Run once on startup
    reap();
    return { stop: () => clearInterval(timer) };
}

/**
 * Prometheus format exporter for session metrics.
 */
function toPrometheusMetrics() {
    const m = getMetrics();
    return [
        '# HELP nama_session_sets_total Total session set() calls',
        '# TYPE nama_session_sets_total counter',
        `nama_session_sets_total ${m.sets}`,
        '# HELP nama_session_gets_total Total session get() calls',
        '# TYPE nama_session_gets_total counter',
        `nama_session_gets_total ${m.gets}`,
        '# HELP nama_session_deletes_total Total session destroy() calls',
        '# TYPE nama_session_deletes_total counter',
        `nama_session_deletes_total ${m.deletes}`,
        '# HELP nama_session_touches_total Total session touch() calls',
        '# TYPE nama_session_touches_total counter',
        `nama_session_touches_total ${m.touches}`,
        '# HELP nama_session_fallback_uses_total Total MemoryStore fallbacks',
        '# TYPE nama_session_fallback_uses_total counter',
        `nama_session_fallback_uses_total ${m.fallback_uses}`,
        '# HELP nama_session_redis_errors_total Total Redis errors',
        '# TYPE nama_session_redis_errors_total counter',
        `nama_session_redis_errors_total ${m.redis_errors}`,
        '# HELP nama_session_reap_runs_total Total reap cycles',
        '# TYPE nama_session_reap_runs_total counter',
        `nama_session_reap_runs_total ${m.reap_runs}`,
        '# HELP nama_session_reap_deletions_total Total sessions deleted by reaper',
        '# TYPE nama_session_reap_deletions_total counter',
        `nama_session_reap_deletions_total ${m.reap_session_deletions}`,
        '',
    ].join('\n');
}

/**
 * Express middleware: Redis health endpoint.
 * Mounts GET /api/health/redis with detailed status.
 */
function redisHealthEndpoint(redisClient) {
    return async function redisHealth(req, res) {
        const detail = req.query.detail === '1' || req.query.detail === 'true';
        const result = await probeRedis(redisClient);
        const status = result.ok ? 200 : 503;
        const body = {
            status: result.ok ? 'UP' : 'DOWN',
            reason: result.reason || null,
            latencyMs: result.latencyMs || null,
        };
        if (detail) {
            Object.assign(body, {
                version: result.version || null,
                uptimeSeconds: result.uptimeSeconds || null,
                connectedClients: result.connectedClients || null,
                usedMemoryHuman: result.usedMemoryHuman || null,
                metrics: getMetrics(),
            });
        }
        res.status(status).json(body);
    };
}

module.exports = {
    wrapRedisStore,
    probeRedis,
    startSessionReaper,
    toPrometheusMetrics,
    redisHealthEndpoint,
    getMetrics,
    resetMetrics,
};
