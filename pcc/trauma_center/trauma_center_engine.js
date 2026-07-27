// P3-AQ: Trauma-Center Engine — 10 pure functions
const Engine = {};

Engine.TraumaActivationLevel = function ({ mechanism = 'mvc', sbp = 100, gcs = 15, hr = 100, penetrating = false } = {}) {
  let activation;
  if (gcs <= 8 || sbp < 90) activation = 'trauma-1-highest-activation';
  else if (penetrating || mechanism === 'high-speed-deceleration') activation = 'trauma-2-urgent-activation';
  else if (sbp < 100 || gcs <= 13) activation = 'trauma-2-urgent-activation';
  else if (mechanism === 'fall-from-20ft') activation = 'trauma-2-urgent-activation';
  else if (gcs <= 13) activation = 'trauma-3-consult';
  else activation = 'trauma-3-evaluation';
  return { activation, recommendation: activation.includes('trauma-1') ? 'full-team-activation' : (activation.includes('trauma-2') ? 'urgent-trauma-team' : 'trauma-consult') };
};

Engine.ISS = function ({ ais1 = 1, ais2 = 1, ais3 = 1, ais4 = 1, ais5 = 1, ais6 = 1 } = {}) {
  const arr = [ais1, ais2, ais3, ais4, ais5, ais6].sort((a, b) => b - a);
  const iss = arr[0] * arr[0] + arr[1] * arr[1] + arr[2] * arr[2];
  let severity;
  if (iss >= 25) severity = 'critical-25-or-greater';
  else if (iss >= 16) severity = 'severe-16-24';
  else if (iss >= 9) severity = 'moderate-9-15';
  else if (iss >= 1) severity = 'minor-1-8';
  else severity = 'no-injury';
  return { iss, severity, recommendation: iss >= 16 ? 'trauma-ICU' : (iss >= 9 ? 'trauma-floor' : 'trauma-observation') };
};

Engine.HemorrhageClass = function ({ bloodLoss = 0, weight = 70, hr = 100, sbp = 100, rr = 18, mental = 'alert', urineOutput = 50 } = {}) {
  const lossPercent = (bloodLoss / (weight * 70)) * 100;
  let className;
  if (lossPercent < 15 && hr < 100 && mental === 'alert') className = 'class-I-minimal';
  else if (lossPercent < 30 && hr < 120) className = 'class-II-mild';
  else if (lossPercent < 40 && hr >= 120 || mental === 'anxious') className = 'class-III-moderate';
  else if (lossPercent >= 40 || mental === 'confused' || urineOutput < 20) className = 'class-IV-severe';
  else className = 'class-I-minimal';
  return { class: className, lossPercent: Math.round(lossPercent), recommendation: className.includes('class-IV') || className.includes('class-III') ? 'massive-transfusion-protocol' : 'standard-fluid' };
};

Engine.PenetratingInjury = function ({ site = 'abdomen', hemodynamicStable = true, evisceration = false, hardSigns = false } = {}) {
  let pathway;
  if (hardSigns) pathway = 'immediate-OR-exploration';
  else if (evisceration) pathway = 'evisceration-cover-and-emergent-OR';
  else if (site === 'abdomen' && hemodynamicStable === false) pathway = 'OR-exploration-unstable';
  else if (site === 'abdomen' && hemodynamicStable) pathway = 'CT-with-contrast-stable';
  else if (site === 'chest' && hemodynamicStable === false) pathway = 'OR-or-tube-thoracostomy';
  else if (site === 'chest' && hemodynamicStable) pathway = 'CT-with-contrast-stable';
  else if (site === 'neck') pathway = 'hard-signs-OR-else-zone-CTA';
  else if (site === 'extremity') pathway = 'CTA-extremity-vascular';
  else pathway = 'workup';
  return { pathway, recommendation: pathway.includes('OR') || pathway.includes('CTA') ? 'immediate-action' : 'imaging' };
};

Engine.BluntTrauma = function ({ mechanism = 'mvc', painLocations = [], fastPositive = false, ctFindings = 'pending' } = {}) {
  let pathway;
  if (fastPositive) pathway = 'FAST-positive-OR-exploration';
  else if (ctFindings === 'hemoperitoneum') pathway = 'CT-positive-OR-or-IR';
  else if (mechanism === 'fall-from-20ft' && painLocations.length >= 3) pathway = 'multi-trauma-CTA-pan-scan';
  else if (mechanism === 'mvc-ejection') pathway = 'pan-scan-and-OR-evaluation';
  else if (mechanism === 'pedestrian-struck') pathway = 'pan-scan-and-trauma-team';
  else if (painLocations.length >= 2) pathway = 'CT-pan-scan';
  else pathway = 'workup-targeted-CT';
  return { pathway, recommendation: pathway.includes('OR') ? 'OR-team-activation' : 'CT-pan-scan' };
};

Engine.FocusedAssessment = function ({ freeFluid = 'no', pericardial = 'no', pneumothorax = 'no', rightHepatorenal = 'no', leftSplenorenal = 'no', pelvic = 'no' } = {}) {
  let finding;
  if (pericardial === 'yes') finding = 'pericardial-effusion-emergent-pericardiocentesis-or-OR';
  else if (pneumothorax === 'yes') finding = 'pneumothorax-tube-thoracostomy';
  else if (freeFluid === 'massive') finding = 'massive-hemoperitoneum-OR';
  else if (freeFluid === 'moderate' || rightHepatorenal === 'yes' || leftSplenorenal === 'yes') finding = 'positive-FAST-CT-or-OR';
  else if (pelvic === 'yes') finding = 'pelvic-fluid-evaluate-pelvic-fracture';
  else if (freeFluid === 'trace') finding = 'trace-fluid-monitor-and-repeat';
  else finding = 'negative-FAST';
  return { finding, recommendation: finding.includes('OR') || finding.includes('emergent') ? 'immediate-action' : (finding.includes('positive') ? 'CT-and-decision' : 'monitor') };
};

Engine.TraumaAirway = function ({ gcs = 15, facialTrauma = false, stridor = false, hypoxia = false, anticipated = false } = {}) {
  let decision;
  if (gcs <= 8 || stridor) decision = 'definitive-airway-intubate-immediately';
  else if (facialTrauma && hypoxia) decision = 'awake-fiberoptic-or-surgical-airway';
  else if (facialTrauma && anticipated) decision = 'preemptive-intubation';
  else if (hypoxia) decision = 'supplemental-O2-and-monitor';
  else decision = 'continue-monitoring';
  return { decision, recommendation: decision.includes('intubate') || decision.includes('airway') ? 'anesthesia-emergent' : 'monitor' };
};

Engine.CervicalSpineClearance = function ({ gcs = 15, midlineTenderness = false, distractingInjury = false, mechanism = 'low-risk', imaging = 'normal' } = {}) {
  let pathway;
  if (gcs < 15) pathway = 'CT-cervical-spine';
  else if (midlineTenderness || distractingInjury) pathway = 'CT-cervical-spine';
  else if (mechanism === 'high-risk' || mechanism === 'fall-from-20ft') pathway = 'CT-cervical-spine';
  else if (imaging === 'normal' && gcs === 15 && !midlineTenderness) pathway = 'cleared-clinically-no-imaging-needed-NEXUS';
  else pathway = 'consider-CT-or-MRI';
  return { pathway, recommendation: pathway.includes('cleared') ? 'c-collar-removed' : (pathway.includes('CT') ? 'CT-and-trauma-consult' : 'consider-imaging') };
};

Engine.TraumaReversalAnticoagulation = function ({ anticoagulant = 'warfarin', inr = 3, intracranial = false, activeBleed = true } = {}) {
  let pathway;
  if (anticoagulant === 'warfarin' && inr >= 1.5 && (intracranial || activeBleed)) pathway = '4F-PCC-and-vitamin-K-emergent';
  else if (anticoagulant === 'dabigatran' && (intracranial || activeBleed)) pathway = 'idarucizumab-emergent';
  else if (anticoagulant === 'apixaban' || anticoagulant === 'rivaroxaban') pathway = 'andexanet-alfa-or-4F-PCC';
  else if (anticoagulant === 'heparin') pathway = 'protamine-sulfate';
  else if (anticoagulant === 'warfarin' && inr >= 1.5) pathway = 'vitamin-K-and-consider-4F-PCC';
  else pathway = 'no-reversal-needed';
  return { pathway, recommendation: pathway.includes('emergent') ? 'reversal-immediately' : 'monitor' };
};

Engine.PediatricTrauma = function ({ age = 5, weight = 20, mechanism = 'fall', traumaScore = 12 } = {}) {
  let pathway;
  if (age < 1) pathway = 'infant-trauma-PICU';
  else if (age < 12 && weight < 30) pathway = 'pediatric-trauma-team';
  else if (age >= 12) pathway = 'adult-trauma-protocol';
  else pathway = 'pediatric-trauma-evaluation';
  if (traumaScore < 8) pathway += '-critical-pediatric-trauma-center';
  return { pathway, recommendation: pathway.includes('PICU') || pathway.includes('pediatric-trauma-center') ? 'pediatric-trauma-center' : 'trauma-team' };
};

module.exports = Engine;
