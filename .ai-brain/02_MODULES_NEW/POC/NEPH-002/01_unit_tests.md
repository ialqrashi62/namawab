<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# NEPH-002 — Unit Tests (transplant_engine.js)

`js
const t = require('./transplant_engine');
const assert = require('assert');

// 1. KDPI
const kdpi = t.kdpiScore(42, 165, 65, 'caucasian', false, false, 'trauma', false, false, 0.9, false);
assert.ok(kdpi.score >= 0 && kdpi.score <= 100);
assert.ok(kdpi.score < 35); // young, healthy donor

// 2. EPTS
const epts = t.eptsScore(38, 4, false, 0);
assert.ok(epts.score >= 0 && epts.score <= 100);

// 3. cPRA
const cpra = t.praCalculation([{locus:'A2', mfi:8500}, {locus:'DR17', mfi:12000}], 'US_pop');
assert.ok(cpra.cpra_pct >= 0 && cpra.cpra_pct <= 100);

// 4. Crossmatch
const xm = t.crossmatchInterpretation('NEG', 'NEG', 50, 80, 'POS', [{locus:'A2', mfi:8500}]);
assert.strictEqual(xm.decision, 'decline_dsa');
assert.strictEqual(xm.absolute_block, false); // DSA, not CDC

// 5. Trough adjuster
const adj = t.immunosuppressionTroughAdjuster('TACROLIMUS', 2.0, 12, 5, 10, 1.4);
assert.ok(adj.recommendation);

// 6. HARD RULE: trough >20 = block
const blocked = t.immunosuppressionTroughAdjuster('TACROLIMUS', 4.0, 22, 5, 10, 1.4);
assert.strictEqual(blocked.block, true);
assert.strictEqual(blocked.action, 'escalate_to_physician');

// 7. Banff grade
const banff = t.banffGrade({ti:1, i:1, t:0, v:0}, {c4d:0, dsa:0}, 'NEG', 'NEG');
assert.ok(['Borderline','IA','IB','IIA','IIB','III','CAAMR'].includes(banff.category));

// 8. Rejection risk
const risk = t.rejectionRiskScore({dsa:'rising', egfrSlope:-5, bkPcr:5000, cmvPcr:0, adherence:85});
assert.ok(risk.risk_30d_pct >= 0 && risk.risk_30d_pct <= 100);

// 9. Infection prophylaxis
const proph = t.infectionProphylaxisChecker(60, ['TAC','MMF','PRED'], {cmv:'D+/R-', ebv:'R+', hsv:'R+'});
assert.ok(proph.cmv_prophylaxis === 'valganciclovir_3mo');
assert.ok(proph.pcp_prophylaxis === 'tmp_smx_6mo');

// 10. Match score
const match = t.donorRecipientMatchScore(5, [], 23, 'A+', 18, 2, 4);
assert.ok(match.recommendation === 'proceed');
`

---
*Section 09 of NEPH-002. Tests. L1 DRAFT.*