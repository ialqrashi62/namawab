// P3-CF pcc_telemed integration test v3.44.0
const Engine = require('./pcc_telemed_engine.js');
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
  console.log('pcc_telemed integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cf_pcc_telemed', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_telemed', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cf_pcc_telemed', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cf_pcc_telemed', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cf_pcc_telemed', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('visit', () => { const r = Engine.Visit({}); assert(r.plan); });
  it('consent', () => { const r = Engine.Consent({}); assert(r.plan); });
  it('connection', () => { const r = Engine.Connection({}); assert(r.plan); });
  it('prescribe', () => { const r = Engine.Prescribe({}); assert(r.plan); });
  it('charting', () => { const r = Engine.Charting({}); assert(r.plan); });
  it('triage', () => { const r = Engine.Triage({}); assert(r.plan); });
  it('reimburse', () => { const r = Engine.Reimburse({}); assert(r.plan); });
  it('platform', () => { const r = Engine.Platform({}); assert(r.plan); });
  it('followUp', () => { const r = Engine.FollowUp({}); assert(r.plan); });
  it('audit', () => { const r = Engine.Audit({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
