// =============================================================================
// 03-batch-record.ts
// -----------------------------------------------------------------------------
// Title:       Batch record — invoke 5 different PCC functions, then record each
// Description: Demonstrates a full TypeScript workflow against the PCC SDK:
//              typed `PccCallResult` / `PccRecordRequest` / `PccRecordResponse`,
//              an async loop, tenant_id + decisionId + created_by propagation,
//              and pretty-printing of the combined call + record results.
// Language:    TypeScript 5.x (ES2020, NodeNext).
// SDK used:    pcc-sdk (../typescript/pcc-sdk.ts).
// Run:         npx -y typescript@latest --noEmit sdk/examples/03-batch-record.ts
//              node --import tsx sdk/examples/03-batch-record.ts   (with tsx)
//              node --loader ts-node/esm  sdk/examples/03-batch-record.ts
// =============================================================================

/// <reference path="./node-shim.d.ts" />
import {
  PccClient,
  type PccModuleSlug,
  type PccFunctionName,
  type PccCallResult,
  type PccRecordRequest,
  type PccRecordResponse
} from "../typescript/pcc-sdk.js";

const TENANT_ID = "tnt_demo_batch_001";
const CREATED_BY = "agent-a@examples.local";

// Five (slug, fn, input) tuples — each is a real PCC module/function pair.
type Tuple = {
  slug: PccModuleSlug;
  fn: PccFunctionName;
  input: Record<string, unknown>;
  note: string;
};

const JOBS: Tuple[] = [
  { slug: "pcc-cardiology-ext102",   fn: "CardGenExt",  input: { hr: 80, age: 60, systolic_bp: 150 }, note: "Cardiology general risk" },
  { slug: "pcc-diabetes-ext102",     fn: "DiaT2Ext",    input: { hba1c: 7.4, fasting_glucose: 160 },    note: "Type 2 diabetes panel"   },
  { slug: "pcc-wound-care-ext102",   fn: "WCGenExt",    input: { stage: 2, area_cm2: 4.5 },            note: "Wound staging"           },
  { slug: "pcc-icu-ext99",           fn: "ICUSepsisExt",input: { sofa: 6, lactate: 2.1 },              note: "ICU SOFA snapshot"       },
  { slug: "pcc-neuro-ext14",         fn: "MultipleSclerosisExt", input: { gcs: 14, pupils: "PERRL" }, note: "Neuro status check"      }
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function runOne(client: PccClient, job: Tuple, idx: number) {
  console.log(`\n[${idx + 1}/${JOBS.length}] ${job.slug} :: ${job.fn}  (${job.note})`);

  // 1) Call the function (typed result)
  const callResult: PccCallResult<typeof job.input> = await client.call(job.slug, job.fn, job.input);
  console.log("  call.score   =", callResult.score);
  console.log("  call.ts      =", String(callResult.ts));
  console.log("  call.module  =", callResult.module);

  // 2) Build a typed RecordRequest, then send
  const req: PccRecordRequest = {
    tenant_id: TENANT_ID,
    decisionId: `dec-${Date.now()}-${idx}`,
    fn: job.fn,
    input: callResult.input as Record<string, unknown>,
    created_by: CREATED_BY
  };
  const rec: PccRecordResponse = await client.record(job.slug, req);
  console.log("  record.tenant_id =", rec.tenant_id ?? "(server did not echo tenant_id)");
  console.log("  record.decisionId=", rec.decisionId);
  console.log("  record.recorded  =", rec.recorded);
  console.log("  record.created_by=", rec.created_by);

  return { job, call: callResult, record: rec };
}

async function main(): Promise<void> {
  console.log("--- 03 Batch Record (TypeScript) ---");
  const client = new PccClient({ baseUrl: "http://localhost:3201" });

  let okCount = 0;
  let failCount = 0;
  for (let i = 0; i < JOBS.length; i++) {
    try {
      await runOne(client, JOBS[i], i);
      okCount++;
    } catch (err) {
      failCount++;
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ERROR on ${JOBS[i].slug}/${JOBS[i].fn}: ${msg}`);
    }
    // tiny pause so the log order matches the loop
    await sleep(50);
  }

  console.log("\n=== SUMMARY ===");
  console.log("tenant_id :", TENANT_ID);
  console.log("created_by:", CREATED_BY);
  console.log("ok        :", okCount);
  console.log("failed    :", failCount);
  if (failCount > 0) process.exitCode = 1;
}

main().catch((err: unknown) => {
  console.error("Fatal:", err);
  process.exit(1);
});
