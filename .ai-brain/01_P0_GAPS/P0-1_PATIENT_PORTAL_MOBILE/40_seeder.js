/**
 * Patient Portal — Seeder (dummy data)
 * Per AGENTS.md §2.2 rail #2 — NO PHI in commits.
 */

'use strict';

const db = require('./db_postgres');

const dummyPatients = [
  { id: 90001, name: 'Test Patient 1', age: 35, specialty: 'cardiology', modality: 'video' },
  { id: 90002, name: 'Test Patient 2', age: 62, specialty: 'cardiology', modality: 'in_person' },
  { id: 90003, name: 'Test Patient 3', age: 45, specialty: 'endocrinology', modality: 'video' },
];

async function seed() {
  console.log('Seeding Patient Portal dummy data...');

  for (const p of dummyPatients) {
    await db.query(
      `INSERT INTO pp_appointments (tenant_id, patient_id, facility_id, specialty, appointment_date, appointment_time, status, appointment_id, insurance_approved, cost, teleconsult_url, created_by)
       VALUES (1, $1, 1, $2, CURRENT_DATE + 7, '10:00', 'confirmed', $3, true, 0, $4, 1)
       ON CONFLICT (appointment_id) DO NOTHING`,
      [p.id, p.specialty, `APT-${p.id}-${Date.now()}`, p.modality === 'video' ? `https://visit.jumanasoft.com/${p.id}` : null]
    );

    await db.query(
      `INSERT INTO pp_vitals (tenant_id, patient_id, type, value, unit, abnormal, measured_at, source)
       VALUES (1, $1, 'systolic_bp', 120, 'mmHg', false, NOW(), 'self_reported')
       ON CONFLICT DO NOTHING`,
      [p.id]
    );
  }

  console.log('Seeding complete (3 patients, 3 appointments, 3 vitals).');
  process.exit(0);
}

seed().catch((e) => {
  console.error('Seed failed:', e.message);
  process.exit(1);
});
