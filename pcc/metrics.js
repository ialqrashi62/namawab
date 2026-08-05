/**
 * pcc/metrics.js — PCC Prometheus-style metrics endpoint
 *
 * Phase: PCC Sandbox v3.316.23
 *
 * Provides:
 *   - initMetrics({ getModuleCount, getFunctionCount })
 *       Registers lazy getters used by renderMetrics(). Safe to call multiple
 *       times; later calls overwrite earlier callbacks.
 *   - incrementHttp(method, status)
 *       Bumps the per-(method,status) counter. Cheap; called from a global
 *       res.on('finish') listener in server.js.
 *   - renderMetrics()
 *       Returns the Prometheus text exposition format (version 0.0.4).
 *
 * Counters live in process memory only; they reset on restart, which is
 * acceptable for the sandbox. The endpoint is mounted at /_metrics.
 *
 * Spec: https://prometheus.io/docs/instrumenting/exposition_formats/
 */
'use strict';

// --- Catalog-derived gauge getters ------------------------------------------
// v3.316.23: hoisted to module scope so renderMetrics() always reads the
// latest registered callbacks. Defaults are zero so the metric is well-defined
// even if initMetrics is never called.
let moduleCountGetter = () => 0;
let functionCountGetter = () => 0;

// method|status -> integer count
const _httpCounts = new Map();

// Reasonable upper bound on distinct (method,status) pairs to prevent the Map
// from growing unbounded if a misbehaving client floods with novel pairs.
// 16 methods * ~10 status codes = 160 pairs covers normal traffic easily.
const _HTTP_BUCKETS_CAP = 256;

function _httpKey(method, status) {
  return (method || 'UNKNOWN') + '|' + String(status || 0);
}

// --- Latency histogram (v3.316.22) -------------------------------------------
// Per-(method,route) request-duration histogram in Prometheus convention.
// Bucket boundaries are in seconds.
const BUCKET_BOUNDS = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10];
const latencyMap = new Map();

// 256 distinct (method,route) combos is plenty for a single-process sandbox.
const _LATENCY_BUCKETS_CAP = 256;

function _latencyKey(method, route) {
  return (method || 'UNKNOWN') + '|' + (route || 'UNKNOWN');
}

/**
 * Record a request duration in seconds. `route` is a template path like
 * "/api/v1/pcc-catalog/modules" (not raw URL with query string).
 * Bumps count, sum, and cumulative bucket counters.
 */
function observeLatency(method, route, durationSeconds) {
  const key = _latencyKey(method, route);
  let h = latencyMap.get(key);
  if (!h) {
    if (latencyMap.size >= _LATENCY_BUCKETS_CAP) {
      // Map full: drop this sample rather than evicting live data.
      return;
    }
    h = { count: 0, sum: 0, buckets: new Array(BUCKET_BOUNDS.length).fill(0) };
    latencyMap.set(key, h);
  }
  h.count += 1;
  h.sum += durationSeconds;
  for (let i = 0; i < BUCKET_BOUNDS.length; i++) {
    if (durationSeconds <= BUCKET_BOUNDS[i]) h.buckets[i] += 1;
  }
}

/**
 * Bounded map (max 256 distinct (method,route) combos) to prevent unbounded
 * growth under high-cardinality routes. Drops oldest entries (FIFO).
 * Intended to be called periodically; not on the hot path.
 */
function _trimLatency() {
  if (latencyMap.size <= _LATENCY_BUCKETS_CAP) return;
  const toRemove = latencyMap.size - _LATENCY_BUCKETS_CAP;
  let removed = 0;
  for (const k of latencyMap.keys()) {
    if (removed >= toRemove) break;
    latencyMap.delete(k);
    removed += 1;
  }
}

// --- Public API ---------------------------------------------------------------

/**
 * Register the callbacks used to read catalog-derived gauge values.
 * Call once at server boot, after PCC_CATALOG_DATA is loaded. Safe to call
 * multiple times; the latest registered callbacks win on the next scrape.
 *
 *   initMetrics({
 *     getModuleCount:    () => Object.keys(PCC_MODULES_LOOKUP || {}).length,
 *     getFunctionCount:  () => Object.values(PCC_MODULES_LOOKUP || {})
 *                                 .reduce((s, m) => s + (m?.function_count || 0), 0),
 *   });
 */
function initMetrics(opts) {
  if (opts && typeof opts.getModuleCount === 'function') {
    moduleCountGetter = opts.getModuleCount;
  }
  if (opts && typeof opts.getFunctionCount === 'function') {
    functionCountGetter = opts.getFunctionCount;
  }
}

/**
 * Bump the per-(method,status) counter. No-op if method/status are missing.
 */
function incrementHttp(method, status) {
  if (!method) return;
  const k = _httpKey(method, status);
  if (!_httpCounts.has(k) && _httpCounts.size >= _HTTP_BUCKETS_CAP) {
    // Map full: drop the new bucket rather than evicting live data.
    return;
  }
  _httpCounts.set(k, (_httpCounts.get(k) || 0) + 1);
}

/**
 * Render the metrics in Prometheus text exposition format (v0.0.4).
 * Returns a string; caller is responsible for setting Content-Type.
 */
function renderMetrics() {
  const lines = [];
  const uptime = Math.floor(process.uptime());
  const memRss = process.memoryUsage().rss;

  // Resolve gauge values defensively; never throw out of the metrics endpoint.
  let moduleCount = 0;
  let functionCount = 0;
  try { moduleCount = Number(moduleCountGetter()) || 0; } catch (_) { /* ignore */ }
  try { functionCount = Number(functionCountGetter()) || 0; } catch (_) { /* ignore */ }

  // --- pcc_uptime_seconds ---
  lines.push('# HELP pcc_uptime_seconds Process uptime in seconds');
  lines.push('# TYPE pcc_uptime_seconds gauge');
  lines.push('pcc_uptime_seconds ' + uptime);

  // --- pcc_audit_log_entries (read from global ring buffer if available) ---
  const auditLen = (typeof global !== 'undefined' && global.pccAuditLog && Array.isArray(global.pccAuditLog))
    ? global.pccAuditLog.length
    : 0;
  lines.push('# HELP pcc_audit_log_entries Current in-memory audit log size');
  lines.push('# TYPE pcc_audit_log_entries gauge');
  lines.push('pcc_audit_log_entries ' + auditLen);

  // --- pcc_memory_rss_bytes ---
  lines.push('# HELP pcc_memory_rss_bytes Resident set size in bytes');
  lines.push('# TYPE pcc_memory_rss_bytes gauge');
  lines.push('pcc_memory_rss_bytes ' + memRss);

  // --- pcc_module_count ---
  lines.push('# HELP pcc_module_count Total PCC modules registered');
  lines.push('# TYPE pcc_module_count gauge');
  lines.push('pcc_module_count ' + moduleCount);

  // --- pcc_function_count ---
  lines.push('# HELP pcc_function_count Total PCC functions across all modules');
  lines.push('# TYPE pcc_function_count gauge');
  lines.push('pcc_function_count ' + functionCount);

  // --- pcc_http_requests_total (counter, one series per method|status) ---
  lines.push('# HELP pcc_http_requests_total HTTP request counter');
  lines.push('# TYPE pcc_http_requests_total counter');
  if (_httpCounts.size === 0) {
    // Emit a zero placeholder so the metric family is always present.
    lines.push('pcc_http_requests_total{method="GET",status="200"} 0');
  } else {
    // Sort for stable, diff-friendly output.
    const keys = Array.from(_httpCounts.keys()).sort();
    for (const k of keys) {
      const sep = k.indexOf('|');
      const method = k.substring(0, sep);
      const status = k.substring(sep + 1);
      const n = _httpCounts.get(k) || 0;
      // method/status are internal strings (no user input), safe to embed unescaped.
      lines.push('pcc_http_requests_total{method="' + method + '",status="' + status + '"} ' + n);
    }
  }

  // --- pcc_request_duration_seconds (histogram, one series per method|route) ---
  lines.push('# HELP pcc_request_duration_seconds Request duration in seconds');
  lines.push('# TYPE pcc_request_duration_seconds histogram');
  if (latencyMap.size === 0) {
    // Emit a zero placeholder so the metric family is always present.
    const placeholderMethod = 'GET';
    const placeholderRoute = 'none';
    for (let i = 0; i < BUCKET_BOUNDS.length; i++) {
      lines.push(`pcc_request_duration_seconds_bucket{method="${placeholderMethod}",route="${placeholderRoute}",le="${BUCKET_BOUNDS[i]}"} 0`);
    }
    lines.push(`pcc_request_duration_seconds_bucket{method="${placeholderMethod}",route="${placeholderRoute}",le="+Inf"} 0`);
    lines.push(`pcc_request_duration_seconds_sum{method="${placeholderMethod}",route="${placeholderRoute}"} 0.000000`);
    lines.push(`pcc_request_duration_seconds_count{method="${placeholderMethod}",route="${placeholderRoute}"} 0`);
  } else {
    const latKeys = Array.from(latencyMap.keys()).sort();
    for (const key of latKeys) {
      const sep = key.indexOf('|');
      const method = key.substring(0, sep);
      const route = key.substring(sep + 1);
      const h = latencyMap.get(key);
      // Escape any embedded double-quotes defensively (req.path is server-derived
      // but req.route.path is a template; both should be safe in practice).
      const safeRoute = route.replace(/"/g, '\\"');
      for (let i = 0; i < BUCKET_BOUNDS.length; i++) {
        lines.push(`pcc_request_duration_seconds_bucket{method="${method}",route="${safeRoute}",le="${BUCKET_BOUNDS[i]}"} ${h.buckets[i]}`);
      }
      lines.push(`pcc_request_duration_seconds_bucket{method="${method}",route="${safeRoute}",le="+Inf"} ${h.count}`);
      lines.push(`pcc_request_duration_seconds_sum{method="${method}",route="${safeRoute}"} ${h.sum.toFixed(6)}`);
      lines.push(`pcc_request_duration_seconds_count{method="${method}",route="${safeRoute}"} ${h.count}`);
    }
  }

  // Prometheus expects a trailing newline.
  return lines.join('\n') + '\n';
}

module.exports = {
  initMetrics,
  incrementHttp,
  observeLatency,
  renderMetrics,
  _trimLatency,
};
