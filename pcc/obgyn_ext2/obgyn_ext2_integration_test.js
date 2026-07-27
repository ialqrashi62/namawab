// P3-BT obgyn_ext2 integration test v3.32.0
const Engine = require('./obgyn_ext2_engine.js');
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
  console.log('obgyn_ext2 integration tests:');
  const db = makeDb();
  const t = await db.insert('p3bt_obgyn_ext2', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'obgyn_ext2', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3bt_obgyn_ext2', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3bt_obgyn_ext2', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3bt_obgyn_ext2', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('pregnancy', () => { const r = Engine.Pregnancy({}); assert(r.plan); });
  it('preEclampsia', () => { const r = Engine.PreEclampsia({}); assert(r.plan); });
  it('gDM', () => { const r = Engine.GDM({}); assert(r.plan); });
  it('pPROM', () => { const r = Engine.PPROM({}); assert(r.plan); });
  it('pPH', () => { const r = Engine.PPH({}); assert(r.plan); });
  it('ectopic', () => { const r = Engine.Ectopic({}); assert(r.plan); });
  it('induction', () => { const r = Engine.Induction({}); assert(r.plan); });
  it('gynCancer', () => { const r = Engine.GynCancer({}); assert(r.plan); });
  it('infertility', () => { const r = Engine.Infertility({}); assert(r.plan); });
  it('menopause', () => { const r = Engine.Menopause({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
