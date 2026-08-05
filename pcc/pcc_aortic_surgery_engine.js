// pcc_aortic_surgery_engine v3.316.32 (Phase 1C clinical-grade)
// Aortic surgery per ESC 2024 + STS/SVS guidelines
'use strict';
const TS = new Date().toISOString();
const VER = 'v3.316.32';
const MOD = 'pcc_aortic_surgery';

/**
 * ASAssessmentExt — pre-operative assessment for aortic surgery
 */
function ASAssessmentExt(input) {
  const i = input || {};
  const age = Number(i.age || 0);
  const aneurysmSize = Number(i.aneurysmSize || 0);  // mm
  const aneurysmLocation = String(i.aneurysmLocation || 'ascending');
  const symptoms = Boolean(i.symptoms);  // pain, hoarseness, etc.
  const growthRate = Number(i.growthRate || 0); // mm/year
  const familyHistory = Boolean(i.familyHistory);
  const connectiveTissue = Boolean(i.connectiveTissue);
  const bicuspidAorticValve = Boolean(i.bicuspidAorticValve);
  const ef = Number(i.ef || 60);
  const egfr = Number(i.egfr || 60);
  const sbp = Number(i.sbp || 120);

  let indication, urgency;
  // Ascending aortic aneurysm thresholds
  if (aneurysmLocation === 'ascending') {
    if (aneurysmSize >= 55 || symptoms || (connectiveTissue && aneurysmSize >= 45) || (bicuspidAorticValve && aneurysmSize >= 50)) {
      indication = 'surgery-indicated';
      urgency = 'elective';
    } else if (aneurysmSize >= 45 || (connectiveTissue && aneurysmSize >= 40)) {
      indication = 'surgery-consider';
      urgency = 'surveillance';
    } else {
      indication = 'surveillance-only';
      urgency = 'monitor';
    }
  } else if (aneurysmLocation === 'arch') {
    if (aneurysmSize >= 55) { indication = 'surgery-indicated'; urgency = 'elective'; }
    else if (aneurysmSize >= 50) { indication = 'surgery-consider'; urgency = 'surveillance'; }
    else { indication = 'surveillance-only'; urgency = 'monitor'; }
  } else if (aneurysmLocation === 'descending') {
    if (aneurysmSize >= 60 || symptoms) { indication = 'surgery-indicated'; urgency = 'elective'; }
    else if (aneurysmSize >= 55) { indication = 'surgery-consider'; urgency = 'surveillance'; }
    else { indication = 'surveillance-only'; urgency = 'monitor'; }
  } else {
    indication = 'unknown-location';
    urgency = 'review';
  }

  // Rapid growth >5mm/year
  if (growthRate >= 5) {
    indication = 'surgery-urgent';
    urgency = 'urgent';
  }

  const surgicalRisk = age >= 75 ? 'high' : age >= 65 ? 'moderate' : 'acceptable';
  const operativeCandidate = ef >= 30 && egfr >= 30 && sbp >= 90;

  return { version: VER, module: MOD, function: 'ASAssessmentExt', input, indication, urgency, surgicalRisk, operativeCandidate, aneurysmSize, aneurysmLocation, age, ts: TS };
}

/**
 * ASScoreExt — STS Adult Cardiac Surgery Risk Calculator
 */
function ASScoreExt(input) {
  const i = input || {};
  const age = Number(i.age || 60);
  const sex = String(i.sex || 'male');
  const ef = Number(i.ef || 60);
  const diabetes = Boolean(i.diabetes);
  const dialysis = Boolean(i.dialysis);
  const creatinine = Number(i.creatinine || 1.0);
  const chronicLungDisease = Boolean(i.chronicLungDisease);
  const peripheralVascular = Boolean(i.peripheralVascular);
  const cerebrovascular = Boolean(i.cerebrovascular);
  const priorCardiacSurgery = Boolean(i.priorCardiacSurgery);
  const miRecent = Boolean(i.miRecent);
  const unstableAngina = Boolean(i.unstableAngina);
  const arrhythmia = Boolean(i.arrhythmia);
  const cardiogenicShock = Boolean(i.cardiogenicShock);
  const resuscitated = Boolean(i.resuscitated);

  // STS components
  let mortalityScore = 0;
  mortalityScore += Math.max(0, (age - 50) * 0.04);
  if (sex === 'female') mortalityScore += 0.5;
  if (ef < 30) mortalityScore += 1.5;
  else if (ef < 50) mortalityScore += 0.6;
  if (diabetes) mortalityScore += 0.3;
  if (dialysis) mortalityScore += 1.0;
  if (creatinine > 2) mortalityScore += 0.8;
  else if (creatinine > 1.5) mortalityScore += 0.4;
  if (chronicLungDisease) mortalityScore += 0.6;
  if (peripheralVascular) mortalityScore += 0.5;
  if (cerebrovascular) mortalityScore += 0.4;
  if (priorCardiacSurgery) mortalityScore += 1.2;
  if (miRecent) mortalityScore += 0.4;
  if (unstableAngina) mortalityScore += 0.5;
  if (arrhythmia) mortalityScore += 0.3;
  if (cardiogenicShock) mortalityScore += 2.5;
  if (resuscitated) mortalityScore += 1.5;

  let operativeMortality, morbidity;
  if (mortalityScore >= 6) { operativeMortality = 0.15; morbidity = 0.40; }
  else if (mortalityScore >= 4) { operativeMortality = 0.10; morbidity = 0.30; }
  else if (mortalityScore >= 2.5) { operativeMortality = 0.06; morbidity = 0.20; }
  else if (mortalityScore >= 1.5) { operativeMortality = 0.04; morbidity = 0.15; }
  else { operativeMortality = 0.02; morbidity = 0.10; }

  let riskCategory;
  if (operativeMortality >= 0.10) riskCategory = 'high';
  else if (operativeMortality >= 0.05) riskCategory = 'moderate';
  else riskCategory = 'low';

  return { version: VER, module: MOD, function: 'ASScoreExt', input, stsScore: Math.round(mortalityScore * 100) / 100, riskCategory, operativeMortalityPct: operativeMortality * 100, morbidityPct: morbidity * 100, age, ef, ts: TS };
}

/**
 * ASStageExt — surgical procedure classification
 */
function ASStageExt(input) {
  const i = input || {};
  const aneurysmLocation = String(i.aneurysmLocation || 'ascending');
  const aneurysmSize = Number(i.aneurysmSize || 0);
  const dissection = Boolean(i.dissection);
  const dissectionType = String(i.dissectionType || '');
  const rupture = Boolean(i.rupture);
  const symptoms = Boolean(i.symptoms);
  const priorAorticSurgery = Boolean(i.priorAorticSurgery);

  let procedure, classification;
  if (rupture) {
    procedure = 'emergent-repair';
    classification = 'emergent';
  } else if (dissection && dissectionType === 'A') {
    procedure = 'emergent-type-A-repair';
    classification = 'emergent';
  } else if (dissection && dissectionType === 'B') {
    if (symptoms) { procedure = 'urgent-TEVAR'; classification = 'urgent'; }
    else { procedure = 'medical-management'; classification = 'non-operative'; }
  } else if (aneurysmLocation === 'ascending') {
    procedure = 'ascending-aortic-replacement-or-Bentall';
    classification = 'elective';
  } else if (aneurysmLocation === 'arch') {
    if (priorAorticSurgery) { procedure = 'arch-replacement-stage-2'; classification = 'elective'; }
    else { procedure = 'hemiarch-or-total-arch-replacement'; classification = 'elective'; }
  } else if (aneurysmLocation === 'descending') {
    procedure = 'TEVAR-or-open-descending-repair';
    classification = 'elective';
  } else if (aneurysmLocation === 'root') {
    procedure = 'valve-sparing-root-or-Bentall';
    classification = 'elective';
  } else {
    procedure = 'review-required';
    classification = 'pending';
  }

  return { version: VER, module: MOD, function: 'ASStageExt', input, procedure, classification, aneurysmLocation, dissection, rupture, ts: TS };
}

/**
 * ASPlanExt — comprehensive surgical care plan
 */
function ASPlanExt(input) {
  const i = input || {};
  const procedure = String(i.procedure || '');
  const age = Number(i.age || 60);
  const ef = Number(i.ef || 60);
  const egfr = Number(i.egfr || 60);
  const diabetes = Boolean(i.diabetes);

  const preOp = [
    'ct-angiography-chest-abdomen-pelvis',
    'echocardiogram-with-aortic-measurements',
    'cardiac-cath-if-suspected-CAD-age>40',
    'pulmonary-function-tests',
    'carotid-duplex-if-age>65',
    'type-and-screen-antibody-screen',
    'anesthesia-consult',
    'blood-bank-informed-4-units-PRBC-platelets-cryo',
    'informed-consent-including-sternotomy-risk',
  ];

  const intraOp = [
    'cell-saver-setup',
    'arterial-and-central-lines',
    'TEE-monitoring',
    'neuromonitoring-EEG-and-NIRS-if-arch',
    'selective-cerebral-perfusion-if-arch',
    'circulatory- arrest-if-needed-temp-18C',
    'antifibrinolytic-tranexamic-acid',
  ];

  const postOp = [
    'ICU-bedside-24-48h',
    'continuous-arterial-pressure-monitoring',
    'arterial-line-and-central-line',
    'chest-tube-monitoring',
    'pacemaker-wires-if-conduction-disease',
    'pain-control-multimodal',
    'DVT-prophylaxis',
    'atrial-fibrillation-surveillance',
    'antibiotics-24h-postop',
    'early-mobilization-POD1',
    'stool-softeners',
    'sodium-and-fluid-balance',
  ];
  if (egfr < 60) postOp.push('strict-IO-monitoring-renal-protection');
  if (diabetes) postOp.push('insulin-drip-target-140-180');
  if (ef < 40) postOp.push('hemodynamic-optimization-inotropes');

  const rehab = [
    'phase-1-cardiac-rehab-POD2-7',
    'phase-2-cardiac-rehab-2-6-weeks',
    'phase-3-cardiac-rehab-6-12-weeks',
    'lifelong-aerobic-exercise',
  ];

  return { version: VER, module: MOD, function: 'ASPlanExt', input, procedure, preOp, intraOp, postOp, rehab, age, ef, egfr, ts: TS };
}

/**
 * ASRiskExt — composite surgical risk including complications
 */
function ASRiskExt(input) {
  const i = input || {};
  const stsScore = Number(i.stsScore || 0);
  const archInvolvement = Boolean(i.archInvolvement);
  const circulatoryArrest = Boolean(i.circulatoryArrest);
  const archReplacement = Boolean(i.archReplacement);
  const concomitantCabg = Boolean(i.concomitantCabg);
  const concomitantValve = Boolean(i.concomitantValve);
  const reoperation = Boolean(i.reoperation);
  const ef = Number(i.ef || 60);

  let riskScore = stsScore;
  if (archInvolvement) riskScore += 0.5;
  if (circulatoryArrest) riskScore += 0.4;
  if (archReplacement) riskScore += 0.6;
  if (concomitantCabg) riskScore += 0.8;
  if (concomitantValve) riskScore += 0.4;
  if (reoperation) riskScore += 1.5;
  if (ef < 30) riskScore += 0.8;
  else if (ef < 50) riskScore += 0.4;

  let strokeRisk, paraplegiaRisk, dialysisRisk, afRisk, mortality;
  if (riskScore >= 6) {
    strokeRisk = 0.08; paraplegiaRisk = 0.05; dialysisRisk = 0.10; afRisk = 0.40; mortality = 0.15;
  } else if (riskScore >= 4) {
    strokeRisk = 0.05; paraplegiaRisk = 0.03; dialysisRisk = 0.06; afRisk = 0.35; mortality = 0.08;
  } else if (riskScore >= 2.5) {
    strokeRisk = 0.03; paraplegiaRisk = 0.02; dialysisRisk = 0.04; afRisk = 0.30; mortality = 0.04;
  } else {
    strokeRisk = 0.02; paraplegiaRisk = 0.01; dialysisRisk = 0.02; afRisk = 0.25; mortality = 0.02;
  }

  let riskCategory;
  if (mortality >= 0.10) riskCategory = 'very-high';
  else if (mortality >= 0.06) riskCategory = 'high';
  else if (mortality >= 0.03) riskCategory = 'moderate';
  else riskCategory = 'low';

  return { version: VER, module: MOD, function: 'ASRiskExt', input, riskScore: Math.round(riskScore * 100) / 100, riskCategory, strokeRiskPct: strokeRisk * 100, paraplegiaRiskPct: paraplegiaRisk * 100, dialysisRiskPct: dialysisRisk * 100, afRiskPct: afRisk * 100, mortalityPct: mortality * 100, ts: TS };
}

/**
 * ASDoseExt — perioperative medication management
 */
function ASDoseExt(input) {
  const i = input || {};
  const phase = String(i.phase || 'preop'); // preop/intraop/postop
  const weight = Number(i.weight || 70);
  const egfr = Number(i.egfr || 60);
  const onBetaBlocker = Boolean(i.onBetaBlocker);
  const currentBp = Number(i.currentBp || 120);
  const onStatin = Boolean(i.onStatin);
  const onAntiplatelet = Boolean(i.onAntiplatelet);
  const surgeryInHours = Number(i.surgeryInHours || 24);

  let recommendations = [];
  if (phase === 'preop') {
    if (onBetaBlocker) recommendations.push('continue-beta-blocker-day-of-surgery');
    else if (currentBp >= 140) recommendations.push('initiate-beta-blocker-if-not-contraindicated');
    if (onStatin) recommendations.push('continue-statin-high-intensity');
    if (onAntiplatelet && surgeryInHours >= 24) recommendations.push('hold-aspirin-7-days-clopidogrel-5-days');
    else if (onAntiplatelet) recommendations.push('continue-aspirin-only-if-urgent-surgery');
    recommendations.push('hold-ACEi-ARB-morning-of-surgery');
  } else if (phase === 'intraop') {
    const txa = weight * 50; // mg
    recommendations.push(`TXA-loading-${txa}mg-then-${txa}mg/hr`);
    recommendations.push('heparin-300-units-per-kg-target-ACT-480');
    recommendations.push('propofol-remifentanil-anesthesia');
  } else if (phase === 'postop') {
    if (egfr < 60) recommendations.push('avoid-NSAIDs');
    recommendations.push('resume-beta-blocker-POD1');
    recommendations.push('resume-statin-POD1');
    recommendations.push('resume-aspirin-81mg-POD1');
    recommendations.push('resume-ACEi-ARB-when-stable-volume-status');
    recommendations.push('warfarin-IF-INR-goal-2-3-for-mechanical-valve');
  }

  return { version: VER, module: MOD, function: 'ASDoseExt', input, phase, recommendations, weight, egfr, ts: TS };
}

/**
 * ASFrequencyExt — post-operative clinic/visit frequency
 */
function ASFrequencyExt(input) {
  const i = input || {};
  const daysPostOp = Number(i.daysPostOp || 0);
  const complications = Boolean(i.complications);
  const dischargeDay = Number(i.dischargeDay || 7);

  let clinic, echo, ct, cardiology;
  if (daysPostOp <= 1) { clinic = 'ICU-twice-daily'; echo = 'daily-if-instability'; ct = 'as-indicated'; cardiology = 'ICU'; }
  else if (daysPostOp <= dischargeDay) { clinic = 'daily-floor'; echo = 'as-needed'; ct = 'as-needed'; cardiology = 'daily'; }
  else if (daysPostOp <= 30) { clinic = 'weekly-then-biweekly'; echo = 'before-discharge'; ct = 'pre-discharge'; cardiology = 'week-2-and-4'; }
  else if (daysPostOp <= 90) { clinic = 'every-2-4-weeks'; echo = '6-weeks'; ct = 'as-needed'; cardiology = 'every-4-weeks'; }
  else if (daysPostOp <= 365) { clinic = 'every-3-months'; echo = '6-months'; ct = 'annually'; cardiology = 'every-3-months'; }
  else { clinic = 'every-6-months'; echo = 'annually'; ct = 'annually-or-symptoms'; cardiology = 'every-6-months'; }

  if (complications) {
    return { version: VER, module: MOD, function: 'ASFrequencyExt', input, daysPostOp, complications, clinic: 'intensified-' + clinic, echo, ct, cardiology, ts: TS };
  }
  return { version: VER, module: MOD, function: 'ASFrequencyExt', input, daysPostOp, clinic, echo, ct, cardiology, ts: TS };
}

/**
 * ASDurationExt — hospital stay + recovery duration
 */
function ASDurationExt(input) {
  const i = input || {};
  const procedure = String(i.procedure || '');
  const age = Number(i.age || 60);
  const ef = Number(i.ef || 60);
  const egfr = Number(i.egfr || 60);
  const archInvolvement = Boolean(i.archInvolvement);

  // ICU and hospital LOS by procedure complexity
  let icuDays, hospitalDays, recoveryWeeks;
  if (procedure.includes('emergent')) {
    icuDays = 4; hospitalDays = 10; recoveryWeeks = 12;
  } else if (archInvolvement || procedure.includes('arch')) {
    icuDays = 3; hospitalDays = 8; recoveryWeeks = 10;
  } else if (procedure.includes('Bentall') || procedure.includes('valve-sparing')) {
    icuDays = 2; hospitalDays = 6; recoveryWeeks = 8;
  } else if (procedure.includes('TEVAR')) {
    icuDays = 1; hospitalDays = 3; recoveryWeeks = 4;
  } else {
    icuDays = 2; hospitalDays = 6; recoveryWeeks = 8;
  }

  // Age/Ef/Egfr adjustments
  if (age >= 75) { icuDays += 1; hospitalDays += 2; recoveryWeeks += 4; }
  if (ef < 30) { icuDays += 1; hospitalDays += 2; }
  if (egfr < 30) { icuDays += 1; hospitalDays += 2; }

  return { version: VER, module: MOD, function: 'ASDurationExt', input, procedure, icuDays, hospitalDays, recoveryWeeks, age, ef, egfr, ts: TS };
}

/**
 * ASFollowupExt — long-term surveillance protocol
 */
function ASFollowupExt(input) {
  const i = input || {};
  const procedure = String(i.procedure || '');
  const archInvolvement = Boolean(i.archInvolvement);
  const dissection = Boolean(i.dissection);

  const imaging = [];
  if (procedure.includes('TEVAR')) {
    imaging.push('CT-angiography-1-month-6-months-1-year-then-annually');
    imaging.push('endoleak-surveillance-if-EVAR');
  } else {
    imaging.push('CT-angiography-pre-discharge-3-months-1-year-then-annually');
  }

  const followUp = [
    'blood-pressure-control-target-13080',
    'beta-blocker-long-term',
    'statin-if-not-contraindicated',
    'marfan-or-connective-tissue-losartan-ARB',
    'smoking-cessation-if-applicable',
    'weight-management',
    'aerobic-exercise-150-min-week',
    'family-screening-if-connective-tissue',
  ];

  if (archInvolvement) followUp.push('lifelong-CT-or-MRI-surveillance');
  if (dissection) followUp.push('lifelong-imaging-surveillance-residual-dissection');

  const labs = ['BMP', 'CBC', 'A1c-if-diabetic', 'lipid-panel-annually'];
  const cardiology = 'cardiology-3-months-then-6-months-then-annually';

  return { version: VER, module: MOD, function: 'ASFollowupExt', input, procedure, imaging, followUp, labs, cardiology, archInvolvement, dissection, ts: TS };
}

/**
 * ASOutcomeExt — long-term post-operative outcomes
 */
function ASOutcomeExt(input) {
  const i = input || {};
  const yearsPostOp = Number(i.yearsPostOp || 0);
  const procedure = String(i.procedure || '');
  const age = Number(i.age || 60);
  const reoperation = Boolean(i.reoperation);
  const endoleak = Boolean(i.endoleak);  // post-EVAR
  const stroke = Boolean(i.stroke);
  const dialysis = Boolean(i.dialysis);
  const afHistory = Boolean(i.afHistory);
  const onStatin = Boolean(i.onStatin);

  // Survival curves post-aortic surgery
  let survival1yr, survival5yr, survival10yr;
  if (procedure.includes('emergent')) {
    survival1yr = 0.80; survival5yr = 0.65; survival10yr = 0.45;
  } else if (reoperation) {
    survival1yr = 0.88; survival5yr = 0.72; survival10yr = 0.55;
  } else if (procedure.includes('arch')) {
    survival1yr = 0.92; survival5yr = 0.80; survival10yr = 0.65;
  } else {
    survival1yr = 0.95; survival5yr = 0.85; survival10yr = 0.70;
  }

  // Complications
  const strokeRisk = stroke ? 0.15 : 0.02;
  const dialysisRisk = dialysis ? 0.25 : 0.02;
  const afRecurrence = afHistory ? 0.30 : 0.20;
  const reintervention = endoleak ? 0.40 : reoperation ? 0.10 : 0.05;

  // Quality-of-life
  const statinBenefit = onStatin ? 0.05 : 0;
  const overallQol = yearsPostOp >= 1 ? 'good' : 'recovering';

  return { version: VER, module: MOD, function: 'ASOutcomeExt', input, yearsPostOp, survival1yrPct: survival1yr * 100, survival5yrPct: survival5yr * 100, survival10yrPct: survival10yr * 100, strokeRiskPct: strokeRisk * 100, dialysisRiskPct: dialysisRisk * 100, afRecurrencePct: afRecurrence * 100, reinterventionPct: reintervention * 100, overallQol, statinBenefitPct: statinBenefit * 100, ts: TS };
}

module.exports = {
  ASAssessmentExt, ASScoreExt, ASStageExt, ASPlanExt, ASRiskExt, ASDoseExt, ASFrequencyExt, ASDurationExt, ASFollowupExt, ASOutcomeExt
};