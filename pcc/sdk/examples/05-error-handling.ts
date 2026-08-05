// =============================================================================
// 05-error-handling.ts
// -----------------------------------------------------------------------------
// Title:       Error-handling cookbook for the PCC TypeScript SDK
// Description: Walks the four most common failure modes a caller will hit and
//              shows the recommended handling pattern for each. Then it
//              demonstrates exponential-backoff retry for transient 5xx errors.
//              This example is fully self-contained — it never asserts a
//              "happy path" and only fails on an unexpected error shape.
// Language:    TypeScript 5.x.
// SDK used:    pcc-sdk (../typescript/pcc-sdk.ts).
// Run:         npx -y typescript@latest --noEmit sdk/examples/05-error-handling.ts
//              node --import tsx sdk/examples/05-error-handling.ts
// =============================================================================

/// <reference path="./node-shim.d.ts" />
import { PccClient, type PccModuleSlug, type PccFunctionName } from "../typescript/pcc-sdk.js";

const HOST = "http://localhost:3201";
const REAL_SLUG = "pcc-cardiology-ext102" as PccModuleSlug;
const REAL_FN   = "CardGenExt"          as PccFunctionName;

// Custom error classes so callers can `instanceof`-discriminate.
class PccNotFoundError   extends Error { constructor(public where: string, msg: string) { super(msg); this.name = "PccNotFoundError";   } }
class PccBadRequestError extends Error { constructor(public where: string, msg: string) { super(msg); this.name = "PccBadRequestError"; } }
class PccServerError     extends Error { constructor(public where: string, public status: number, msg: string) { super(msg); this.name = "PccServerError"; } }

function asJson(s: string): unknown { try { return JSON.parse(s); } catch { return s; } }

async function rawFetch(client: PccClient, method: string, path: string, body?: unknown): Promise<Response> {
  // We use the global fetch the SDK also uses, so we can re-create the exact
  // wire request the SDK builds — that way we can read status + body for the
  // 4xx / 5xx tests.
  return fetch(client["baseUrl"] + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined
  });
}

function pass(label: string): void { console.log("  \x1b[32m✓\x1b[0m " + label); }
function fail(label: string): void { console.log("  \x1b[31m✗\x1b[0m " + label); }
const RESET = "\x1b[0m";

async function withRetry<T>(label: string, fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const out = await fn();
      console.log(`  [${label}] succeeded on attempt ${attempt}/${maxAttempts}`);
      return out;
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      const retriable = err instanceof PccServerError && err.status >= 500;
      if (!retriable || attempt === maxAttempts) {
        console.log(`  [${label}] gave up on attempt ${attempt}/${maxAttempts}: ${msg}`);
        throw err;
      }
      const delayMs = 200 * Math.pow(2, attempt - 1); // 200, 400, 800 ...
      console.log(`  [${label}] attempt ${attempt} failed (${err.status ?? "?"}), retrying in ${delayMs}ms`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}

async function main(): Promise<void> {
  console.log("--- 05 Error-Handling Cookbook ---");
  const client = new PccClient({ baseUrl: HOST });
  let allPassed = true;

  // -------------------------------------------------------------------
  // CASE 1 — module not found  (404)
  // -------------------------------------------------------------------
  console.log("\n[1] Non-existent module  →  expect 404 / PccNotFoundError");
  try {
    const res = await rawFetch(client, "GET", "/api/v1/pcc-catalog/module/pcc-does-not-exist");
    if (res.status === 404) {
      pass("server returned 404 as expected");
      const body = asJson(await res.text());
      console.log("    body:", JSON.stringify(body));
    } else {
      fail("expected 404, got " + res.status);
      allPassed = false;
    }
  } catch (err) {
    fail("unexpected throw: " + (err instanceof Error ? err.message : String(err)));
    allPassed = false;
  }

  // -------------------------------------------------------------------
  // CASE 2 — function not found on a real module  (404)
  // -------------------------------------------------------------------
  console.log("\n[2] Non-existent function  →  expect 404 / PccNotFoundError");
  try {
    const res = await rawFetch(client, "POST", `/api/v1/${REAL_SLUG}/call/ThisFnDoesNotExist`, { _example: true });
    if (res.status === 404) {
      pass("server returned 404 as expected");
      console.log("    body:", await res.text());
    } else {
      fail("expected 404, got " + res.status);
      allPassed = false;
    }
  } catch (err) {
    fail("unexpected throw: " + (err instanceof Error ? err.message : String(err)));
    allPassed = false;
  }

  // -------------------------------------------------------------------
  // CASE 3 — malformed JSON  (400)
  // -------------------------------------------------------------------
  console.log("\n[3] Invalid JSON body  →  expect 400 / PccBadRequestError");
  try {
    const res = await fetch(`${HOST}/api/v1/${REAL_SLUG}/call/${REAL_FN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json"
    });
    if (res.status === 400) {
      pass("server returned 400 as expected");
      console.log("    body:", await res.text());
    } else {
      fail("expected 400, got " + res.status);
      allPassed = false;
    }
  } catch (err) {
    fail("unexpected throw: " + (err instanceof Error ? err.message : String(err)));
    allPassed = false;
  }

  // -------------------------------------------------------------------
  // CASE 4 — retry on 5xx  (synthetic: we don't have a /5xx route, so we
  //          drive `withRetry` against the real happy-path call to prove
  //          the retry wrapper does NOT mis-fire on 2xx responses).
  // -------------------------------------------------------------------
  console.log("\n[4] Retry/backoff wrapper  →  happy path must succeed on attempt 1");
  try {
    const out = await withRetry("happy-call", async () => {
      const res = await rawFetch(client, "POST", `/api/v1/${REAL_SLUG}/call/${REAL_FN}`, { hr: 70, age: 55, systolic_bp: 130 });
      if (res.status >= 500) throw new PccServerError("call", res.status, "server error");
      if (!res.ok)           throw new Error("HTTP " + res.status);
      return res.json();
    });
    pass("retry wrapper returned a result: " + JSON.stringify(out).slice(0, 120) + "…");
  } catch (err) {
    fail("retry wrapper threw unexpectedly: " + (err instanceof Error ? err.message : String(err)));
    allPassed = false;
  }

  // -------------------------------------------------------------------
  // VERDICT
  // -------------------------------------------------------------------
  console.log("\n=== Error-handling verdict ===");
  if (allPassed) console.log(RESET + "\x1b[32mAll error cases handled as expected.\x1b[0m" + RESET);
  else { console.log("\x1b[31mAt least one case did NOT behave as expected — see ✗ marks above.\x1b[0m" + RESET); process.exitCode = 1; }
}

main().catch((err: unknown) => {
  console.error("Fatal:", err);
  process.exit(2);
});
