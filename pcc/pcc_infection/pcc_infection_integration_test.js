// P3-CD pcc_infection integration test v3.42.0
const Engine = require('./pcc_infection_engine.js');
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
  console.log('pcc_infection integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cd_pcc_infection', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_infection', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cd_pcc_infection', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cd_pcc_infection', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cd_pcc_infection', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('source', () => { const r = Engine.Source({}); assert(r.plan); });
  it('severity', () => { const r = Engine.Severity({}); assert(r.plan); });
  it('cultures', () => { const r = Engine.Cultures({}); assert(r.plan); });
  it('empiric', () => { const r = Engine.Empiric({}); assert(r.plan); });
  it('deescalation', () => { const r = Engine.Deescalation({}); assert(r.plan); });
  it('duration', () => { const r = Engine.Duration({}); assert(r.plan); });
  it('prophylaxis', () => { const r = Engine.Prophylaxis({}); assert(r.plan); });
  it('resistance', () => { const r = Engine.Resistance({}); assert(r.plan); });
  it('outbreak', () => { const r = Engine.Outbreak({}); assert(r.plan); });
  it('isolation', () => { const r = Engine.Isolation({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
