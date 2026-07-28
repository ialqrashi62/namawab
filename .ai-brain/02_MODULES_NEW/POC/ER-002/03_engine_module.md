<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# ER-002 — Pure JS Engine (trauma_center_engine.js, extends existing)

`js
'use strict';

// 1. AIS severity
function aisSeverityScore(ais2015Descriptor) {
  // Map AIS 2015 dictionary to severity 1-6
  const m = { 'AIS1':1, 'AIS2':2, 'AIS3':3, 'AIS4':4, 'AIS5':5, 'AIS6':6 };
  return m[ais2015Descriptor] || 0;
}

// 2. ISS
function issCalculator(injuries) {
  const byRegion = {};
  for (const inj of injuries) {
    if (!byRegion[inj.region] || byRegion[inj.region] < inj.ais) {
      byRegion[inj.region] = inj.ais;
    }
  }
  const top3 = Object.values(byRegion).sort((a, b) => b - a).slice(0, 3);
  while (top3.length < 3) top3.push(0);
  const iss = top3.reduce((sum, x) => sum + x * x, 0);
  return { iss: Math.min(iss, 75), max_ais: Math.max(...top3), mortality_band: iss >= 16 ? 'high' : iss >= 9 ? 'moderate' : 'low' };
}

// 3. TRISS
function trissPs(age, iss, rts) {
  // Champion 1995 coefficients (blunt): b0=-1.2470, b1=0.9544(age), b2=-0.0768(iss), b3=-1.9052(rts)
  const logit = -1.2470 + 0.9544 * (age >= 55 ? 1 : 0) - 0.0768 * iss - 1.9052 * rts;
  const ps = 1 / (1 + Math.exp(-logit));
  return { ps_pct: Math.round(ps * 100), band: ps > 0.9 ? 'high' : ps > 0.5 ? 'moderate' : 'low' };
}

// 4. Activation tier
function activationTierClassifier(p) {
  const criteria = [];
  if (p.penetratingTorso) criteria.push('penetrating_torso');
  if (p.gcs <= 8) criteria.push('gcs_le_8');
  if (p.sbp < 90) criteria.push('sbp_lt_90');
  if (p.hr > 120) criteria.push('hr_gt_120');
  if (p.intubation) criteria.push('intubated');
  if (p.pulselessExtremity) criteria.push('pulseless_ext');
  if (p.amputationProximal) criteria.push('amputation_proximal');
  if (p.fallHeightFt > 20) criteria.push('fall_gt_20ft');
  if (p.ejection) criteria.push('ejection');
  if (p.mvcSpeed > 30) criteria.push('mvc_gt_30mph');
  if (criteria.length >= 1) return { tier: 1, team: 'full', eta: 15, criteria_met: criteria };
  if (p.fallHeightFt > 10 || p.pedestrianStruck || p.age > 65) return { tier: 2, team: 'partial', eta: 30, criteria_met: ['mechanism'] };
  return { tier: 3, team: 'consult', eta: 60, criteria_met: [] };
}

// 5. MTP trigger
function mtpTriggerCheck(sbp, hr, lactate, fast, suspectedHemorrhage, mechanism) {
  let score = 0;
  if (sbp < 90) score += 1;
  if (hr > 120) score += 1;
  if (lactate > 4) score += 1;
  if (fast) score += 1;
  if (suspectedHemorrhage) score += 1;
  return { trigger: score >= 3 || (sbp < 90 && fast), score, ratio: '1:1:1' };
}

// 6. TBI severity
function tbiSeverityScore(gcs, ctMarshall, pupillary, hypoxia, hypotension) {
  let severity = 'mild';
  if (gcs <= 8) severity = 'severe';
  else if (gcs <= 12) severity = 'moderate';
  const icpIndicated = severity === 'severe' || ctMarshall >= 3 || pupillary === 'unreactive';
  return { severity, icp_monitor_indicated: icpIndicated };
}

// 7. GCS trend
function gcsTrend(current, prev, prev2) {
  if (current > prev) return { trend: 'improving', delta: current - prev };
  if (current < prev) return { trend: 'worsening', delta: current - prev };
  return { trend: 'stable', delta: 0 };
}

// 8. Lactate clearance
function lactateClearance(initial, current, hoursElapsed) {
  const clearance = ((initial - current) / initial) * 100;
  return { clearance_pct: Math.round(clearance), adequate: clearance > 20 };
}

// 9. Hemorrhage control
function hemorrhageControlChecklist(source, hemodynamics) {
  if (source === 'pelvic_fracture' && hemodynamics.sbp < 90) return { pathway: 'pelvic_packing' };
  if (source === 'intra_abd' && hemodynamics.sbp < 90) return { pathway: 'damage_control_surg' };
  if (source === 'mangled_ext') return { pathway: 'tourniquet_then_amputation' };
  return { pathway: 'angioembolization' };
}

// 10. Transfer
function transferCriteriaCheck(gap, stability, facility) {
  return { decision: 'transfer', time_to_transfer: 60, mode: stability.stable ? 'ground' : 'helicopter', contraindications: [] };
}

module.exports = {
  aisSeverityScore, issCalculator, trissPs, activationTierClassifier,
  mtpTriggerCheck, tbiSeverityScore, gcsTrend, lactateClearance,
  hemorrhageControlChecklist, transferCriteriaCheck
};
`

---
*Section 20 of ER-002. L1 DRAFT.*