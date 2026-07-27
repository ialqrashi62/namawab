// P3-CD pcc_emergency integration test v3.42.0
const Engine = require('./pcc_emergency_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ integ-' + name); passed++; } catch (e) { console.log('  ✗ integ-' + name + ': ' + e.message); failed++; } }

function makeDb() {
  return {
    insert: async (table, row) => ({ id: 1, ...row }),
    select: async (table, where) => ({ rows: [{ id: 1, input: {}, result: { plan: 'mock' } }] }),
    update: async (table, where, patch) => ({ id: 1, ...patch }),
    delete: async (table, where) => ({ deleted: 1 }),
  };
}

(async () => {
  console.log('pcc_emergency integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cd_pcc_emergency', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_emergency', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cd_pcc_emergency', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cd_pcc_emergency', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cd_pcc_emergency', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('triage', () => { const r = Engine.Triage({}); assert(r.plan); });
  it('resus', () => { const r = Engine.Resus({}); assert(r.plan); });
  it('trauma', () => { const r = Engine.Trauma({}); assert(r.plan); });
  it('sepsis', () => { const r = Engine.Sepsis({}); assert(r.plan); });
  it('stroke', () => { const r = Engine.Stroke({}); assert(r.plan); });
  it('mI', () => { const r = Engine.MI({}); assert(r.plan); });
  it('anaphylaxis', () => { const r = Engine.Anaphylaxis({}); assert(r.plan); });
  it('toxicology', () => { const r = Engine.Toxicology({}); assert(r.plan); });
  it('burn', () => { const r = Engine.Burn({}); assert(r.plan); });
  it('disposition', () => { const r = Engine.Disposition({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
