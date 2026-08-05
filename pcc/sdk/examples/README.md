# PCC SDK Examples — Real-world cookbook

> Five copy-pasteable use-cases that exercise the **PCC Sandbox v3.316.x**
> (1,322 modules · 10,035 functions) running on `http://localhost:3201`.
>
> All examples are **stdlib-only** (Node 18 `http`, Python 3.8 `urllib`) or
> use the bundled TypeScript SDK. Nothing here requires a build step to read;
> running them is one command away.

---

## 0. Prerequisites

```bash
# 1) Start the PCC sandbox (one terminal)
node pcc/mock-server/server.js        # listens on :3201
# 2) Confirm it is up
curl -s http://localhost:3201/health  # → {"status":"ok",...}
```

The TypeScript examples only need a TS toolchain to *type-check* — the SDK
itself is plain TS, and the examples use no extra dependencies.

---

## 1. Examples

| # | File | Language | What it shows |
|---|---|---|---|
| 01 | [`01-cardiology-risk-score.js`](01-cardiology-risk-score.js) | Node.js (raw `http`) | Single function call → `pcc-cardiology-ext102 / CardGenExt` with `{hr, age, systolic_bp}`, colored risk band. |
| 02 | [`02-search-and-call.py`](02-search-and-call.py) | Python (raw `urllib`) | Search catalog for "diabetes" → top hit → first function → call it. Pretty-prints every step. |
| 03 | [`03-batch-record.ts`](03-batch-record.ts) | TypeScript (SDK) | Typed `PccCallResult` / `PccRecordRequest` / `PccRecordResponse` over a 5-module batch with `tenant_id`. |
| 04 | [`04-multi-tenant-isolation.js`](04-multi-tenant-isolation.js) | Node.js (SDK) | Same call under 3 different `tenant_id`s, asserts that each `/record` response preserves its own `tenant_id` + `decisionId` + `created_by`. |
| 05 | [`05-error-handling.ts`](05-error-handling.ts) | TypeScript (SDK) | 404 on bad module, 404 on bad function, 400 on bad JSON, and a typed `withRetry` exponential-backoff wrapper for 5xx. |

---

## 2. Run them

```bash
# 01 — Node, raw http
node sdk/examples/01-cardiology-risk-score.js

# 02 — Python, stdlib
python sdk/examples/02-search-and-call.py              # default term: "diabetes"
python sdk/examples/02-search-and-call.py hypertension # custom term

# 03 — TypeScript (type-check only)
npx -y typescript@latest --noEmit sdk/examples/03-batch-record.ts
# or run it with tsx:
npx -y tsx sdk/examples/03-batch-record.ts

# 04 — Node + SDK
node sdk/examples/04-multi-tenant-isolation.js

# 05 — TypeScript (type-check only)
npx -y typescript@latest --noEmit sdk/examples/05-error-handling.ts
# or run it with tsx:
npx -y tsx sdk/examples/05-error-handling.ts
```

---

## 3. Compile / syntax checks (no server required)

```bash
# Node: every .js file passes --check
node --check sdk/examples/01-cardiology-risk-score.js
node --check sdk/examples/04-multi-tenant-isolation.js

# Python: byte-compile
python -m py_compile sdk/examples/02-search-and-call.py

# TypeScript: --noEmit type-check
# (the local node-shim.d.ts provides ambient `process` typing without
#  requiring @types/node as a project dependency)
npx -y typescript@latest --noEmit --target ES2020 --module ESNext \
  --moduleResolution bundler --allowImportingTsExtensions --strict --skipLibCheck \
  sdk/examples/node-shim.d.ts sdk/examples/03-batch-record.ts

npx -y typescript@latest --noEmit --target ES2020 --module ESNext \
  --moduleResolution bundler --allowImportingTsExtensions --strict --skipLibCheck \
  sdk/examples/node-shim.d.ts sdk/examples/05-error-handling.ts
```

---

## 4. Conventions

- **No abbreviations** — every file is complete and copy-pasteable.
- **No secrets** — none of the examples read `.env`, tokens, or PHI.
- **Tenant safety** — example 04 explicitly asserts that `tenant_id` is *not*
  crossed; the other examples either run unauthenticated (sandbox mode) or
  pass a synthetic `tnt_demo_*` value.
- **Error handling** — every example catches network/HTTP errors and prints a
  actionable message ("is the PCC sandbox running on :3201 ?").

---

## 5. Where the SDKs live

```
sdk/
├── nodejs/      →  PccClient  (CJS + ESM, pcc-sdk.{js,mjs,d.ts})
├── typescript/  →  PccClient  + full Pcc* type unions (pcc-sdk.ts)
├── python/      →  PccClient  (pcc_sdk.py, stdlib only)
├── go/  java/  php/  ruby/  rust/   (other languages, same surface)
└── examples/    →  this folder
```

---

_Last regenerated: 2026-07-29 (PCC Catalog v3.316.0, 1322 modules)._
