# Wave 33 — OpenAPI 3.0 Spec Generation (Closeout)

**Date:** 2026-08-05
**Owner:** Copilot
**Status:** ✅ Complete

---

## 1. Goal

Generate a vendor-neutral OpenAPI 3.0.3 description of every `/api/*` route
mounted in `server.js`, served at `/openapi.json` with an interactive
`/api/docs` Swagger UI. No behavior change to any existing endpoint.

---

## 2. What ships

| File | Purpose |
|---|---|
| `namaweb/openapi_generator.js` | Static-source scanner. Reads `server.js` text via `fs.readFileSync` (NEVER `require()`), regex-matches `app.METHOD('/api/...', …)`, emits OpenAPI 3.0.3. |
| `namaweb/openapi_generator_test.js` | 12 unit tests — all PASS. |
| `namaweb/openapi.generated.json` | Pre-baked 623-path spec. |
| `server.js` | + `openapiGenerator` require, + `/openapi.json` GET, + `/api/docs` GET (inline HTML Swagger UI; no CDN). |
| `WAVE_33_OPENAPI_AR.md` | This report. |

---

## 3. Design choices

- **Read-only scanner.** No `require()`, no `eval()`. Pure regex on source text.
- **Path params:** `:id` → `{id}` (Express → OpenAPI).
- **Security schemes:** `sessionCookie` (cookie auth) + `bearerToken` (X-API-Token for
  vendor/system endpoints).
- **Tag auto-assignment:** `/api/patients/*` → `patients`, `/api/lab/*` → `lab`, etc.
- **60s in-process cache.** `server.js` is ~26.5k lines — scanning on every request is
  too costly. Cache invalidation hook (`invalidateOpenApiCache`) is exported for ops.
- **Last-resort fallback spec** so `/openapi.json` never 500s even if the source scan throws.

---

## 4. Verification

```
$ node --check server.js          → SYNTAX OK
$ node --check openapi_generator.js → SYNTAX OK
$ node openapi_generator_test.js  → 12/12 PASS
$ smoke: node -e "require('./openapi_generator').generateOpenApi(src, …)"
  paths: 623
  sample path: /api/csp-report
  openapi version: 3.0.3
```

The pre-baked `openapi.generated.json` matches the live spec generation.

---

## 5. Safety rails respected

- **No PHI / secrets / tokens in spec:** only path + method + parameter shape.
- **Zero behavior change:** all existing `/api/*` routes unchanged.
- **Tenant isolation untouched:** no DB query is added; the scanner is purely text.
- **CSP friendly:** `/api/docs` Swagger HTML is self-contained (no remote CDN), so
  the existing CSP `default-src 'self'` is honored.

---

## 6. Activation

Routes are mounted in `server.js` and effective on next PM2 restart.

```bash
curl http://localhost:3000/openapi.json   # 200 application/json
curl http://localhost:3000/api/docs       # 200 text/html (Swagger UI)
```
