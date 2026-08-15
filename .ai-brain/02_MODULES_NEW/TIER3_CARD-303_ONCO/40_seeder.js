/**
 * Cardio-Onc — Seeder (dummy data)
 * Per AGENTS.md §2.2 rail #2 — NO PHI in commits.
 */

'use strict';

const db = require('./db_postgres');

const dummyPatients = [
  { id: 70001, name: 'Test Patient 1', age: 62, cancer: 'breast', therapy: 'anthracycline', ef: 60, gls: -18, dose: 250 },
  { id: 70002, name: 'Test Patient 2', age: 70, cancer: 'lung', therapy: 'immunotherapy', ef: 55, gls: -16, dose: 0 },
  { id: 70003, name: 'Test Patient 3', age: 55, cancer: 'lymphoma', therapy: 'anthracycline', ef: 50, gls: -14, dose: 400 },
];

async function seed() {
  console.log('Seeding Cardio-Onc dummy data...');

  for (const p of dummyPatients) {
    await db.query(
      `INSERT INTO cardio_onc_cases (tenant_id, patient_id, cancer_type, cancer_stage, cancer_therapy, baseline_ef_pct, baseline_gls_pct, hfa_icos_risk, status, created_by)
       VALUES (1, $1, $2, 'II', $3, $4, $5, 'moderate', 'active', 1)
       ON CONFLICT DO NOTHING`,
      [p.id, p.cancer, p.therapy, p.ef, p.gls]
    );
  }

  console.log('Seeding complete (3 patients).');
  process.exit(0);
}

seed().catch((e) => {
  console.error('Seed failed:', e.message);
  process.exit(1);
});
