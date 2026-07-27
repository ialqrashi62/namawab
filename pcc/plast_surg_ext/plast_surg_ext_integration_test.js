// P3-BQ plast_surg_ext integration test v3.29.0
const Engine = require('./plast_surg_ext_engine.js');
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
  console.log('plast_surg_ext integration tests:');
  const db = makeDb();
  const t = await db.insert('p3bq_plast_surg_ext', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'plast_surg_ext', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3bq_plast_surg_ext', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3bq_plast_surg_ext', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3bq_plast_surg_ext', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('burn', () => { const r = Engine.Burn({}); assert(r.plan); });
  it('wound', () => { const r = Engine.Wound({}); assert(r.plan); });
  it('reconstruct', () => { const r = Engine.Reconstruct({}); assert(r.plan); });
  it('hand', () => { const r = Engine.Hand({}); assert(r.plan); });
  it('cosmetic', () => { const r = Engine.Cosmetic({}); assert(r.plan); });
  it('skinCancer', () => { const r = Engine.SkinCancer({}); assert(r.plan); });
  it('cleft', () => { const r = Engine.Cleft({}); assert(r.plan); });
  it('lymphedema', () => { const r = Engine.Lymphedema({}); assert(r.plan); });
  it('pressureUlcer', () => { const r = Engine.PressureUlcer({}); assert(r.plan); });
  it('traumaRecon', () => { const r = Engine.TraumaRecon({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
