#!/usr/bin/env python3
"""Patch prod server.js with Wave 29/31/32/33 routes. Idempotent: checks for wave29
require before doing anything; refuses to re-apply."""
import sys, os, json

PATH = '/var/www/namaweb/server.js'

with open(PATH, 'r') as f:
    src = f.read()

if "const wave29 = require('./wave29_sessions');" in src:
    print('ALREADY_PATCHED: wave29 require present — no-op')
    sys.exit(0)

# --- 1) Insert 4 wave requires after obEngine ---
old1 = "const obEngine = require('./ob_engine'); // E14 OB/Maternity server-side authority engine (EDD/GA/GPAL/APGAR/biometry/risk)\n"
assert src.count(old1) == 1, f'obEngine anchor not unique ({src.count(old1)})'
new1 = old1 + (
    "const wave29 = require('./wave29_sessions'); // Wave 29 Redis Sessions Hardening (health endpoint, reaper, metrics)\n"
    "const openapiGenerator = require('./openapi_generator'); // Wave 33 OpenAPI 3.0 spec + Swagger UI\n"
    "const wave31 = require('./wave31_rls_audit'); // Wave 31 RLS query pattern audit (static scanner)\n"
    "const wave32 = require('./wave32_metrics'); // Wave 32 unified Prometheus scrape + alert engine\n"
)
src = src.replace(old1, new1, 1)

# --- 2) Wave 29 routes — after /api/health closure, before /api/system/info ---
old2 = ("// New: GET /api/system/info\n"
        "// Public endpoint: deployment + build metadata. NO secrets, NO PHI, NO tenant data.\n")
assert src.count(old2) == 1, f'/api/system/info anchor not unique ({src.count(old2)})'
new2 = ("// Wave 29: Redis health endpoint (200/UP when Redis answers PING; 503/DOWN otherwise).\n"
        "// ?detail=1 adds INFO + session metrics (safe - no PHI, no secrets).\n"
        "app.get('/api/health/redis', wave29.redisHealthEndpoint(app.locals.redisClient));\n"
        "// Wave 29: Prometheus-format session metrics for monitoring/scrape.\n"
        "app.get('/api/metrics/sessions', (req, res) => {\n"
        "    res.set('Content-Type', 'text/plain; version=0.0.4');\n"
        "    res.send(wave29.toPrometheusMetrics());\n"
        "});\n\n"
        + old2)
src = src.replace(old2, new2, 1)

# --- 3) Wave 31/32/33 routes — before SPA CATCH-ALL ---
old3 = "// ===== SPA CATCH-ALL (must be LAST route) =====\n"
assert src.count(old3) == 1, f'SPA CATCH-ALL anchor not unique ({src.count(old3)})'
new3 = (
    "// ===== Wave 31: RLS PATTERN AUDIT (static scanner surfaced as JSON) =====\n"
    "// READ-ONLY: re-runs the static scanner against server.js on demand. NO DB query,\n"
    "// NO code execution - pure regex against the source text. Cached for 60s in-process.\n"
    "let _wave31Cache = null;\n"
    "let _wave31CacheAt = 0;\n"
    "async function getWave31Report() {\n"
    "    const now = Date.now();\n"
    "    if (_wave31Cache && (now - _wave31CacheAt) < 60000) return _wave31Cache;\n"
    "    try {\n"
    "        const target = [__filename];\n"
    "        const { summary, files } = wave31.auditFiles(target);\n"
    "        _wave31Cache = {\n"
    "            scanned_at: new Date().toISOString(),\n"
    "            summary,\n"
    "            files: files.map(f => ({ file: f.file, total: f.total || 0, ok: f.ok || 0, risk: f.risk || 0, info: f.info || 0, error: f.error })),\n"
    "        };\n"
    "        _wave31CacheAt = now;\n"
    "        return _wave31Cache;\n"
    "    } catch (e) { return { error: e.message }; }\n"
    "}\n"
    "app.get('/api/security/rls-audit', requireAuth, (req, res) => {\n"
    "    const role = req.session?.user?.role;\n"
    "    if (role !== 'Admin' && role !== 'IT') return res.status(403).json({ error: 'Admin or IT only' });\n"
    "    getWave31Report().then(report => res.json(report));\n"
    "});\n\n"
    "// ===== Wave 32: UNIFIED PROMETHEUS METRICS + ALERT ENDPOINT =====\n"
    "// Exposes the Wave 29 (sessions) + Wave 31 (RLS audit) + system probe in one scrape.\n"
    "// NEVER includes PHI / secrets. Operator-facing - no auth required (Prometheus scrape convention).\n"
    "let _wave32LastRls = null;\n"
    "app.get('/api/metrics', async (req, res) => {\n"
    "    try {\n"
    "        const rls = _wave32LastRls || (await getWave31Report()).summary || null;\n"
    "        _wave32LastRls = rls;\n"
    "        const prom = await wave32.toPrometheusMetrics(pool, { rlsAudit: rls });\n"
    "        res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');\n"
    "        res.send(prom);\n"
    "    } catch (e) {\n"
    "        res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');\n"
    "        res.send('# scrape_error 1\\nnama_alerts_firing 1\\n');\n"
    "    }\n"
    "});\n"
    "// Alert JSON surface - same data as Prometheus but with remediation text.\n"
    "// Admin / IT only (operators; not for browsers).\n"
    "app.get('/api/metrics/alerts', requireAuth, async (req, res) => {\n"
    "    const role = req.session?.user?.role;\n"
    "    if (role !== 'Admin' && role !== 'IT') return res.status(403).json({ error: 'Admin or IT only' });\n"
    "    try {\n"
    "        const rls = _wave32LastRls || (await getWave31Report()).summary || null;\n"
    "        _wave32LastRls = rls;\n"
    "        const firing = await wave32.getAlerts(pool, { rlsAudit: rls });\n"
    "        res.json({ alerts: firing, count: firing.length, scanned_at: new Date().toISOString() });\n"
    "    } catch (e) { res.status(500).json({ error: 'Server error' }); }\n"
    "});\n\n"
    "// ===== Wave 33: OPENAPI 3.0 SPEC + SWAGGER UI =====\n"
    "// READ-ONLY generator: scans server.js text for `app.METHOD('/api/...', ...)` registrations and\n"
    "// emits OpenAPI 3.0.3 + a Swagger UI HTML. The spec is computed once on boot and re-emitted on\n"
    "// demand at /openapi.json (no behavior change to existing /api routes; this is documentation-only).\n"
    "let _openapiSpecCache = null;\n"
    "let _openapiSpecCacheAt = 0;\n"
    "function getOpenApiSpec() {\n"
    "    const now = Date.now();\n"
    "    if (_openapiSpecCache && (now - _openapiSpecCacheAt) < 60000) return _openapiSpecCache;\n"
    "    try {\n"
    "        const src2 = fs.readFileSync(__filename, 'utf8');\n"
    "        _openapiSpecCache = openapiGenerator.generateOpenApi(src2, {\n"
    "            title: 'jumanaMedical ERP API',\n"
    "            version: process.env.npm_package_version || '1.0.0',\n"
    "            serverUrl: '/',\n"
    "        });\n"
    "        _openapiSpecCacheAt = now;\n"
    "        return _openapiSpecCache;\n"
    "    } catch (e) {\n"
    "        return {\n"
    "            openapi: '3.0.3',\n"
    "            info: { title: 'jumanaMedical ERP API', version: '1.0.0' },\n"
    "            paths: {},\n"
    "            components: { securitySchemes: {} },\n"
    "        };\n"
    "    }\n"
    "}\n"
    "function invalidateOpenApiCache() { _openapiSpecCache = null; _openapiSpecCacheAt = 0; }\n"
    "app.get('/openapi.json', (req, res) => {\n"
    "    const spec = getOpenApiSpec();\n"
    "    res.setHeader('Content-Type', 'application/json; charset=utf-8');\n"
    "    res.send(JSON.stringify(spec));\n"
    "});\n"
    "app.get('/api/docs', (req, res) => {\n"
    "    const html = openapiGenerator.generateSwaggerHtml({ specUrl: '/openapi.json', title: 'jumanaMedical ERP API' });\n"
    "    res.setHeader('Content-Type', 'text/html; charset=utf-8');\n"
    "    res.send(html);\n"
    "});\n\n"
    + old3
)
src = src.replace(old3, new3, 1)

with open(PATH, 'w') as f:
    f.write(src)

print('PATCHED: new line count =', src.count('\n') + 1)
