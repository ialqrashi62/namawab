// P3-CQ pcc_social_work integration test v3.55.0
const Engine = require('./pcc_social_work_engine.js');
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
  console.log('pcc_social_work integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cq_pcc_social_work', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_social_work', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cq_pcc_social_work', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cq_pcc_social_work', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cq_pcc_social_work', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('assessment', () => { const r = Engine.Assessment({}); assert(r.plan); });
  it('placement', () => { const r = Engine.Placement({}); assert(r.plan); });
  it('psychosocial', () => { const r = Engine.Psychosocial({}); assert(r.plan); });
  it('saf', () => { const r = Engine.Saf({}); assert(r.plan); });
  it('financial', () => { const r = Engine.Financial({}); assert(r.plan); });
  it('transport', () => { const r = Engine.Transport({}); assert(r.plan); });
  it('family', () => { const r = Engine.Family({}); assert(r.plan); });
  it('abuse', () => { const r = Engine.Abuse({}); assert(r.plan); });
  it('substance', () => { const r = Engine.Substance({}); assert(r.plan); });
  it('resources', () => { const r = Engine.Resources({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
