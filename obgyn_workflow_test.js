/**
 * obgyn_workflow_test.js — Epic E14 OB/Maternity business-workflow test (DB-free).
 * Simulates the full maternity journey against a mock pool and the real ob_engine:
 *   register pregnancy (GPAL+EDD) -> antenatal visits (GA + risk flags) ->
 *   ultrasound (biometry GA + EFW band) -> partogram timepoints ->
 *   delivery (state flip + server APGAR) -> neonatal (server APGAR) ->
 *   re-delivery on same pregnancy rejected (409).
 *   NODE_PATH=...\namaweb\node_modules node obgyn_workflow_test.js
 */
'use strict';
const E = require('./ob_engine');

let passed = 0, failed = 0;
function assert(cond, name, det = '') {
    if (cond) { console.log('  PASS — ' + name); passed++; }
    else { console.log('  FAIL — ' + name + (det ? ' | ' + det : '')); failed++; }
}

// ---- mock state ----
const TENANT = 1;
let seq = { preg: 0, visit: 0, us: 0, pg: 0, del: 0, neo: 0 };
const store = { pregnancies: [], visits: [], ultrasounds: [], partogram: [], deliveries: [], neonatal: [], audit: [] };
function audit(action, details) { store.audit.push({ action, details }); }

// ---- route-logic simulations (mirror server.js handlers) ----
function registerPregnancy(b) {
    const edd = E.computeEDD(b.lmp);
    const g = E.computeGPAL(b);
    if (!g.ok) return { status: 422, error: g.error };
    const row = { id: ++seq.preg, tenant_id: TENANT, patient_id: b.patient_id, status: 'Active',
        lmp: b.lmp, edd, gravida: g.gravida, para: g.para, abortions: g.abortion, living_children: g.living };
    store.pregnancies.push(row);
    audit('CREATE_PREGNANCY', `#${row.id} G${g.gravida}P${g.para}A${g.abortion}L${g.living}`);
    return { status: 200, row };
}
function antenatalVisit(pregId, b) {
    const preg = store.pregnancies.find(p => p.id === pregId && p.tenant_id === TENANT);
    if (!preg) return { status: 404 };
    const flags = E.antenatalRiskFlags(b);
    const ga = E.gestationalAgeFromLMP(preg.lmp, b.visit_date);
    const row = { id: ++seq.visit, pregnancy_id: pregId, ga: ga ? ga.label : '', risk_flags: flags.join(', '),
        visit_number: store.visits.filter(v => v.pregnancy_id === pregId).length + 1 };
    store.visits.push(row);
    audit('ANTENATAL_VISIT', `#${pregId} ${row.ga}`);
    return { status: 200, row, flags };
}
function ultrasound(pregId, b) {
    const preg = store.pregnancies.find(p => p.id === pregId && p.tenant_id === TENANT);
    if (!preg) return { status: 404 };
    const ga = E.gaFromBiometry(b);
    const band = ga.ok ? E.efwPercentileBand(ga.gaWeeks, b.efw) : null;
    const row = { id: ++seq.us, pregnancy_id: pregId, ga: ga.ok ? `${ga.gaWeeks}+${ga.gaDays} weeks` : '', efw_percentile: band ? band.band : '' };
    store.ultrasounds.push(row);
    return { status: 200, row, band };
}
function partogram(pregId, b) {
    const preg = store.pregnancies.find(p => p.id === pregId && p.tenant_id === TENANT);
    if (!preg) return { status: 404 };
    const flags = E.antenatalRiskFlags({ fetal_heart_rate: b.fetal_heart_rate_baseline });
    const row = { id: ++seq.pg, pregnancy_id: pregId, dilation: b.cervical_dilation, alert_flags: flags.join(', ') };
    store.partogram.push(row);
    return { status: 200, row };
}
function recordDelivery(pregId, b) {
    const preg = store.pregnancies.find(p => p.id === pregId && p.tenant_id === TENANT);
    if (!preg) return { status: 404 };
    const t = E.deliveryTransitionAllowed(preg.status);   // state machine
    if (!t.ok) return { status: 409, error: t.error };
    const a1 = E.computeAPGAR(b.apgar_1min_components);
    const a5 = E.computeAPGAR(b.apgar_5min_components);
    if (!a1.ok) return { status: 422, error: 'apgar1' };
    if (!a5.ok) return { status: 422, error: 'apgar5' };
    const row = { id: ++seq.del, tenant_id: TENANT, pregnancy_id: pregId, patient_id: preg.patient_id,
        apgar_1min: a1.total, apgar_5min: a5.total, delivery_type: b.delivery_type };
    store.deliveries.push(row);
    preg.status = 'Delivered';                            // commit transition
    audit('RECORD_DELIVERY', `#${pregId} APGAR ${a1.total}/${a5.total}`);
    return { status: 200, row };
}
function recordNeonatal(deliveryId, b) {
    const del = store.deliveries.find(d => d.id === deliveryId && d.tenant_id === TENANT);
    if (!del) return { status: 404 };
    const a1 = E.computeAPGAR(b.apgar_1min_components);
    const a5 = E.computeAPGAR(b.apgar_5min_components);
    if (!a1.ok || !a5.ok) return { status: 422 };
    const row = { id: ++seq.neo, delivery_id: deliveryId, apgar_1min: a1.total, apgar_5min: a5.total, birth_weight_grams: b.birth_weight_grams };
    store.neonatal.push(row);
    audit('RECORD_NEONATAL', `del#${deliveryId} APGAR ${a1.total}/${a5.total}`);
    return { status: 200, row };
}

console.log('\n=== E14 OB/Maternity workflow simulation ===\n');

// 1) Register pregnancy
const reg = registerPregnancy({ patient_id: 201, lmp: '2026-01-15', gravida: 3, para: 1, abortion: 1, living: 1 });
assert(reg.status === 200, 'register pregnancy ok');
assert(reg.row.edd === '2026-10-22', 'EDD = LMP+280 (server-derived)', reg.row.edd);
assert(reg.row.living_children === 1, 'GPAL living children derived/validated');
const pregId = reg.row.id;

// 2) Antenatal visits — normal then high-risk
const v1 = antenatalVisit(pregId, { systolic: 120, diastolic: 80, hemoglobin: 12, fetal_heart_rate: 140, visit_date: '2026-04-15' });
assert(v1.status === 200 && v1.flags.length === 0, 'antenatal visit 1: normal, no risk flags');
assert(/weeks$/.test(v1.row.ga), 'antenatal GA label server-derived from LMP', v1.row.ga);
const v2 = antenatalVisit(pregId, { systolic: 150, diastolic: 95, proteinuria: '++', hemoglobin: 9, visit_date: '2026-07-01' });
assert(v2.status === 200 && v2.flags.includes('Pre-eclampsia risk') && v2.flags.includes('Anemia'), 'antenatal visit 2: pre-eclampsia + anemia flagged server-side');
assert(v2.row.visit_number === 2, 'visit_number increments per pregnancy');

// 3) Ultrasound
const us = ultrasound(pregId, { bpd: 75, fl: 56, hc: 280, ac: 250, efw: 1500 });
assert(us.status === 200 && /weeks$/.test(us.row.ga), 'ultrasound GA from biometry');
assert(us.band !== null, 'ultrasound EFW percentile band computed');

// 4) Partogram timepoints
assert(partogram(pregId, { cervical_dilation: 4, fetal_heart_rate_baseline: 140 }).status === 200, 'partogram entry 1 (4cm)');
const pg2 = partogram(pregId, { cervical_dilation: 8, fetal_heart_rate_baseline: 175 });
assert(pg2.status === 200 && pg2.row.alert_flags.includes('Abnormal FHR'), 'partogram entry 2 flags abnormal FHR (175)');

// 5) Delivery (state flip + server APGAR)
const goodApgar = { appearance: 'pink', pulse: 'above_100', grimace: 'cry', activity: 'active', respiration: 'good' };
const del = recordDelivery(pregId, { delivery_type: 'NVD', apgar_1min_components: goodApgar, apgar_5min_components: goodApgar });
assert(del.status === 200 && del.row.apgar_1min === 10 && del.row.apgar_5min === 10, 'delivery recorded, APGAR 10/10 server-computed');
assert(store.pregnancies.find(p => p.id === pregId).status === 'Delivered', 'pregnancy status flipped to Delivered');
const delId = del.row.id;

// 6) Re-delivery rejected by state machine
const reDel = recordDelivery(pregId, { delivery_type: 'NVD', apgar_1min_components: goodApgar, apgar_5min_components: goodApgar });
assert(reDel.status === 409, 'second delivery on same pregnancy -> 409 (state machine)');

// 7) Delivery with incomplete APGAR -> 422 (fail-closed)
const reg2 = registerPregnancy({ patient_id: 201, lmp: '2026-02-01', gravida: 1, para: 0, abortion: 0 });
const badApgar = { appearance: 'pink', pulse: 'above_100', grimace: 'cry', activity: 'active' }; // missing respiration
assert(recordDelivery(reg2.row.id, { apgar_1min_components: goodApgar, apgar_5min_components: badApgar }).status === 422, 'delivery with incomplete APGAR -> 422 (no false 10)');

// 8) Neonatal attached to delivery
const neo = recordNeonatal(delId, { birth_weight_grams: 3200, apgar_1min_components: goodApgar, apgar_5min_components: goodApgar });
assert(neo.status === 200 && neo.row.apgar_5min === 10, 'neonatal record attached, APGAR server-computed');
assert(recordNeonatal(99999, { apgar_1min_components: goodApgar, apgar_5min_components: goodApgar }).status === 404, 'neonatal on unknown delivery -> 404');

// 9) Audit coverage
assert(store.audit.some(a => a.action === 'RECORD_DELIVERY'), 'delivery audited');
assert(store.audit.some(a => a.action === 'RECORD_NEONATAL'), 'neonatal audited');
assert(store.audit.some(a => a.action === 'CREATE_PREGNANCY'), 'pregnancy creation audited');

console.log('\n=== Results: ' + passed + ' passed, ' + failed + ' failed ===\n');
process.exit(failed === 0 ? 0 : 1);
