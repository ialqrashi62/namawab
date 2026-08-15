/**
 * Advanced HF — Seeder (dummy data)
 * Per AGENTS.md §2.2 rail #2 — NO PHI in commits.
 */

'use strict';

const db = require('./db_postgres');

const dummyPatients = [
  { id: 80001, name: 'Test Patient 1', age: 65, ef: 30, nyha: 3, acc_stage: 'C' },
  { id: 80002, name: 'Test Patient 2', age: 72, ef: 25, nyha: 4, acc_stage: 'D' },
  { id: 80003, name: 'Test Patient 3', age: 58, ef: 50, nyha: 2, acc_stage: 'B' },
];

async function seed() {
  console.log('Seeding Advanced HF dummy data...');

  for (const p of dummyPatients) {
    await db.query(
      `INSERT INTO hf_cases (tenant_id, patient_id, ef_pct, nyha_class, acc_stage, nt_probnp, gdmt_score, intermacs, status, assigned_cardiologist)
       VALUES (1, $1, $2, $3, $4, 1500, 3, 4, 'active', 1)
       ON CONFLICT DO NOTHING`,
      [p.id, p.ef, p.nyha, p.acc_stage]
    );
  }

  for (const p of dummyPatients) {
    await db.query(
      `INSERT INTO hf_medications (tenant_id, patient_id, drug_name, pillar, dose, start_date, prescribed_by)
       VALUES (1, $1, 'Sacubitril/Valsartan', 'arni', '97/103 mg BID', CURRENT_DATE - 180, 1)
       ON CONFLICT DO NOTHING`,
      [p.id]
    );
  }

  console.log('Seeding complete (3 patients).');
  process.exit(0);
}

seed().catch((e) => {
  console.error('Seed failed:', e.message);
  process.exit(1);
});
