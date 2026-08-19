'use strict';
/**
 * BCMA Integration Test
 * Tests: scan flow, allergy block, high-alert 2-nurse verify
 */
const request = require('supertest');
const app = require('./bcma_service');
const db = require('./db_postgres');

describe('BCMA Integration', () => {
  let token;
  beforeAll(async () => { token = 'TEST-TOKEN'; });

  test('POST /api/bcma/scan — normal drug passes', async () => {
    const res = await request(app)
      .post('/api/bcma/scan')
      .set('Authorization', `Bearer ${token}`)
      .send({ patient_barcode: 'PT-001', drug_barcode: 'DG-AMOX-500', dose: '500mg', route: 'PO', scheduled_at: new Date().toISOString(), nurse_id: 1 });
    expect(res.status).toBe(200);
    expect(res.body.result.five_rights.pass).toBe(true);
  });

  test('POST /api/bcma/scan — allergy block', async () => {
    const res = await request(app)
      .post('/api/bcma/scan')
      .set('Authorization', `Bearer ${token}`)
      .send({ patient_barcode: 'PT-002', drug_barcode: 'DG-PEN-500', dose: '500mg', route: 'PO', scheduled_at: new Date().toISOString(), nurse_id: 1, patient_allergies: ['penicillin'] });
    expect(res.status).toBe(409);
    expect(res.body.result.allergy_blocked).toBe(true);
  });

  test('POST /api/bcma/scan — high-alert requires witness', async () => {
    const res = await request(app)
      .post('/api/bcma/scan')
      .set('Authorization', `Bearer ${token}`)
      .send({ patient_barcode: 'PT-001', drug_barcode: 'DG-INSULIN-100', dose: '10U', route: 'SC', scheduled_at: new Date().toISOString(), nurse_id: 1 });
    expect(res.body.result.witness_required).toBe(true);
  });

  test('POST /api/bcma/override — requires reason', async () => {
    const res = await request(app)
      .post('/api/bcma/override')
      .set('Authorization', `Bearer ${token}`)
      .send({ mar_id: 'MAR-X', reason_code: '', notes: '', witness_id: 2, approved_by: 1 });
    expect(res.status).toBe(400);
  });
});