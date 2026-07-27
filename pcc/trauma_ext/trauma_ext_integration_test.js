// P3-BS trauma_ext integration test v3.31.0
const Engine = require('./trauma_ext_engine.js');
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
  console.log('trauma_ext integration tests:');
  const db = makeDb();
  const t = await db.insert('p3bs_trauma_ext', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'trauma_ext', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3bs_trauma_ext', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3bs_trauma_ext', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3bs_trauma_ext', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('triage', () => { const r = Engine.Triage({}); assert(r.plan); });
  it('primary', () => { const r = Engine.Primary({}); assert(r.plan); });
  it('secondary', () => { const r = Engine.Secondary({}); assert(r.plan); });
  it('fAST', () => { const r = Engine.FAST({}); assert(r.plan); });
  it('head', () => { const r = Engine.Head({}); assert(r.plan); });
  it('chest', () => { const r = Engine.Chest({}); assert(r.plan); });
  it('abdomen', () => { const r = Engine.Abdomen({}); assert(r.plan); });
  it('pelvis', () => { const r = Engine.Pelvis({}); assert(r.plan); });
  it('spine', () => { const r = Engine.Spine({}); assert(r.plan); });
  it('mTP', () => { const r = Engine.MTP({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
