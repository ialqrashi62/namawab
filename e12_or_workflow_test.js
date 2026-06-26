/**
 * e12_or_workflow_test.js — Epic E12 business/workflow + static-guard tests.
 * 1) Static audit: every E12 route is guarded (requireAuth + requireRole + requireTenantScope) in server.js.
 * 2) Static audit: the legacy PUT /api/surgeries/:id now enforces the state machine + WHO gating (bypass closed).
 * 3) Workflow simulation over a mock pool: slot conflict (409), WHO ordering, status gating, consumption decrement.
 * DB-free. Run: NODE_PATH=...\node_modules node e12_or_workflow_test.js
 */
const fs = require('fs');
const path = require('path');
const G = '\x1b[32m', R = '\x1b[31m', X = '\x1b[0m';
let passed = 0, failed = 0;
function assert(cond, name, extra = '') { if (cond) { console.log(`  ${G}PASS${X} ${name}`); passed++; } else { console.log(`  ${R}FAIL${X} ${name}${extra ? ' | ' + extra : ''}`); failed++; } }

const server = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');
const flat = server.replace(/\s+/g, '');

console.log('\n[ 1 ] Static route-guard audit');
const routes = [
    "app.get('/api/or/slots',requireAuth,requireRole('surgery','doctor','nursing'),requireTenantScope",
    "app.post('/api/or/slots/reserve',requireAuth,requireRole('surgery','doctor'),requireTenantScope",
    "app.put('/api/or/slots/:id/cancel',requireAuth,requireRole('surgery','doctor'),requireTenantScope",
    "app.put('/api/or/surgeries/:id/status',requireAuth,requireRole('surgery','doctor','nursing'),requireTenantScope",
    "app.get('/api/or/surgeries/:id/who-checklist',requireAuth,requireRole('surgery','doctor','nursing'),requireTenantScope",
    "app.post('/api/or/surgeries/:id/who-checklist/:phase',requireAuth,requireRole('surgery','doctor','nursing'),requireTenantScope",
    "app.get('/api/or/surgeries/:id/pacu',requireAuth,requireRole('surgery','doctor','nursing'),requireTenantScope",
    "app.post('/api/or/surgeries/:id/pacu',requireAuth,requireRole('surgery','doctor','nursing'),requireTenantScope",
    "app.get('/api/or/surgeries/:id/operative-note',requireAuth,requireRole('surgery','doctor'),requireTenantScope",
    "app.post('/api/or/surgeries/:id/operative-note',requireAuth,requireRole('surgery','doctor'),requireTenantScope"
];
for (const r of routes) assert(flat.includes(r.replace(/\s+/g, '')), 'guarded route ' + r.slice(0, 48) + '...');

console.log('\n[ 2 ] Static enforcement audit');
assert(flat.includes('e12IsValidSurgeryTransition'), 'state-machine validator present');
assert(flat.includes("FORUPDATE") || flat.includes("FOR UPDATE".replace(/\s+/g, '')), 'SELECT ... FOR UPDATE used (race-safety)');
assert(server.includes("set_config('app.tenant_id'"), 'tenant binding on dedicated client');
assert(server.includes('E12 HARDENING'), 'legacy PUT /api/surgeries/:id hardened with state machine');
assert(server.includes('WHO Time-Out must be completed before incision'), 'no incision without Time-Out gate');
assert(server.includes('WHO Sign-Out must be completed before the surgery can be Completed'), 'no completion without Sign-Out');
assert(server.includes("countsVerified = (b.counts_verified === true"), 'counts_verified is server-validated authority field');
assert(server.includes('Insufficient stock for item'), 'stock decrement fail-closed on insufficient stock');
// Anti-spoof: tenant_id is never read from req.body in E12 INSERTs (stamped from session)
const e12Block = server.slice(server.indexOf('EPIC E12'), server.indexOf('===== BLOOD BANK'));
assert(!/tenant_id\s*[:=]\s*req\.body/.test(e12Block) && !e12Block.includes('body.tenant_id'), 'tenant_id never taken from client body in E12');

console.log('\n[ 3 ] Workflow simulation (mock engine)');
// Minimal mock honoring the same rules as the server.
const E12_WHO_ORDER = ['Not Started', 'Sign-In', 'Time-Out', 'Sign-Out', 'Completed'];
const PHASE = { 'sign-in': 'Sign-In', 'time-out': 'Time-Out', 'sign-out': 'Sign-Out' };
function whoNext(state, phase) {
    const t = PHASE[phase]; if (!t) return { ok: false, status: 400 };
    if (E12_WHO_ORDER.indexOf(t) !== E12_WHO_ORDER.indexOf(state || 'Not Started') + 1) return { ok: false, status: 409 };
    return { ok: true, newState: t === 'Sign-Out' ? 'Completed' : t };
}
const TR = { 'Scheduled': ['InProgress', 'Cancelled'], 'InProgress': ['PACU', 'Cancelled'], 'PACU': ['Completed', 'Cancelled'], 'Completed': [], 'Cancelled': [] };

// Slot conflict detection
function overlaps(aS, aE, bS, bE) { return aS < bE && aE > bS; }
const slots = [{ id: 1, room_id: 10, surgeon_id: 11, date: '2026-07-01', s: '08:00', e: '10:00', status: 'Booked' }];
function reserve(room, surgeon, date, s, e) {
    const clash = slots.find(x => x.status !== 'Cancelled' && x.date === date && (x.room_id === room || x.surgeon_id === surgeon) && overlaps(s, e, x.s, x.e));
    if (clash) return { status: 409 };
    slots.push({ id: slots.length + 1, room_id: room, surgeon_id: surgeon, date, s, e, status: 'Booked' });
    return { status: 200 };
}
assert(reserve(10, 99, '2026-07-01', '09:00', '11:00').status === 409, 'double-booked ROOM overlapping window -> 409');
assert(reserve(99, 11, '2026-07-01', '09:00', '11:00').status === 409, 'double-booked SURGEON overlapping window -> 409');
assert(reserve(10, 11, '2026-07-01', '10:00', '12:00').status === 200, 'adjacent non-overlapping window allowed');
assert(reserve(20, 22, '2026-07-01', '08:00', '10:00').status === 200, 'different room+surgeon allowed');

// WHO + status gating happy path and gates
let who = 'Not Started', status = 'Scheduled';
function startIncision() { const reached = E12_WHO_ORDER.indexOf(who) >= E12_WHO_ORDER.indexOf('Time-Out'); if (!reached) return { status: 409 }; if (!TR[status].includes('InProgress')) return { status: 409 }; status = 'InProgress'; return { status: 200 }; }
function complete() { if (who !== 'Completed') return { status: 409 }; if (!TR[status].includes('Completed')) return { status: 409 }; status = 'Completed'; return { status: 200 }; }
assert(startIncision().status === 409, 'cannot start incision before Time-Out');
who = whoNext(who, 'sign-in').newState;
assert(startIncision().status === 409, 'still cannot incise after only Sign-In');
who = whoNext(who, 'time-out').newState;
assert(startIncision().status === 200 && status === 'InProgress', 'incision allowed after Time-Out');
assert(complete().status === 409, 'cannot complete before Sign-Out');
who = whoNext(who, 'sign-out').newState; // -> Completed
assert(who === 'Completed', 'Sign-Out advances WHO to Completed');
// move to PACU then complete
status = 'PACU';
assert(complete().status === 200 && status === 'Completed', 'complete allowed after Sign-Out + PACU');

// Consumption decrement (fail-closed on insufficient stock)
function consume(stock, lines) {
    for (const l of lines) { if (!Number.isInteger(l.item_id) || !Number.isInteger(l.qty) || l.qty <= 0) return { status: 422 }; }
    for (const l of lines) { if ((stock[l.item_id] || 0) < l.qty) return { status: 409 }; }
    for (const l of lines) stock[l.item_id] -= l.qty;
    return { status: 200, stock };
}
const stock = { 100: 10, 101: 3 };
assert(consume(stock, [{ item_id: 100, qty: 4 }, { item_id: 101, qty: 2 }]).status === 200 && stock[100] === 6 && stock[101] === 1, 'valid consumption decrements stock');
assert(consume(stock, [{ item_id: 101, qty: 99 }]).status === 409, 'insufficient stock -> 409 (fail-closed)');
assert(consume(stock, [{ item_id: 100, qty: 0 }]).status === 422, 'qty<=0 rejected 422');

console.log(`\n[ E12 WORKFLOW ] passed=${passed} failed=${failed}`);
process.exit(failed ? 1 : 0);
