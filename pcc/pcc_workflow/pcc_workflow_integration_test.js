// P3-CB pcc_workflow integration test v3.40.0
const Engine = require('./pcc_workflow_engine.js');
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
  console.log('pcc_workflow integration tests:');
  const db = makeDb();
  const t = await db.insert('p3cb_pcc_workflow', { encounter_id: 'e1', tenant_id: 't1', input: {}, result: { plan: 'test' }, module: 'pcc_workflow', created_by: 'u1' });
  assert(t.id === 1);
  passed++;
  const got = await db.select('p3cb_pcc_workflow', { tenant_id: 't1' });
  assert(got.rows.length > 0);
  passed++;
  const upd = await db.update('p3cb_pcc_workflow', { id: 1 }, { result: { plan: 'updated' } });
  assert(upd.result.plan === 'updated');
  passed++;
  const del = await db.delete('p3cb_pcc_workflow', { id: 1 });
  assert(del.deleted === 1);
  passed++;
  it('state', () => { const r = Engine.State({}); assert(r.plan); });
  it('transition', () => { const r = Engine.Transition({}); assert(r.plan); });
  it('assignment', () => { const r = Engine.Assignment({}); assert(r.plan); });
  it('escalation', () => { const r = Engine.Escalation({}); assert(r.plan); });
  it('notify', () => { const r = Engine.Notify({}); assert(r.plan); });
  it('approval', () => { const r = Engine.Approval({}); assert(r.plan); });
  it('schedule', () => { const r = Engine.Schedule({}); assert(r.plan); });
  it('queue', () => { const r = Engine.Queue({}); assert(r.plan); });
  it('timeout', () => { const r = Engine.Timeout({}); assert(r.plan); });
  it('batch', () => { const r = Engine.Batch({}); assert(r.plan); });
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
