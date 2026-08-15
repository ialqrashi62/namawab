/**
 * Robotic CV Surgery — Seeder (dummy data)
 * Per AGENTS.md §2.2 rail #2 — NO PHI in commits.
 */

'use strict';

const db = require('./db_postgres');

const dummyPatients = [
  { id: 60001, age: 65, diagnosis: 'mitral_regurgitation', procedure: 'robotic_mitral_repair', device: 'davinci_xi', sts: 2.5, ef: 55 },
  { id: 60002, age: 80, diagnosis: 'aortic_stenosis', procedure: 'tavi', device: 'sapien_3', sts: 6.5, ef: 50 },
  { id: 60003, age: 70, diagnosis: 'mitral_regurgitation', procedure: 'mitraclip', device: 'mitraclip_g4', sts: 10.0, ef: 35 },
];

async function seed() {
  console.log('Seeding Robotic CV Surgery dummy data...');

  for (const p of dummyPatients) {
    await db.query(
      `INSERT INTO robotic_cv_cases (tenant_id, patient_id, diagnosis, procedure_type, device, sts_score, ef_pct, status, created_by)
       VALUES (1, $1, $2, $3, $4, $5, $6, 'pending', 1)
       ON CONFLICT DO NOTHING`,
      [p.id, p.diagnosis, p.procedure, p.device, p.sts, p.ef]
    );
  }

  console.log('Seeding complete (3 patients).');
  process.exit(0);
}

seed().catch((e) => {
  console.error('Seed failed:', e.message);
  process.exit(1);
});
