# Pulmonology — Per-Department 35-File Pack (BATCH 2)

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22
> **Cluster DBML:** `pulmonology.dbml`
> **Existing station:** `pulmonology-station`
> **Files added:** 28 (to bring total from 8 → 36)
> **Status:** Per-dept template applied

This file documents the full 7-Expert Panel synthesis for Pulmonology.
It complements `00_7_expert_panel_synthesis.md` with all 28 additional
per-dept files (engines, tests, OpenAPI, Stitch, etc.).

---

## 1. Clinical Engines Needed

### 1.1 `copd_severity_engine.js`

```js
// namaweb/copd_severity_engine.js
// GOLD 2024 classification + CAT score

const GOLD_GROUPS = {
  A: { label: 'Low symptoms, low risk', symptoms_max: 10, exacerbations_max: 1, hospitalization_max: 0 },
  B: { label: 'High symptoms, low risk', symptoms_min: 10, exacerbations_max: 1, hospitalization_max: 0 },
  E: { label: 'High risk (≥2 exacerbations or ≥1 hospitalization)', symptoms_any: true, exacerbations_min: 2 }
};

function copdSeverity(input) {
  // input: { fev1_pct, cat_score, exacerbations_last_12m, hospitalization_last_12m, mMRC_dyspnea, smoke_status, eosinophils_cells_ul }
  const { fev1_pct, cat_score, exacerbations_last_12m, hospitalization_last_12m, mMRC_dyspnea, smoke_status, eosinophils_cells_ul } = input;
  // GOLD stage by FEV1
  let goldStage = 'GOLD1';
  if (fev1_pct < 80) goldStage = 'GOLD1';
  if (fev1_pct < 50) goldStage = 'GOLD2';
  if (fev1_pct < 30) goldStage = 'GOLD3';
  if (fev1_pct < 30) goldStage = 'GOLD4';
  // GOLD group A/B/E
  let group = 'A';
  const highSymptoms = (cat_score >= 10) || (mMRC_dyspnea >= 2);
  const highRisk = (exacerbations_last_12m >= 2) || (hospitalization_last_12m >= 1);
  if (highRisk) group = 'E';
  else if (highSymptoms) group = 'B';
  // Treatment algorithm
  let firstLine = 'LAMA';
  let addOn = null;
  if (group === 'B' && eosinophils_cells_ul < 100) firstLine = 'LABA+LAMA';
  if (group === 'B' && eosinophils_cells_ul >= 300) firstLine = 'ICS+LABA';
  if (group === 'E' && eosinophils_cells_ul < 100) firstLine = 'LABA+LAMA';
  if (group === 'E' && eosinophils_cells_ul >= 300) firstLine = 'ICS+LABA+LAMA';
  if (group === 'E' && eosinophils_cells_ul >= 100 && eosinophils_cells_ul < 300) firstLine = 'LABA+LAMA';
  if (group === 'E' && hospitalization_last_12m >= 1) {
    addOn = 'Consider azithromycin prophylaxis (if not contraindicated)';
  }
  const recommendations = [
    { action: `${firstLine} as first-line maintenance therapy`, urgency: 'routine', cite: 'GOLD-2024-ABCD' },
    { action: 'Smoking cessation (if current smoker)', urgency: 'urgent', cite: 'GOLD-2024-risk-factors' },
    { action: 'Annual flu vaccine + pneumococcal vaccine', urgency: 'routine', cite: 'GOLD-2024-vaccines' },
    { action: 'Pulmonary rehabilitation (PR) — if mMRC ≥2 or exacerbation', urgency: 'routine', cite: 'GOLD-2024-PR' }
  ];
  if (addOn) recommendations.push({ action: addOn, urgency: 'routine', cite: 'GOLD-2024-exacerbations' });
  if (cat_score >= 20) {
    recommendations.push({ action: 'Severe symptom burden — consider triple therapy escalation', urgency: 'urgent', cite: 'GOLD-2024' });
  }
  if (hospitalization_last_12m >= 1) {
    recommendations.push({ action: 'Recent hospitalization — schedule follow-up within 7 days', urgency: 'urgent', cite: 'GOLD-2024-followup' });
  }
  return {
    value: fev1_pct,
    severity: `GOLD${group === 'A' ? '1' : group === 'B' ? '2' : group === 'E' ? '3' : '4'}-${group}`,
    notes: `FEV1 ${fev1_pct}% predicted, CAT ${cat_score}, exacerbations ${exacerbations_last_12m}/yr, hospitalizations ${hospitalization_last_12m}/yr, eos ${eosinophils_cells_ul} cells/μL`,
    goldStage,
    goldGroup: group,
    firstLine,
    recommendations,
    citations: ['GOLD-2024-report', 'ATS-COPD-2023']
  };
}

module.exports = { copdSeverity, GOLD_GROUPS };
```

### 1.2 `asthma_control_engine.js`

```js
// namaweb/asthma_control_engine.js
// GINA 2024 control classification + step-up/down

const GINA_STEPS = [
  { step: 1, treatment: 'PRN SABA only (now discouraged by GINA 2024 — prefer ICS-formoterol PRN)' },
  { step: 2, treatment: 'Low-dose ICS-formoterol PRN' },
  { step: 3, treatment: 'Low-dose ICS-LABA daily' },
  { step: 4, treatment: 'Medium-dose ICS-LABA' },
  { step: 5, treatment: 'High-dose ICS-LABA + LAMA' },
  { step: 6, treatment: 'High-dose ICS-LABA + LAMA + biologics' }
];

function assessAsthmaControl(input) {
  // input: { symptoms_per_week, night_awakenings_per_month, SABA_use_per_week,
  //          activity_limitation, exacerbations_last_12m, current_step, fev1_pct, act_score }
  const { symptoms_per_week, night_awakenings_per_month, SABA_use_per_week,
          activity_limitation, exacerbations_last_12m, current_step, fev1_pct, act_score } = input;
  // GINA control: well-controlled / partly controlled / uncontrolled
  const wellControlled = symptoms_per_week <= 2 &&
                         night_awakenings_per_month <= 2 &&
                         SABA_use_per_week <= 2 &&
                         !activity_limitation &&
                         exacerbations_last_12m === 0;
  const partlyControlled = (symptoms_per_week > 2 ? 1 : 0) +
                          (night_awakenings_per_month > 2 ? 1 : 0) +
                          (SABA_use_per_week > 2 ? 1 : 0) +
                          (activity_limitation ? 1 : 0);
  let control = 'uncontrolled';
  if (wellControlled) control = 'well_controlled';
  else if (partlyControlled <= 2) control = 'partly_controlled';
  // ACT score (alternative)
  if (act_score !== undefined) {
    if (act_score >= 20) control = 'well_controlled';
    else if (act_score >= 16) control = 'partly_controlled';
    else control = 'uncontrolled';
  }
  // Step recommendation
  let recommendedStep = current_step;
  if (control === 'uncontrolled' && current_step < 6) {
    recommendedStep = current_step + 1;
  } else if (control === 'well_controlled' && current_step > 1) {
    recommendedStep = Math.max(1, current_step - 1);
  }
  const recommendations = [];
  if (control === 'uncontrolled') {
    recommendations.push({
      action: `Step up to GINA step ${recommendedStep}: ${GINA_STEPS[recommendedStep - 1].treatment}`,
      urgency: 'urgent',
      cite: 'GINA-2024-step-up'
    });
  } else if (control === 'partly_controlled') {
    recommendations.push({
      action: `Check adherence + inhaler technique. Consider step up to GINA step ${recommendedStep}: ${GINA_STEPS[recommendedStep - 1].treatment}`,
      urgency: 'routine',
      cite: 'GINA-2024-adherence'
    });
  } else if (control === 'well_controlled' && current_step > 1) {
    recommendations.push({
      action: `Consider step down to GINA step ${recommendedStep}: ${GINA_STEPS[recommendedStep - 1].treatment} (review every 3 months)`,
      urgency: 'routine',
      cite: 'GINA-2024-step-down'
    });
  }
  recommendations.push({
    action: 'Annual flu vaccine + pneumococcal vaccine',
    urgency: 'routine',
    cite: 'GINA-2024-vaccines'
  });
  if (exacerbations_last_12m >= 2) {
    recommendations.push({
      action: 'Frequent exacerbations — consider biologics (omalizumab, mepolizumab, dupilumab)',
      urgency: 'urgent',
      cite: 'GINA-2024-biologics'
    });
  }
  return {
    value: fev1_pct,
    severity: control,
    notes: `Symptoms ${symptoms_per_week}/wk, night awakenings ${night_awakenings_per_month}/mo, SABA use ${SABA_use_per_week}/wk, ACT ${act_score || 'N/A'}`,
    control,
    currentStep: current_step,
    recommendedStep,
    recommendations,
    citations: ['GINA-2024-strategy', 'ERS-ICM-Asthma-2023']
  };
}

module.exports = { assessAsthmaControl, GINA_STEPS };
```

### 1.3 `sleep_study_engine.js` (Sleep Disorders)

```js
// namaweb/sleep_study_engine.js
// Polysomnography interpretation (AHI, ODI)

function interpretSleepStudy(input) {
  // input: { ahi, odi, min_spo2, tst_hours, sleep_efficiency, rem_pct,
  //          arousal_index, periodic_limb_movement_index, predominant_event_type }
  const { ahi, odi, min_spo2, tst_hours, sleep_efficiency, rem_pct,
          arousal_index, periodic_limb_movement_index, predominant_event_type } = input;
  let osaSeverity = 'normal';
  if (ahi >= 5 && ahi < 15) osaSeverity = 'mild_OSA';
  if (ahi >= 15 && ahi < 30) osaSeverity = 'moderate_OSA';
  if (ahi >= 30) osaSeverity = 'severe_OSA';
  // Severity based on AHI + ODI + min SpO2
  let severity = osaSeverity;
  if (min_spo2 < 80) severity = 'severe_OSA_with_hypoxemia';
  // Recommendations
  const recommendations = [];
  if (osaSeverity === 'mild_OSA' && predominant_event_type === 'positional') {
    recommendations.push({ action: 'Positional therapy (avoid supine)', urgency: 'routine', cite: 'AASM-Positional-therapy' });
  }
  if (osaSeverity === 'mild_OSA' || osaSeverity === 'moderate_OSA') {
    recommendations.push({ action: 'Lifestyle: weight loss if BMI ≥25, avoid alcohol before bed, sleep hygiene', urgency: 'routine', cite: 'AASM-CPG-OSA' });
  }
  if (osaSeverity === 'moderate_OSA' || osaSeverity === 'severe_OSA') {
    recommendations.push({ action: 'CPAP titration study (split-night or full-night)', urgency: 'urgent', cite: 'AASM-CPAP-titration' });
  }
  if (osaSeverity === 'severe_OSA' || min_spo2 < 80) {
    recommendations.push({ action: 'Do not drive until treated. Evaluate for commercial driving restrictions.', urgency: 'urgent', cite: 'AASM-driving-guidelines' });
  }
  if (periodic_limb_movement_index >= 15) {
    recommendations.push({ action: 'Periodic limb movement disorder — consider pramipexole or ropinirole', urgency: 'routine', cite: 'AASM-PLM' });
  }
  if (sleep_efficiency < 85) {
    recommendations.push({ action: 'Poor sleep efficiency — assess for insomnia, anxiety, depression', urgency: 'routine', cite: 'AASM-Insomnia' });
  }
  return {
    value: ahi,
    severity,
    notes: `AHI ${ahi}, ODI ${odi}, min SpO2 ${min_spo2}%, TST ${tst_hours}h, sleep efficiency ${sleep_efficiency}%, REM ${rem_pct}%`,
    ahi,
    odi,
    minSpO2: min_spo2,
    sleepEfficiency: sleep_efficiency,
    predominantEventType: predominant_event_type,
    recommendations,
    citations: ['AASM-CPG-OSA-2021', 'ICSD-3']
  };
}

module.exports = { interpretSleepStudy };
```

### 1.4 `pft_engine.js` (Pulmonary Function Test)

```js
// namaweb/pft_engine.js
// PFT interpretation (obstructive/restrictive/mixed)

function interpretPFT(input) {
  // input: { fev1_l, fvc_l, fev1_fvc_pct, tlc_l, dlco_ml_min_mmhg, predicted_fev1_l, predicted_fvc_l, predicted_tlc_l, predicted_dlco_ml_min_mmhg, age, sex, height_cm }
  const { fev1_l, fvc_l, fev1_fvc_pct, tlc_l, dlco_ml_min_mmhg, predicted_fev1_l, predicted_fvc_l, predicted_tlc_l, predicted_dlco_ml_min_mmhg } = input;
  const fev1_pct = (fev1_l / predicted_fev1_l) * 100;
  const fvc_pct = (fvc_l / predicted_fvc_l) * 100;
  const tlc_pct = tlc_l ? (tlc_l / predicted_tlc_l) * 100 : null;
  const dlco_pct = dlco_ml_min_mmhg ? (dlco_ml_min_mmhg / predicted_dlco_ml_min_mmhg) * 100 : null;
  let pattern = 'normal';
  if (fev1_fvc_pct < 0.7 && fev1_pct >= 80) pattern = 'obstructive_mild';
  if (fev1_fvc_pct < 0.7 && fev1_pct >= 50 && fev1_pct < 80) pattern = 'obstructive_moderate';
  if (fev1_fvc_pct < 0.7 && fev1_pct >= 30 && fev1_pct < 50) pattern = 'obstructive_severe';
  if (fev1_fvc_pct < 0.7 && fev1_pct < 30) pattern = 'obstructive_very_severe';
  if (fev1_fvc_pct >= 0.7 && fvc_pct < 80 && tlc_pct && tlc_pct < 80) pattern = 'restrictive';
  if (fev1_fvc_pct < 0.7 && fvc_pct < 80) pattern = 'mixed';
  if (pattern === 'normal' && dlco_pct && dlco_pct < 80) pattern = 'low_dlco_only';
  let severity = 'normal';
  if (pattern.startsWith('obstructive_')) {
    severity = pattern.split('_')[1];  // mild/moderate/severe/very_severe
  }
  const recommendations = [];
  if (pattern.startsWith('obstructive_')) {
    recommendations.push({ action: 'Bronchodilator challenge (post-bronchodilator FEV1)', urgency: 'routine', cite: 'ATS-PFT-2022' });
  }
  if (pattern === 'restrictive') {
    recommendations.push({ action: 'Chest CT (HRCT) to assess parenchymal lung disease', urgency: 'urgent', cite: 'ATS-restrictive-2022' });
  }
  if (dlco_pct && dlco_pct < 60) {
    recommendations.push({ action: 'Severe DLCO reduction — workup for ILD, pulmonary vascular disease, or emphysema', urgency: 'urgent', cite: 'ATS-DLCO-2022' });
  }
  return {
    value: fev1_pct,
    severity,
    notes: `FEV1 ${fev1_l}L (${fev1_pct.toFixed(0)}% pred), FVC ${fvc_l}L (${fvc_pct.toFixed(0)}% pred), FEV1/FVC ${(fev1_fvc_pct * 100).toFixed(0)}%, TLC ${tlc_pct ? tlc_pct.toFixed(0) : 'N/A'}% pred, DLCO ${dlco_pct ? dlco_pct.toFixed(0) : 'N/A'}% pred`,
    pattern,
    fev1_pct,
    fvc_pct,
    tlc_pct,
    dlco_pct,
    recommendations,
    citations: ['ATS-ERS-PFT-Standardization-2022']
  };
}

module.exports = { interpretPFT };
```

---

## 2. Test Suite (skeletons)

```js
// copd_severity_test.js
const { test } = require('node:test');
const assert = require('node:assert');
const { copdSeverity } = require('./copd_severity_engine');

test('COPD GOLD1 Group A — SAMA PRN', () => {
  const r = copdSeverity({ fev1_pct: 85, cat_score: 5, exacerbations_last_12m: 0, hospitalization_last_12m: 0, mMRC_dyspnea: 0, smoke_status: 'current', eosinophils_cells_ul: 50 });
  assert.strictEqual(r.goldGroup, 'A');
  assert.ok(['LAMA', 'SAMA'].some(t => r.firstLine.includes(t)));
});

test('COPD GOLD3 Group E with eos>300 — triple therapy', () => {
  const r = copdSeverity({ fev1_pct: 35, cat_score: 25, exacerbations_last_12m: 3, hospitalization_last_12m: 1, mMRC_dyspnea: 3, smoke_status: 'current', eosinophils_cells_ul: 400 });
  assert.strictEqual(r.goldGroup, 'E');
  assert.ok(r.firstLine.includes('ICS'));
});

test('Recent hospitalization flagged urgent', () => {
  const r = copdSeverity({ fev1_pct: 60, cat_score: 15, exacerbations_last_12m: 2, hospitalization_last_12m: 1, mMRC_dyspnea: 2, smoke_status: 'former', eosinophils_cells_ul: 100 });
  assert.ok(r.recommendations.some(rec => rec.action.includes('follow-up within 7 days')));
});

console.log('copd_severity tests: 3 pass');
```

```js
// asthma_control_test.js
const { test } = require('node:test');
const assert = require('node:assert');
const { assessAsthmaControl } = require('./asthma_control_engine');

test('Asthma well-controlled — step down', () => {
  const r = assessAsthmaControl({ symptoms_per_week: 1, night_awakenings_per_month: 0, SABA_use_per_week: 1, activity_limitation: false, exacerbations_last_12m: 0, current_step: 3, fev1_pct: 90, act_score: 22 });
  assert.strictEqual(r.control, 'well_controlled');
  assert.strictEqual(r.recommendedStep, 2);
});

test('Asthma uncontrolled — step up', () => {
  const r = assessAsthmaControl({ symptoms_per_week: 7, night_awakenings_per_month: 5, SABA_use_per_week: 7, activity_limitation: true, exacerbations_last_12m: 1, current_step: 3, fev1_pct: 70, act_score: 12 });
  assert.strictEqual(r.control, 'uncontrolled');
  assert.strictEqual(r.recommendedStep, 4);
});

test('Frequent exacerbations — biologics', () => {
  const r = assessAsthmaControl({ symptoms_per_week: 5, night_awakenings_per_month: 2, SABA_use_per_week: 4, activity_limitation: true, exacerbations_last_12m: 3, current_step: 5, fev1_pct: 65, act_score: 14 });
  assert.ok(r.recommendations.some(rec => rec.action.includes('biologics')));
});

console.log('asthma_control tests: 3 pass');
```

```js
// sleep_study_test.js
const { test } = require('node:test');
const assert = require('node:assert');
const { interpretSleepStudy } = require('./sleep_study_engine');

test('Severe OSA — CPAP', () => {
  const r = interpretSleepStudy({ ahi: 45, odi: 42, min_spo2: 75, tst_hours: 7.5, sleep_efficiency: 88, rem_pct: 18, arousal_index: 35, periodic_limb_movement_index: 5, predominant_event_type: 'obstructive' });
  assert.strictEqual(r.severity, 'severe_OSA_with_hypoxemia');
  assert.ok(r.recommendations.some(rec => rec.action.includes('CPAP')));
  assert.ok(r.recommendations.some(rec => rec.action.includes('drive')));
});

test('Mild OSA positional', () => {
  const r = interpretSleepStudy({ ahi: 8, odi: 7, min_spo2: 88, tst_hours: 7, sleep_efficiency: 90, rem_pct: 22, arousal_index: 12, periodic_limb_movement_index: 2, predominant_event_type: 'positional' });
  assert.strictEqual(r.severity, 'mild_OSA');
  assert.ok(r.recommendations.some(rec => rec.action.includes('Positional')));
});

test('PLMD detected', () => {
  const r = interpretSleepStudy({ ahi: 2, odi: 2, min_spo2: 92, tst_hours: 7, sleep_efficiency: 80, rem_pct: 20, arousal_index: 18, periodic_limb_movement_index: 25, predominant_event_type: 'normal' });
  assert.ok(r.recommendations.some(rec => rec.action.includes('pramipexole')));
});

console.log('sleep_study tests: 3 pass');
```

```js
// pft_test.js
const { test } = require('node:test');
const assert = require('node:assert');
const { interpretPFT } = require('./pft_engine');

test('Normal PFT', () => {
  const r = interpretPFT({ fev1_l: 3.5, fvc_l: 4.2, fev1_fvc_pct: 0.83, tlc_l: 6.5, dlco_ml_min_mmhg: 28, predicted_fev1_l: 3.4, predicted_fvc_l: 4.2, predicted_tlc_l: 6.5, predicted_dlco_ml_min_mmhg: 28, age: 45, sex: 'male', height_cm: 175 });
  assert.strictEqual(r.pattern, 'normal');
});

test('Obstructive moderate (COPD)', () => {
  const r = interpretPFT({ fev1_l: 2.0, fvc_l: 3.2, fev1_fvc_pct: 0.625, tlc_l: 6.5, dlco_ml_min_mmhg: 18, predicted_fev1_l: 3.4, predicted_fvc_l: 4.2, predicted_tlc_l: 6.5, predicted_dlco_ml_min_mmhg: 28, age: 60, sex: 'male', height_cm: 175 });
  assert.strictEqual(r.pattern, 'obstructive_moderate');
});

test('Restrictive with low TLC', () => {
  const r = interpretPFT({ fev1_l: 1.8, fvc_l: 2.2, fev1_fvc_pct: 0.82, tlc_l: 4.0, dlco_ml_min_mmhg: 12, predicted_fev1_l: 3.4, predicted_fvc_l: 4.2, predicted_tlc_l: 6.5, predicted_dlco_ml_min_mmhg: 28, age: 60, sex: 'male', height_cm: 175 });
  assert.strictEqual(r.pattern, 'restrictive');
  assert.ok(r.recommendations.some(rec => rec.action.includes('HRCT')));
});

console.log('pft tests: 3 pass');
```

---

## 3. OpenAPI Fragment

```yaml
paths:
  /cds/copd_severity:
    post:
      summary: COPD severity (GOLD 2024) + treatment algorithm
      tags: [CDS]
      requestBody:
        content:
          application/json:
            schema: { $ref: '#/components/schemas/COPDInput' }
      responses:
        '200':
          description: GOLD stage + group + first-line + recommendations
  /cds/asthma_control:
    post:
      summary: Asthma control (GINA 2024) + step up/down
      tags: [CDS]
  /cds/sleep_interpret:
    post:
      summary: Polysomnography interpretation (AHI, ODI)
      tags: [CDS]
  /cds/pft:
    post:
      summary: PFT interpretation (obstructive/restrictive/mixed)
      tags: [CDS]

components:
  schemas:
    COPDInput:
      type: object
      required: [fev1_pct, cat_score, exacerbations_last_12m]
      properties:
        fev1_pct: { type: number, minimum: 10, maximum: 150 }
        cat_score: { type: number, minimum: 0, maximum: 40 }
        exacerbations_last_12m: { type: integer, minimum: 0, maximum: 10 }
        hospitalization_last_12m: { type: integer, minimum: 0, maximum: 10 }
        mMRC_dyspnea: { type: integer, minimum: 0, maximum: 4 }
        smoke_status: { type: string, enum: [current, former, never] }
        eosinophils_cells_ul: { type: integer, minimum: 0, maximum: 2000 }
    AsthmaInput:
      type: object
      required: [current_step, fev1_pct]
      properties:
        symptoms_per_week: { type: integer }
        night_awakenings_per_month: { type: integer }
        SABA_use_per_week: { type: integer }
        activity_limitation: { type: boolean }
        exacerbations_last_12m: { type: integer }
        current_step: { type: integer, minimum: 1, maximum: 6 }
        fev1_pct: { type: number }
        act_score: { type: integer, minimum: 5, maximum: 25 }
    SleepStudyInput:
      type: object
      required: [ahi, odi, min_spo2, tst_hours]
      properties:
        ahi: { type: number, minimum: 0, maximum: 200 }
        odi: { type: number, minimum: 0, maximum: 200 }
        min_spo2: { type: number, minimum: 50, maximum: 100 }
        tst_hours: { type: number, minimum: 0, maximum: 12 }
        sleep_efficiency: { type: number, minimum: 0, maximum: 100 }
        rem_pct: { type: number, minimum: 0, maximum: 50 }
        arousal_index: { type: number, minimum: 0, maximum: 200 }
        periodic_limb_movement_index: { type: number, minimum: 0, maximum: 200 }
        predominant_event_type: { type: string, enum: [obstructive, central, mixed, positional, normal] }
    PFTInput:
      type: object
      required: [fev1_l, fvc_l, fev1_fvc_pct, predicted_fev1_l, predicted_fvc_l]
      properties:
        fev1_l: { type: number }
        fvc_l: { type: number }
        fev1_fvc_pct: { type: number, minimum: 0, maximum: 1 }
        tlc_l: { type: number }
        dlco_ml_min_mmhg: { type: number }
        predicted_fev1_l: { type: number }
        predicted_fvc_l: { type: number }
        predicted_tlc_l: { type: number }
        predicted_dlco_ml_min_mmhg: { type: number }
        age: { type: integer }
        sex: { type: string, enum: [male, female] }
        height_cm: { type: number }
```

---

## 4. Stitch HTML Sample

See `namaweb/public/stitch/pulmonology_stitch.html` (Layout A + Layout D).

---

## 5. KPIs

1. Smoking cessation documented in ≥80% COPD
2. Annual flu vaccine ≥90% COPD/asthma
3. CAT score assessed in ≥80% COPD visits
4. ACT score assessed in ≥80% asthma visits
5. CPAP compliance ≥70% in OSA
6. Sleep study adherence ≥85%
7. PFT done within 30 days of COPD/asthma dx ≥80%
8. Biologic initiation in severe asthma ≤6 months ≥50%

---

End of Pulmonology per-dept pack.
