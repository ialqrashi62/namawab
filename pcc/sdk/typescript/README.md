# @jumanasoft/pcc-sdk

TypeScript SDK for the NamaMedical PCC Sandbox catalog (1322 modules, 10035 functions).

## Installation

```bash
npm install @jumanasoft/pcc-sdk
```

## Usage

```typescript
import { PccClient } from "@jumanasoft/pcc-sdk";

const client = new PccClient({ baseUrl: "http://localhost:3201" });

// List all modules
const catalog = await client.catalog();
console.log("Modules:", catalog.count);

// Search
const results = await client.search("cardiology");
console.log("Top:", results.results[0]?.module);

// Call a function
const result = await client.call("pcc-cardiology-ext102", "CardGenExt", {
  patientId: "pt_001",
  heartRate: 80
});
console.log("Score:", result.score);

// Record with tenant
const recorded = await client.record("pcc-cardiology-ext102", {
  tenant_id: "tenant_001",
  fn: "CardGenExt",
  input: { heartRate: 80 }
});
console.log("Recorded:", recorded.recorded);

// Diagnostics
const diag = await client.diagnostics();
console.log("Uptime:", diag.uptime_seconds, "s");
console.log("Memory:", diag.process.memory.heapUsed);
```

## API Surface

### Catalog
- `client.catalog()` — all modules
- `client.categories()` — grouped by category
- `client.module(slug)` — module detail

### Search
- `client.search(query)` — full-text search
- `client.lookup(fn)` — find modules by function

### Module operations
- `client.listModule(slug)` — list functions
- `client.call(slug, fn, input)` — invoke function
- `client.record(slug, req)` — record with tenant

### Diagnostics
- `client.diagnostics()` — full diagnostics
- `client.version()` — version info
- `client.health()` — health check

## Module Shortcuts

Each module has a typed shortcut with slug, module name, and functions list.

```typescript
import { PccClinicalDx, PccCardiologyExt102 } from "@jumanasoft/pcc-sdk";

console.log(PccClinicalDx.functions); // ["Differential", "Workup", ...]
```

## Build

```bash
npm install
npm run build
```

Generated for PCC Catalog v3.316.0 on 2026-07-29T05:29:09.971Z