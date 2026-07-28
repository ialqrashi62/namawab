<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# ER-002 — Unit Tests (trauma_center_engine.js, extends existing)

`js
const t = require('./trauma_center_engine');
const assert = require('assert');

// 1. AIS severity
assert.strictEqual(t.aisSeverityScore('AIS2015_Head_Severe'), 4);

// 2. ISS
const iss = t.issCalculator([
  {region:'head', ais:4}, {region:'chest', ais:3}, {region:'abdomen', ais:3}
]);
assert.strictEqual(iss.iss, 9+9+9); // 27
assert.ok(iss.mortality_band === 'high');

// 3. TRISS
const triss = t.trissPs(28, 28, 6);
assert.ok(triss.ps_pct >= 0 && triss.ps_pct <= 100);

// 4. Activation tier
const tier = t.activationTierClassifier({penetratingTorso:true, sbp:80, hr:130, gcs:13});
assert.strictEqual(tier.tier, 1);

const tier2 = t.activationTierClassifier({fall:true, fallHeightFt:15, sbp:110, hr:90, gcs:14});
assert.strictEqual(tier2.tier, 2);

// 5. MTP trigger
const mtp = t.mtpTriggerCheck(80, 130, 5.2, true, true, 'MVC ejection');
assert.strictEqual(mtp.trigger, true);

const noMtp = t.mtpTriggerCheck(120, 90, 1.5, false, false, 'fall from standing');
assert.strictEqual(noMtp.trigger, false);

// 6. TBI severity
const tbi = t.tbiSeverityScore(7, 3, 'unreactive', false, true);
assert.strictEqual(tbi.severity, 'severe');
assert.strictEqual(tbi.icp_monitor_indicated, true);

// 7. GCS trend
const trend = t.gcsTrend(13, 13, 13);
assert.ok(trend.trend === 'stable');

// 8. Lactate clearance
const clear = t.lactateClearance(5.2, 3.0, 6);
assert.ok(clear.clearance_pct > 40); // good clearance

// 9. Hemorrhage control
const hc = t.hemorrhageControlChecklist('pelvic_fracture', {sbp:80, hr:130});
assert.strictEqual(hc.pathway, 'pelvic_packing');

// 10. Transfer
const tx = t.transferCriteriaCheck('pediatric_trauma', {stable:true}, 'King_Faisal_Specialist');
assert.strictEqual(tx.decision, 'transfer');
assert.ok(tx.mode === 'helicopter' || tx.mode === 'ground');
`

---
*Section 09 of ER-002. Tests. L1 DRAFT.*