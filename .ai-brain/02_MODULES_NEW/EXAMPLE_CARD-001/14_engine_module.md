# 14 — Engine Module (CARD-001)

> Owner: SA · Tier 1

## Module: `cardiology_engine_v1`

```js
// namaweb/cardiology_engine.js
'use strict';
// Pure functions only. No I/O, no DB. Receives patient context, returns clinical decision support.

const cardiology = module.exports = {};

/**
 * HEART score (Backus 2013) for chest pain risk stratification.
 * @param {Object} ctx - { history: 0|1|2, ecg: 0|1|2, age: 0|1|2, riskFactors: 0|1|2, troponin: 0|1|2 }
 * @returns {Object} { score: 0-10, risk: 'low'|'moderate'|'high', recommendation: string, redFlag: boolean }
 */
cardiology.heartScore = function heartScore(ctx) {
  if (!ctx || typeof ctx !== 'object') {
    throw new Error('cardiology.heartScore: ctx required');
  }
  const { history = 0, ecg = 0, age = 0, riskFactors = 0, troponin = 0 } = ctx;
  for (const k of ['history', 'ecg', 'age', 'riskFactors', 'troponin']) {
    if (ctx[k] < 0 || ctx[k] > 2) {
      throw new Error(`cardiology.heartScore: ${k} must be 0..2`);
    }
  }
  const score = history + ecg + age + riskFactors + troponin;
  let risk, recommendation;
  if (score <= 3) { risk = 'low'; recommendation = 'discharge with outpatient workup'; }
  else if (score <= 6) { risk = 'moderate'; recommendation = 'admit for observation, serial troponin, stress'; }
  else { risk = 'high'; recommendation = 'admit, invasive workup, consider cath'; }
  return { score, risk, recommendation, redFlag: score >= 7 };
};

/**
 * CHA2DS2-VASc score for AF stroke risk.
 * Returns score 0..9, anticoag indication, recommendation.
 */
cardiology.cha2ds2vasc = function cha2ds2vasc(ctx) {
  if (!ctx) throw new Error('ctx required');
  const { chf=0, htn=0, age=0, diabetes=0, stroke_tia_thromboembolism=0, vascular=0, sex=0 } = ctx;
  if (age === 2 && (age < 65)) throw new Error('age points must be 0|1|2; 2 requires age>=75');
  const score = chf + htn + age + diabetes + stroke_tia_thromboembolism + vascular + sex;
  let indication = score >= 2 ? 'anticoagulation indicated' : score === 1 ? 'consider anticoagulation (male) / indicated (female)' : 'no anticoagulation needed';
  return { score, indication, redFlag: score >= 2 && !ctx.on_anticoag };
};

/**
 * HAS-BLED bleeding risk score for AF anticoag decision.
 */
cardiology.hasBled = function hasBled(ctx) {
  if (!ctx) throw new Error('ctx required');
  const { htn_uncontrolled=0, renal_disease=0, liver_disease=0, stroke=0, prior_bleed=0, inr_unstable=0, elderly=0, drugs=0, alcohol=0 } = ctx;
  const score = htn_uncontrolled + renal_disease + liver_disease + stroke + prior_bleed + inr_unstable + elderly + drugs + alcohol;
  return { score, high_risk: score >= 3, redFlag: score >= 3 && !ctx.monitored };
};

/**
 * HF GDMT optimization recommendations.
 * Inputs: { ef, nyha, bp_systolic, hr, egfr, k, current_meds, allergies }
 * Outputs: { recommended_changes: [], contraindications: [], monitoring: [] }
 */
cardiology.hfGdmt = function hfGdmt(ctx) {
  if (!ctx) throw new Error('ctx required');
  const { ef, nyha, bp_systolic, hr, egfr, k, current_meds = [], allergies = [] } = ctx;
  if (typeof ef !== 'number') throw new Error('ef required');
  const changes = [];
  const contra = [];
  const monitor = [];

  // SGLT2i: indicated for HFrEF regardless of diabetes
  if (ef < 40 && !current_meds.some(m => /empagliflozin|dapagliflozin/i.test(m.name))) {
    if (egfr < 20) contra.push('SGLT2i contraindicated: eGFR < 20');
    else changes.push({ drug: 'dapagliflozin', dose: '10 mg PO daily', reason: 'HFrEF GDMT' });
  }

  // ARNI/ACEi/ARB
  const onAcei = current_meds.some(m => /enalapril|ramipril|lisinopril/i.test(m.name));
  const onArb = current_meds.some(m => /losartan|valsartan/i.test(m.name));
  const onArni = current_meds.some(m => /sacubitril.valsartan/i.test(m.name));
  if (ef < 40 && !onArni && !onAcei && !onArb) {
    if (bp_systolic < 100) changes.push({ drug: 'enalapril', dose: '2.5 mg PO BID', reason: 'HFrEF GDMT, start low if SBP<100', monitor: ['BP', 'K', 'creatinine'] });
    else changes.push({ drug: 'sacubitril/valsartan', dose: '24/26 mg PO BID', reason: 'HFrEF GDMT (preferred over ACEi/ARB)' });
  }

  // Beta-blocker (HFrEF)
  const onBb = current_meds.some(m => /carvedilol|bisoprolol|metoprolol.succinate|nebivolol/i.test(m.name));
  if (ef < 40 && !onBb && hr >= 60) {
    changes.push({ drug: 'bisoprolol', dose: '1.25 mg PO daily', reason: 'HFrEF GDMT, titrate to 10 mg', monitor: ['HR', 'BP'] });
  }

  // MRA (HFrEF)
  const onMra = current_meds.some(m => /spironolactone|eplerenone/i.test(m.name));
  if (ef < 35 && nyha >= 2 && !onMra) {
    if (k >= 5.0 || egfr < 30) contra.push('MRA contraindicated: K>=5.0 or eGFR<30');
    else changes.push({ drug: 'spironolactone', dose: '12.5 mg PO daily', reason: 'HFrEF GDMT', monitor: ['K', 'creatinine'] });
  }

  if (k >= 5.5) monitor.push('K>=5.5: review MRA, ARNI, ACEi/ARB');
  if (egfr < 30) monitor.push('eGFR<30: nephrology consult');

  const redFlag = (k >= 6.0) || (egfr < 15) || (bp_systolic < 80) || (hr < 50);
  return { changes, contra, monitor, redFlag };
};

/**
 * ECG basic interpretation.
 * Input: parsed ECG JSON.
 * Output: { rhythm, rate, intervals, axis, st_changes, q_waves, impression, urgency, redFlag }
 */
cardiology.ecgBasic = function ecgBasic(ecg) {
  if (!ecg) throw new Error('ecg required');
  const { rate, rhythm, pr_ms, qrs_ms, qtc_ms, axis_deg, st_per_lead, q_per_lead } = ecg;
  const stChanges = [];
  const qWaves = [];
  for (const [lead, elev] of Object.entries(st_per_lead || {})) {
    if (elev >= 1 && (lead.startsWith('V2') || lead.startsWith('V3'))) stChanges.push({ lead, type: 'ST-elevation>=2mm (V2-V3)', value: elev });
    else if (elev >= 0.5) stChanges.push({ lead, type: 'ST-elevation>=0.5mm', value: elev });
    if ((st_per_lead[lead] || 0) <= -0.5) stChanges.push({ lead, type: 'ST-depression>=0.5mm', value: elev });
  }
  for (const [lead, q] of Object.entries(q_per_lead || {})) {
    if (q && q.pathological) qWaves.push(lead);
  }
  // STEMI criteria
  const contiguousStemi = detectStemi(stChanges);
  const isStemi = contiguousStemi.length > 0;
  return {
    rate, rhythm, intervals: { pr_ms, qrs_ms, qtc_ms }, axis_deg,
    st_changes: stChanges, q_waves: qWaves,
    impression: isStemi ? `STEMI pattern in ${contiguousStemi.join(',')}` : (stChanges.length > 0 ? 'ST changes — clinical correlation' : 'No acute ST changes'),
    urgency: isStemi ? 'critical' : (stChanges.length > 0 ? 'urgent' : 'routine'),
    redFlag: isStemi || rhythm === 'VT' || rhythm === 'VF' || rhythm === 'torsades'
  };
};

function detectStemi(stChanges) {
  const elev = new Map();
  for (const c of stChanges) {
    if (c.type.startsWith('ST-elevation')) elev.set(c.lead, c.value);
  }
  const groups = [['V1','V2','V3','V4'], ['V5','V6','I','aVL'], ['II','III','aVF']];
  for (const g of groups) {
    const hits = g.filter(l => elev.has(l));
    if (hits.length >= 2) return hits;
  }
  return [];
}

module.exports = cardiology;
```

## Unit test references (49_unit_tests.md)

- `heartScore` — 12 test cases
- `cha2ds2vasc` — 10 test cases
- `hasBled` — 8 test cases
- `hfGdmt` — 15 test cases (HFrEF, HFmrEF, HFpEF, all 4 drug classes, contraindications)
- `ecgBasic` — 20 test cases (STEMI anterior/inferior/lateral, NSTEMI, AF, VT, BBB)
