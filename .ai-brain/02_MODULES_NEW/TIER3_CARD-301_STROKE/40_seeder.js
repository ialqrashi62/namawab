/**
 * Stroke Center — Seeder (Dummy Data)
 * Per AGENTS.md §2.2 rail #2 — NO PHI in commits.
 * All patient data is dummy/test data only.
 */

'use strict';

const db = require('./db_postgres');

const dummyPatients = [
  { id: 90001, name: 'Test Patient 1', age: 65, gender: 'male', mrn: 'TEST-001' },
  { id: 90002, name: 'Test Patient 2', age: 72, gender: 'female', mrn: 'TEST-002' },
  { id: 90003, name: 'Test Patient 3', age: 58, gender: 'male', mrn: 'TEST-003' },
];

async function seed() {
  console.log('Seeding stroke center dummy data...');

  // 1. Stroke cases
  for (const p of dummyPatients) {
    await db.query(
      `INSERT INTO stroke_cases (tenant_id, patient_id, stroke_type, arrival_time, last_known_well, nihss_score, ct_findings, aspects_score, code_stroke_activated, admitted_to_stroke_unit, status)
       VALUES (1, $1, $2, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '3 hours', $3, 'no_acute_hemorrhage', 8, true, true, 'active')
       ON CONFLICT DO NOTHING`,
      [p.id, 'AIS', Math.floor(Math.random() * 20) + 1]
    );
  }

  // 2. Thrombolysis treatments
  for (const p of dummyPatients) {
    await db.query(
      `INSERT INTO stroke_thrombolysis (tenant_id, patient_id, agent, dose_mg, weight_kg, administered_at, door_to_needle_minutes, nihss_before, consent_obtained, ordering_physician)
       VALUES (1, $1, 'tenecteplase', 17.5, 70, NOW() - INTERVAL '100 minutes', 45, 12, true, 1)
       ON CONFLICT DO NOTHING`,
      [p.id]
    );
  }

  // 3. Thrombectomy
  await db.query(
    `INSERT INTO stroke_thrombectomy (tenant_id, patient_id, procedure_time, door_to_groin_minutes, tici_score, mrs_24h, mrs_7d, operator)
     VALUES (1, 90001, NOW() - INTERVAL '90 minutes', 75, 3, 2, 1, 'Test Operator')
     ON CONFLICT DO NOTHING`
  );

  // 4. Imaging
  for (const p of dummyPatients) {
    await db.query(
      `INSERT INTO stroke_imaging (tenant_id, patient_id, imaging_type, performed_at, findings, aspects_score, occlusion_site, radiologist)
       VALUES (1, $1, 'CT', NOW() - INTERVAL '110 minutes', 'No acute hemorrhage', 8, 'M1', 'Test Radiologist')
       ON CONFLICT DO NOTHING`,
      [p.id]
    );
  }

  // 5. Follow-up
  for (const p of dummyPatients) {
    await db.query(
      `INSERT INTO stroke_followup (tenant_id, patient_id, followup_date, mrs_score, medication_adherent, bp_at_goal, recurrent_event, rehab_status)
       VALUES (1, $1, CURRENT_DATE - INTERVAL '30 days', 2, true, true, false, 'Outpatient PT')
       ON CONFLICT DO NOTHING`,
      [p.id]
    );
  }

  console.log('Seeding complete (3 patients × 5 tables).');
  process.exit(0);
}

seed().catch((e) => {
  console.error('Seed failed:', e.message);
  process.exit(1);
});
