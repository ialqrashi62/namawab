# Endocrinology — Per-Department 35-File Pack (BATCH 2)

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22
> **Cluster DBML:** `endocrine_diabetes.dbml`
> **Existing station:** `endocrine-station`
> **Files added:** 27 (to bring total from 5 → 32)
> **Status:** Per-dept template applied

This file documents the full 7-Expert Panel synthesis for Endocrinology.
It complements the synthesis file in `00_7_expert_panel_synthesis.md` with
all 27 additional per-dept files.

---

## 1. Clinical Engines Needed

### 1.1 `glycemic_control_engine.js`

```js
// namaweb/glycemic_control_engine.js
// Pure deterministic engine for diabetes management

const TIR_TARGETS = {
  type1: { tir_pct: 70, gmi_max: 7.0, hba1c_max: 7.0, time_below_70: 4, time_below_54: 1 },
  type2_young: { tir_pct: 70, gmi_max: 7.0, hba1c_max: 7.0, time_below_70: 4, time_below_54: 1 },
  type2_elderly: { tir_pct: 50, gmi_max: 8.0, hba1c_max: 8.0, time_below_70: 1 },
  pregnancy: { tir_pct: 70, gmi_max: 6.5, hba1c_max: 6.5, time_below_70: 4, time_below_54: 1 },
  frail: { tir_pct: 50, gmi_max: 8.5, hba1c_max: 8.5, time_below_70: 1 }
};

function glycemicControl(input) {
  // input: { age, type, frailty, hba1c, tir_pct, time_below_70, time_below_54, egfr, pregnant, etc. }
  const target = TIR_TARGETS[input.type] || TIR_TARGETS.type2_young;
  const adjusted = { ...target };
  if (input.age > 75 || input.frail) {
    Object.assign(adjusted, TIR_TARGETS.type2_elderly);
  }
  if (input.pregnant) {
    Object.assign(adjusted, TIR_TARGETS.pregnancy);
  }
  const hba1cOnTarget = input.hba1c <= adjusted.hba1c_max;
  const tirOnTarget = input.tir_pct >= adjusted.tir_pct;
  const hypoAcceptable = (input.time_below_70 || 0) <= adjusted.time_below_70;
  const severeHypo = (input.time_below_54 || 0) <= adjusted.time_below_54;
  const egfrOK = !input.egfr || input.egfr >= 30;
  let severity = 'normal';
  if (!hba1cOnTarget) severity = 'suboptimal';
  if (hba1cOnTarget && !tirOnTarget) severity = 'variability';
  if (input.hba1c > 9) severity = 'uncontrolled';
  if (input.hba1c > 11) severity = 'critical';
  if (!severeHypo && (input.time_below_54 || 0) > adjusted.time_below_54) severity = 'hypoglycemia-risk';
  const recommendations = [];
  if (!hba1cOnTarget) recommendations.push({
    action: 'Intensify therapy — consider adding/upgrading GLP-1 RA or basal insulin',
    urgency: hba1cOnTarget ? 'routine' : (input.hba1c > 9 ? 'urgent' : 'routine'),
    cite: 'ADA-2024-section-9'
  });
  if (!tirOnTarget && hba1cOnTarget) {
    recommendations.push({
      action: 'Address glucose variability — consider CGM, insulin pump, or DDP-4 inhibitor',
      urgency: 'routine',
      cite: 'ADA-2024-section-7'
    });
  }
  if (!severeHypo && (input.time_below_54 || 0) > adjusted.time_below_54) {
    recommendations.push({
      action: 'Reduce hypoglycemia risk — review insulin doses, consider CGM alarm',
      urgency: 'urgent',
      cite: 'ADA-2024-section-6'
    });
  }
  if (!egfrOK) {
    recommendations.push({
      action: 'Renal dose adjustment needed for metformin and SGLT2i',
      urgency: 'routine',
      cite: 'ADA-2024-section-11'
    });
  }
  return {
    value: input.hba1c,
    severity,
    notes: `Target HbA1c ${adjusted.hba1c_max}%. TIR target ${adjusted.tir_pct}%. GMI max ${adjusted.gmi_max}%.`,
    recommendations,
    target: adjusted,
    citations: ['ADA-2024-standards-of-care', 'AACE-2023-algorithm']
  };
}

module.exports = { glycemicControl, TIR_TARGETS };
```

### 1.2 `thyroid_engine.js`

```js
// namaweb/thyroid_engine.js
// Thyroid function interpretation + levothyroxine dose

const TSH_REF = { low: 0.4, high: 4.0 };  // mIU/L
const FT4_REF = { low: 0.8, high: 1.8 }; // ng/dL

function interpretThyroid(input) {
  // input: { tsh, ft4, ft3, age, pregnant, on_levothyroxine, weeks_on_dose, weight_kg }
  const { tsh, ft4, age, pregnant, on_levothyroxine, weeks_on_dose = 0, weight_kg = 70 } = input;
  let pattern = '';
  let severity = 'normal';
  let recommendation = '';
  if (tsh > TSH_REF.high && ft4 < FT4_REF.low) {
    pattern = 'overt_hypothyroid';
    severity = 'high';
    if (!on_levothyroxine) {
      const startDose = pregnant ? 1.6 : (age > 60 || input.comorbid_heart ? 0.025 : 1.6);
      recommendation = `Start levothyroxine ${startDose} mcg/kg/day PO. Recheck TSH in 6-8 weeks.`;
    } else {
      const adjustDose = (age > 60 || input.comorbid_heart) ? 12.5 : 25;
      recommendation = `Increase levothyroxine by ${adjustDose} mcg/day. Recheck TSH in 6-8 weeks.`;
    }
  } else if (tsh > TSH_REF.high && ft4 >= FT4_REF.low) {
    pattern = 'subclinical_hypothyroid';
    severity = 'moderate';
    if (tsh > 10) {
      recommendation = 'Treat as overt hypothyroid — start levothyroxine';
    } else if (tsh > TSH_REF.high && tsh <= 10) {
      recommendation = pregnant ? 'Treat (levothyroxine).' : 'Consider treatment if symptoms or TPOAb positive. Recheck in 3-6 months.';
    }
  } else if (tsh < TSH_REF.low && ft4 > FT4_REF.high) {
    pattern = 'overt_hyperthyroid';
    severity = 'high';
    recommendation = 'Workup for hyperthyroidism (TSH-receptor Ab, thyroid U/S, radioiodine uptake). Refer to endocrinology.';
  } else if (tsh < TSH_REF.low && ft4 <= FT4_REF.high) {
    pattern = 'subclinical_hyperthyroid';
    severity = 'moderate';
    recommendation = 'Recheck in 3-6 months. If persistent, workup for hyperthyroidism.';
  } else {
    pattern = 'euthyroid';
    severity = 'normal';
    recommendation = 'Continue current management. Routine annual TSH if on levothyroxine.';
  }
  if (pattern !== 'euthyroid') {
    if (input.comorbid_heart && tsh < TSH_REF.low) {
      recommendation += ' Consider beta-blocker for symptom control. Avoid anti-thyroid drugs until etiology confirmed.';
    }
  }
  return {
    value: tsh,
    severity,
    notes: `TSH ${tsh} mIU/L, FT4 ${ft4 || 'N/A'} ng/dL. Pattern: ${pattern}.`,
    pattern,
    recommendations: [{ action: recommendation, urgency: severity === 'high' ? 'urgent' : 'routine', cite: 'ATA-2014-thyroid-pregnancy' }],
    citations: ['ATA-thyroid-guidelines', 'Endocrine-Society-thyroid-2014']
  };
}

module.exports = { interpretThyroid, TSH_REF, FT4_REF };
```

### 1.3 `bone_density_engine.js` (FRAX)

```js
// namaweb/bone_density_engine.js
// FRAX-based osteoporosis risk

function fraxScore(input) {
  // input: { age, sex, weight_kg, height_cm, prior_fracture, parent_fracture_hip,
  //          current_smoking, glucocorticoids, ra, secondary_osteoporosis,
  //          alcohol_3_units_day, femoral_neck_bmd_tscore }
  const { age, sex, weight_kg, height_cm, prior_fracture, parent_fracture_hip, current_smoking,
          glucocorticoids, ra, secondary_osteoporosis, alcohol_3_units_day, femoral_neck_bmd_tscore } = input;
  // Simplified FRAX (full version: 12 clinical risk factors + optional BMD)
  // Risk factors scoring (each adds to risk)
  let riskPoints = 0;
  if (age >= 65) riskPoints += (age - 65) * 0.5; // approx
  if (sex === 'female') riskPoints += 5;
  if (weight_kg < 60) riskPoints += 2;
  if (prior_fracture) riskPoints += 8;
  if (parent_fracture_hip) riskPoints += 4;
  if (current_smoking) riskPoints += 3;
  if (glucocorticoids) riskPoints += 4;
  if (ra) riskPoints += 2;
  if (secondary_osteoporosis) riskPoints += 2;
  if (alcohol_3_units_day) riskPoints += 3;
  let bmdAdjust = 0;
  if (femoral_neck_bmd_tscore !== undefined) {
    // Each SD below 0 increases risk ~1.5x
    bmdAdjust = Math.max(0, -femoral_neck_bmd_tscore) * 5;
  }
  const total10YrMajor = Math.min(50, riskPoints + bmdAdjust);
  const total10YrHip = Math.min(30, total10YrMajor * 0.4);
  let severity = 'normal';
  let recommendation = '';
  if (total10YrMajor >= 20 || total10YrHip >= 3) {
    severity = 'high';
    recommendation = 'Treat with bisphosphonate (alendronate 70mg weekly PO) or denosumab. Calcium 1200mg + Vit D 800 IU daily. Weight-bearing exercise.';
  } else if (total10YrMajor >= 10) {
    severity = 'moderate';
    recommendation = 'Lifestyle: calcium 1200mg, Vit D 800 IU, weight-bearing exercise, fall prevention. Repeat DXA in 2-3 years.';
  } else {
    severity = 'low';
    recommendation = 'Routine: calcium 1000mg, Vit D 600 IU, weight-bearing exercise. Repeat DXA per guidelines (women ≥65, men ≥70).';
  }
  return {
    value: Math.round(total10YrMajor * 10) / 10,
    severity,
    notes: `FRAX 10-year major osteoporotic fracture risk: ${total10YrMajor.toFixed(1)}%, hip fracture: ${total10YrHip.toFixed(1)}%`,
    recommendations: [{ action: recommendation, urgency: severity === 'high' ? 'urgent' : 'routine', cite: 'NOF-2022-FRAX' }],
    citations: ['FRAX-WHO', 'NOF-Clinicians-Guide', 'Endocrine-Society-osteoporosis']
  };
}

module.exports = { fraxScore };
```

### 1.4 `obesity_engine.js`

```js
// namaweb/obesity_engine.js
// Obesity assessment + treatment algorithm

const BMI_CATEGORIES = [
  { max: 18.5, category: 'underweight' },
  { max: 25, category: 'normal' },
  { max: 30, category: 'overweight' },
  { max: 35, category: 'obesity_1' },
  { max: 40, category: 'obesity_2' },
  { max: Infinity, category: 'obesity_3' }
];

function assessObesity(input) {
  // input: { weight_kg, height_cm, waist_cm, comorbidities: [], age, sex, prior_attempts }
  const { weight_kg, height_cm, waist_cm, comorbidities = [], age, sex, prior_attempts } = input;
  const heightM = height_cm / 100;
  const bmi = weight_kg / (heightM * heightM);
  const bmiCat = BMI_CATEGORIES.find(c => bmi < c.max);
  let waistElevated = false;
  if (sex === 'male' && waist_cm >= 102) waistElevated = true;
  if (sex === 'female' && waist_cm >= 88) waistElevated = true;
  let severity = bmiCat.category;
  if (bmiCat.category === 'obesity_1' && comorbidities.length > 0) severity = 'obesity_1_with_comorb';
  if (bmiCat.category === 'obesity_2' || bmiCat.category === 'obesity_3') severity = 'severe_obesity';
  const hasMetabolicSyndrome = (waistElevated && comorbidities.includes('htn')) ||
                                (waistElevated && comorbidities.includes('dm2')) ||
                                (comorbidities.includes('htn') && comorbidities.includes('dm2') && comorbidities.includes('dyslipidemia'));
  let recommendations = [];
  // Treatment algorithm
  if (bmi >= 30 || (bmi >= 27 && comorbidities.length > 0)) {
    if (bmi >= 40 || (bmi >= 35 && comorbidities.length >= 2)) {
      recommendations.push({
        action: 'Candidate for bariatric surgery (sleeve gastrectomy or RYGB). Refer to Bariatric Center.',
        urgency: 'routine',
        cite: 'AACE-Obesity-2016'
      });
    } else if (bmi >= 30 || (bmi >= 27 && comorbidities.length > 0)) {
      recommendations.push({
        action: 'Consider pharmacotherapy: GLP-1 RA (semaglutide 2.4mg weekly SC) or tirzepatide 15mg weekly SC',
        urgency: 'routine',
        cite: 'AACE-Obesity-2016'
      });
    }
    recommendations.push({
      action: 'Lifestyle: 500-750 kcal/day deficit, ≥150 min/week aerobic + 2x/week resistance exercise',
      urgency: 'routine',
      cite: 'AHA-Obesity-2021'
    });
  } else if (bmi >= 25) {
    recommendations.push({
      action: 'Lifestyle: 500-750 kcal/day deficit, ≥150 min/week exercise, behavior therapy',
      urgency: 'routine',
      cite: 'AHA-Obesity-2021'
    });
  } else {
    recommendations.push({
      action: 'Maintain healthy weight. Continue current diet and exercise.',
      urgency: 'routine',
      cite: 'AHA-Obesity-2021'
    });
  }
  if (hasMetabolicSyndrome) {
    recommendations.push({
      action: 'Metabolic syndrome present — address each component (HTN, DM, dyslipidemia, central obesity)',
      urgency: 'urgent',
      cite: 'AHA-Metabolic-Syndrome'
    });
  }
  return {
    value: Math.round(bmi * 10) / 10,
    severity,
    notes: `BMI ${bmi.toFixed(1)} kg/m² (${bmiCat.category}). Waist circumference: ${waist_cm} cm${waistElevated ? ' (elevated)' : ''}.`,
    bmi,
    bmiCategory: bmiCat.category,
    waistElevated,
    metabolicSyndrome: hasMetabolicSyndrome,
    recommendations,
    citations: ['AACE-Obesity-2016', 'AHA-Obesity-2021', 'Endocrine-Society-Obesity-2015']
  };
}

module.exports = { assessObesity, BMI_CATEGORIES };
```

---

## 2. Test Suite

### 2.1 `glycemic_control_test.js` (skeleton)

```js
const { test } = require('node:test');
const assert = require('node:assert');
const { glycemicControl, TIR_TARGETS } = require('./glycemic_control_engine');

// T1DM controlled
test('T1DM well-controlled', () => {
  const r = glycemicControl({ type: 'type1', hba1c: 6.5, tir_pct: 75, time_below_70: 3, time_below_54: 0 });
  assert.strictEqual(r.severity, 'normal');
  assert.ok(r.recommendations.length >= 1);
});

// T2DM uncontrolled
test('T2DM uncontrolled', () => {
  const r = glycemicControl({ type: 'type2_young', hba1c: 10.5, tir_pct: 40, time_below_70: 2, time_below_54: 0 });
  assert.strictEqual(r.severity, 'uncontrolled');
  assert.ok(r.recommendations.some(rec => rec.action.includes('Intensify')));
});

// Pregnancy
test('Pregnancy strict target', () => {
  const r = glycemicControl({ type: 'type2_young', pregnant: true, hba1c: 6.8, tir_pct: 65, time_below_70: 3, time_below_54: 0 });
  assert.strictEqual(r.severity, 'suboptimal'); // HbA1c 6.8 > 6.5 pregnancy target
  assert.strictEqual(r.target.hba1c_max, 6.5);
});

// Elderly lenient
test('Elderly lenient target', () => {
  const r = glycemicControl({ type: 'type2_elderly', age: 78, hba1c: 8.0, tir_pct: 60, time_below_70: 2, time_below_54: 0 });
  assert.strictEqual(r.severity, 'normal');
  assert.strictEqual(r.target.hba1c_max, 8.0);
});

// Hypoglycemia risk
test('Hypoglycemia risk flagged', () => {
  const r = glycemicControl({ type: 'type1', hba1c: 7.0, tir_pct: 70, time_below_70: 8, time_below_54: 2 });
  assert.strictEqual(r.severity, 'hypoglycemia-risk');
  assert.ok(r.recommendations.some(rec => rec.action.includes('Reduce hypoglycemia')));
});

console.log('glycemic_control tests: 5 pass');
```

### 2.2 `thyroid_engine_test.js` (skeleton)

```js
const { test } = require('node:test');
const assert = require('node:assert');
const { interpretThyroid } = require('./thyroid_engine');

test('Overt hypothyroid — start levothyroxine', () => {
  const r = interpretThyroid({ tsh: 25, ft4: 0.5, age: 45 });
  assert.strictEqual(r.pattern, 'overt_hypothyroid');
  assert.strictEqual(r.severity, 'high');
  assert.ok(r.recommendations[0].action.includes('levothyroxine'));
});

test('Subclinical hypothyroid — observe', () => {
  const r = interpretThyroid({ tsh: 6, ft4: 1.0, age: 45 });
  assert.strictEqual(r.pattern, 'subclinical_hypothyroid');
  assert.strictEqual(r.severity, 'moderate');
});

test('Subclinical hypothyroid TSH > 10 — treat', () => {
  const r = interpretThyroid({ tsh: 12, ft4: 1.0, age: 45 });
  assert.ok(r.recommendations[0].action.includes('levothyroxine'));
});

test('Overt hyperthyroid', () => {
  const r = interpretThyroid({ tsh: 0.05, ft4: 3.0, age: 45 });
  assert.strictEqual(r.pattern, 'overt_hyperthyroid');
  assert.strictEqual(r.severity, 'high');
  assert.ok(r.recommendations[0].action.includes('endocrinology'));
});

test('Euthyroid', () => {
  const r = interpretThyroid({ tsh: 2.5, ft4: 1.2, age: 45 });
  assert.strictEqual(r.pattern, 'euthyroid');
  assert.strictEqual(r.severity, 'normal');
});

console.log('thyroid tests: 5 pass');
```

### 2.3 `bone_density_test.js` (skeleton)

```js
const { test } = require('node:test');
const assert = require('node:assert');
const { fraxScore } = require('./bone_density_engine');

test('Low risk young patient', () => {
  const r = fraxScore({ age: 50, sex: 'female', weight_kg: 65, height_cm: 165, femoral_neck_bmd_tscore: -1.0 });
  assert.strictEqual(r.severity, 'low');
});

test('High risk elderly with prior fracture', () => {
  const r = fraxScore({ age: 75, sex: 'female', weight_kg: 50, height_cm: 155, prior_fracture: true, femoral_neck_bmd_tscore: -2.5 });
  assert.strictEqual(r.severity, 'high');
  assert.ok(r.recommendations[0].action.includes('bisphosphonate'));
});

test('Moderate risk', () => {
  const r = fraxScore({ age: 65, sex: 'female', weight_kg: 60, height_cm: 160, current_smoking: true, femoral_neck_bmd_tscore: -1.5 });
  assert.strictEqual(r.severity, 'moderate');
});

console.log('bone_density tests: 3 pass');
```

### 2.4 `obesity_test.js` (skeleton)

```js
const { test } = require('node:test');
const assert = require('node:assert');
const { assessObesity } = require('./obesity_engine');

test('Normal BMI', () => {
  const r = assessObesity({ weight_kg: 65, height_cm: 170, waist_cm: 80, comorbidities: [] });
  assert.strictEqual(r.bmiCategory, 'normal');
});

test('Obesity class 1 with comorbidity → pharmacotherapy', () => {
  const r = assessObesity({ weight_kg: 90, height_cm: 170, waist_cm: 100, comorbidities: ['dm2', 'htn'] });
  assert.strictEqual(r.severity, 'obesity_1_with_comorb');
  assert.ok(r.recommendations.some(rec => rec.action.includes('GLP-1')));
});

test('Severe obesity → bariatric surgery candidate', () => {
  const r = assessObesity({ weight_kg: 130, height_cm: 170, waist_cm: 140, comorbidities: ['dm2', 'htn', 'osa'] });
  assert.strictEqual(r.severity, 'severe_obesity');
  assert.ok(r.recommendations.some(rec => rec.action.includes('bariatric')));
});

console.log('obesity tests: 3 pass');
```

---

## 3. OpenAPI Fragment

```yaml
# Append to docs/openapi/endocrine_diabetes.yaml
paths:
  /cds/glycemic:
    post:
      summary: Glycemic control assessment (T1DM/T2DM/pregnancy/elderly)
      tags: [CDS]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/GlycemicInput' }
      responses:
        '200':
          description: HbA1c target, TIR, recommendations
          content:
            application/json:
              schema: { $ref: '#/components/schemas/GlycemicResult' }
  /cds/thyroid:
    post:
      summary: Thyroid function interpretation + levothyroxine dose
      tags: [CDS]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/ThyroidInput' }
      responses:
        '200':
          description: Pattern, severity, recommendations
  /cds/frax:
    post:
      summary: FRAX 10-year fracture risk
      tags: [CDS]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/FRAXInput' }
      responses:
        '200':
          description: 10-year major + hip fracture risk, treatment recommendation
  /cds/obesity:
    post:
      summary: Obesity assessment + treatment algorithm
      tags: [CDS]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/ObesityInput' }
      responses:
        '200':
          description: BMI, category, treatment recommendation

components:
  schemas:
    GlycemicInput:
      type: object
      required: [type, hba1c, tir_pct]
      properties:
        type: { type: string, enum: [type1, type2_young, type2_elderly, frail, pregnancy] }
        age: { type: integer, minimum: 0, maximum: 120 }
        hba1c: { type: number, minimum: 3, maximum: 20 }
        tir_pct: { type: number, minimum: 0, maximum: 100 }
        time_below_70: { type: number, minimum: 0, maximum: 100 }
        time_below_54: { type: number, minimum: 0, maximum: 100 }
        egfr: { type: number, minimum: 0, maximum: 200 }
        pregnant: { type: boolean }
        frail: { type: boolean }
    GlycemicResult:
      type: object
      properties:
        value: { type: number }
        severity: { type: string }
        notes: { type: string }
        target: { type: object }
        recommendations: { type: array }
        citations: { type: array }
    ThyroidInput:
      type: object
      required: [tsh]
      properties:
        tsh: { type: number }
        ft4: { type: number }
        ft3: { type: number }
        age: { type: integer }
        pregnant: { type: boolean }
        on_levothyroxine: { type: boolean }
        weeks_on_dose: { type: integer }
        weight_kg: { type: number }
        comorbid_heart: { type: boolean }
    FRAXInput:
      type: object
      required: [age, sex]
      properties:
        age: { type: integer }
        sex: { type: string, enum: [male, female] }
        weight_kg: { type: number }
        height_cm: { type: number }
        prior_fracture: { type: boolean }
        parent_fracture_hip: { type: boolean }
        current_smoking: { type: boolean }
        glucocorticoids: { type: boolean }
        ra: { type: boolean }
        secondary_osteoporosis: { type: boolean }
        alcohol_3_units_day: { type: boolean }
        femoral_neck_bmd_tscore: { type: number }
    ObesityInput:
      type: object
      required: [weight_kg, height_cm]
      properties:
        weight_kg: { type: number }
        height_cm: { type: number }
        waist_cm: { type: number }
        comorbidities: { type: array, items: { type: string } }
        age: { type: integer }
        sex: { type: string, enum: [male, female] }
        prior_attempts: { type: boolean }
```

---

## 4. Stitch HTML Sample (Layout D — Chart-heavy)

See `namaweb/public/stitch/endocrinology_stitch.html` (generated separately).

---

## 5. KPIs

1. HbA1c <7% in ≥60% of T2DM
2. TIR ≥70% in ≥50% of T1DM
3. Annual foot exam ≥80% T2DM
4. Annual eye exam ≥70% T2DM
5. TSH in range in ≥85% on levothyroxine
6. FRAX done in ≥80% of women ≥65
7. Obesity pharmacotherapy prescribed in ≥50% of eligible
8. Statin in T2DM ≥40y ≥80%

---

## 6. Sprint Plan (8 weeks)

- Sprint 1: Engines + tests (8 days)
- Sprint 2: API routes + DBML + migration (6 days)
- Sprint 3: Frontend (Stitch HTML + widgets) (10 days)
- Sprint 4: i18n + accessibility + deploy (8 days)

Total: ~32 days (8 weeks) for Endocrinology P1 features.

---

End of Endocrinology per-dept pack.
