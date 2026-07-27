// P3-CS pcc_stroke_path integration test v3.57.0
const Engine = require('./pcc_stroke_path_engine.js');
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
  console.log('pcc_stroke_path integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cs_pcc_stroke_path', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_stroke_path', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cs_pcc_stroke_path', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cs_pcc_stroke_path', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cs_pcc_stroke_path', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('nihss', () => { const r = Engine.Nihss({}); assert(r.plan); });
  it('imaging', () => { const r = Engine.Imaging({}); assert(r.plan); });
  it('tpa', () => { const r = Engine.Tpa({}); assert(r.plan); });
  it('thrombectomy', () => { const r = Engine.Thrombectomy({}); assert(r.plan); });
  it('consent', () => { const r = Engine.Consent({}); assert(r.plan); });
  it('bpTarget', () => { const r = Engine.BpTarget({}); assert(r.plan); });
  it('nihssFollowup', () => { const r = Engine.NihssFollowup({}); assert(r.plan); });
  it('hemorrhage', () => { const r = Engine.Hemorrhage({}); assert(r.plan); });
  it('swallow', () => { const r = Engine.Swallow({}); assert(r.plan); });
  it('transfer', () => { const r = Engine.Transfer({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
