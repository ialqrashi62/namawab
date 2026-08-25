// filepath: namaweb/perf_router.js
// Performance profiling endpoints.
// pg_stat_statements query timing, slow query detection, index hit rates, connection stats.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// GET /api/perf/slow-queries
// Top 20 slowest queries from pg_stat_statements (if available)
router.get('/slow-queries', requireAuth, requireTenantScope, requireRole('admin', 'owner', 'doctor'), async (req, res) => {
    try {
        let rows = [];
        try {
            const r = await db.query(`
                SELECT ROUND(mean_exec_time::numeric, 2) as mean_ms,
                       calls,
                       ROUND((total_exec_time / 1000)::numeric, 2) as total_sec,
                       LEFT(query, 200) as query_preview
                FROM pg_stat_statements
                WHERE query NOT LIKE '%pg_stat_statements%'
                ORDER BY mean_exec_time DESC LIMIT 20
            `);
            rows = r.rows;
        } catch (e) {
            // pg_stat_statements not enabled
            rows = [{ note: 'pg_stat_statements extension not enabled — run CREATE EXTENSION pg_stat_statements' }];
        }
        res.json({ ok: true, timestamp: new Date().toISOString(), slow_queries: rows });
    } catch (err) {
        console.error('GET /api/perf/slow-queries', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// GET /api/perf/index-usage
router.get('/index-usage', requireAuth, requireTenantScope, requireRole('admin', 'owner'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT schemaname, relname as table_name,
                   indexrelname as index_name,
                   idx_scan as scans,
                   idx_tup_read as tuples_read,
                   idx_tup_fetch as tuples_fetched
            FROM pg_stat_user_indexes
            WHERE schemaname = 'public'
            ORDER BY idx_scan DESC LIMIT 30
        `);
        // Find unused indexes (zero scans)
        const unused = await db.query(`
            SELECT schemaname, relname as table_name, indexrelname as index_name
            FROM pg_stat_user_indexes
            WHERE idx_scan = 0 AND schemaname = 'public'
            LIMIT 20
        `);
        res.json({ ok: true, top_indexes: r.rows, unused_indexes: unused.rows, recommendation: unused.rows.length > 0 ? 'Review unused indexes for DROP candidate.' : 'All indexes are being utilized.' });
    } catch (err) {
        console.error('GET /api/perf/index-usage', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// GET /api/perf/connections
router.get('/connections', requireAuth, requireTenantScope, requireRole('admin', 'owner'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT state, COUNT(*) as cnt,
                   COUNT(*) FILTER (WHERE state = 'active' AND NOW() - state_change > INTERVAL '30 seconds') as long_running
            FROM pg_stat_activity
            WHERE backend_type = 'client backend'
            GROUP BY state
            ORDER BY cnt DESC
        `);
        const settings = await db.query(`SHOW max_connections`);
        const total = r.rows.reduce((s, x) => s + +x.cnt, 0);
        res.json({
            ok: true,
            timestamp: new Date().toISOString(),
            max_connections: +settings.rows[0].max_connections,
            current_connections: total,
            utilization_pct: +(((total / +settings.rows[0].max_connections) * 100)).toFixed(1),
            by_state: r.rows
        });
    } catch (err) {
        console.error('GET /api/perf/connections', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// GET /api/perf/cache-hit
router.get('/cache-hit', requireAuth, requireTenantScope, requireRole('admin', 'owner'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT
                SUM(heap_blks_read) as heap_read,
                SUM(heap_blks_hit) as heap_hit,
                SUM(idx_blks_read) as idx_read,
                SUM(idx_blks_hit) as idx_hit
            FROM pg_statio_user_tables
            WHERE schemaname = 'public'
        `);
        const heap = r.rows[0];
        const total = (parseInt(heap.heap_read) || 0) + (parseInt(heap.heap_hit) || 0);
        const cacheHit = total > 0 ? +((parseInt(heap.heap_hit) / total) * 100).toFixed(2) : 0;
        res.json({
            ok: true,
            timestamp: new Date().toISOString(),
            heap_blocks_read: +heap.heap_read,
            heap_blocks_hit: +heap.heap_hit,
            cache_hit_ratio_pct: cacheHit,
            recommendation: cacheHit < 95 ? 'Consider increasing shared_buffers or running ANALYZE.' : 'Cache hit ratio is healthy.'
        });
    } catch (err) {
        console.error('GET /api/perf/cache-hit', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// GET /api/perf/table-bloat
router.get('/table-bloat', requireAuth, requireTenantScope, requireRole('admin', 'owner'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT relname as table_name,
                   pg_size_pretty(pg_total_relation_size(relid)) as total_size,
                   pg_size_pretty(pg_relation_size(relid)) as table_size,
                   pg_size_pretty(pg_indexes_size(relid)) as indexes_size,
                   n_live_tup as live_rows,
                   n_dead_tup as dead_rows
            FROM pg_stat_user_tables
            WHERE schemaname = 'public'
            ORDER BY pg_total_relation_size(relid) DESC LIMIT 15
        `);
        res.json({ ok: true, tables: r.rows });
    } catch (err) {
        console.error('GET /api/perf/table-bloat', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['slow-queries', 'index-usage', 'connections', 'cache-hit', 'table-bloat'], timestamp: new Date().toISOString() });
});

module.exports = router;