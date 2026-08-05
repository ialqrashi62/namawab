# @jumanasoft/pcc-sdk-nodejs

Node.js SDK (CommonJS + ESM) for the NamaMedical PCC Sandbox catalog.

- 1322 modules
- 10035 unique functions
- Zero dependencies
- TypeScript definitions included

## Install

```bash
npm install @jumanasoft/pcc-sdk-nodejs
```

## CommonJS

```javascript
const PccClient = require('@jumanasoft/pcc-sdk-nodejs');
const { SHORTCUTS } = require('@jumanasoft/pcc-sdk-nodejs');

const client = new PccClient({ baseUrl: "http://localhost:3201" });

// List modules
const catalog = await client.catalog();
console.log(catalog.count, "modules");

// Search
const results = await client.search("cardiology");
console.log(results.results[0]);

// Call
const r = await client.call("pcc-cardiology-ext102", "CardGenExt", { hr: 80 });
console.log(r.score);

// Record (with tenant)
const rec = await client.record("pcc-cardiology-ext102", {
  tenant_id: "tenant_001",
  fn: "CardGenExt",
  input: { hr: 80 }
});
console.log(rec.recorded);

// Health
const health = await client.health();
console.log(health.status);
```

## ESM

```javascript
import PccClient, { SHORTCUTS } from '@jumanasoft/pcc-sdk-nodejs';

const client = new PccClient({ baseUrl: "http://localhost:3201" });
const r = await client.call("pcc-cardiology-ext102", "CardGenExt", { hr: 80 });
```

## API

| Method | Description |
|---|---|
| `catalog()` | List all 1322 modules |
| `categories()` | Modules grouped by 255 categories |
| `module(slug)` | Module detail with functions |
| `search(query)` | Full-text search |
| `lookup(fn)` | Find modules exposing a function |
| `diagnostics()` | Server diagnostics |
| `version()` | Version info |
| `listModule(slug)` | Module function list |
| `call(slug, fn, input)` | Invoke function |
| `record(slug, req)` | Record with tenant |
| `health()` | Health check |

Generated for PCC Catalog v3.316.0 on 2026-07-29T05:31:49.583Z