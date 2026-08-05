// pcc_vascular_intervention_engine v3.316.32 (Phase 1C clinical-grade)
// Endovascular interventions per SVS + ESVS guidelines
'use strict';
const TS = new Date().toISOString();
const VER = 'v3.316.32';
const MOD = 'pcc_vascular_intervention';

function CarotidStentPlacement(input) {
  const i = input || {};
  const stenosis = Number(i.stenosis || 0);
  const symptomatic = Boolean(i.symptomatic);
  const age = Number(i.age || 60);
  const contralateralOcclusion = Boolean(i.contralateralOcclusion);
  const priorNeckSurgery = Boolean(i.priorNeckSurgery);
  const priorNeckRadiation = Boolean(i.priorNeckRadiation);
  const ef = Number(i.ef || 60);
  const recentMi = Boolean(i.recentMi);
  const egfr = Number(i.egfr || 60);
  const anatomyFavorable = Boolean(i.anatomyFavorable);
  let indication, preferredApproach, perioperativeRisk;
  if (symptomatic && stenosis >= 50) { indication = 'indicated'; preferredApproach = age >= 70 ? 'CEA-preferred' : 'CEA-or-CAS-acceptable'; }
  else if (!symptomatic && stenosis >= 60) { indication = 'indicated'; preferredApproach = 'CEA-preferred'; }
  else if (symptomatic && stenosis < 50 || !symptomatic && stenosis < 60) { indication = 'medical-management'; preferredApproach = 'optimal-medical-therapy'; }
  else { indication = 'review-required'; preferredApproach = 'review'; }
  if (age < 70 && (priorNeckSurgery || priorNeckRadiation || contralateralOcclusion)) preferredApproach = 'CAS-preferred';
  if (recentMi || egfr < 30 || ef < 30) perioperativeRisk = 'high';
  else if (age >= 80) perioperativeRisk = 'high';
  else if (!anatomyFavorable) perioperativeRisk = 'high';
  else perioperativeRisk = age >= 70 ? 'moderate' : 'low';
  return { version: VER, module: MOD, function: 'CarotidStentPlacement', input, indication, preferredApproach, perioperativeRisk, stenosis, symptomatic, age, ts: TS };
}

function AAAEndovascularRepair(input) {
  const i = input || {};
  const aneurysmSize = Number(i.aneurysmSize || 0);
  const neckDiameter = Number(i.neckDiameter || 0);
  const neckLength = Number(i.neckLength || 0);
  const neckAngulation = Number(i.neckAngulation || 0);
  const iliacAnatomy = String(i.iliacAnatomy || 'favorable');
  const age = Number(i.age || 70);
  const surgicalRisk = String(i.surgicalRisk || 'low');
  const rupture = Boolean(i.rupture);
  const symptomatic = Boolean(i.symptomatic);
  const egfr = Number(i.egfr || 60);
  const iodineAllergy = Boolean(i.iodineAllergy);
  let eligible, anatomySuitability, recommendation;
  const anatomyIssues = [];
  if (neckDiameter > 32) anatomyIssues.push('wide-neck');
  if (neckLength < 10) anatomyIssues.push('short-neck');
  if (neckAngulation > 60) anatomyIssues.push('severe-angulation');
  if (iliacAnatomy === 'unfavorable') anatomyIssues.push('hostile-iliac-anatomy');
  anatomySuitability = anatomyIssues.length === 0 ? 'favorable' : anatomyIssues.length <= 2 ? 'borderline' : 'unfavorable';
  if (rupture) { eligible = true; recommendation = 'emergent-EVAR-if-anatomy-permits-else-open'; }
  else if (aneurysmSize < 55) { eligible = false; recommendation = 'surveillance-anatomy-not-yet-relevant'; }
  else if (aneurysmSize >= 55 || symptomatic) {
    if (anatomySuitability === 'unfavorable') { eligible = false; recommendation = 'open-repair-or-fenestrated-branched-EVAR'; }
    else if (anatomySuitability === 'borderline' && surgicalRisk === 'low') { eligible = false; recommendation = 'open-repair-preferred'; }
    else if (age >= 80 || surgicalRisk === 'high' || egfr < 30) { eligible = true; recommendation = 'EVAR-recommended-lower-perioperative-risk'; }
    else { eligible = true; recommendation = 'EVAR-vs-open-shared-decision-making'; }
  } else { eligible = false; recommendation = 'continue-surveillance'; }
  const workup = ['thin-cut-CTA-chest-abdomen-pelvis','cardiac-clearance','pulmonary-function-if-needed','ankle-brachial-index','type-and-screen','informed-consent-with-endoleak-and-reintervention'];
  if (iodineAllergy) workup.push('premedication-steroid-antihistamine-or-MR-angiogram');
  return { version: VER, module: MOD, function: 'AAAEndovascularRepair', input, eligible, anatomySuitability, recommendation, workup, anatomyIssues, aneurysmSize, age, ts: TS };
}

function PeripheralAngioplasty(input) {
  const i = input || {};
  const lesionLocation = String(i.lesionLocation || 'fem-pop');
  const lesionLength = Number(i.lesionLength || 0);
  const tasc = String(i.tasc || 'A');
  const chronicTotalOcclusion = Boolean(i.chronicTotalOcclusion);
  const calcification = String(i.calcification || 'none');
  const runOff = String(i.runOff || 'good');
  const abi = Number(i.abi || 0.5);
  const claudication = Boolean(i.claudication);
  const cli = Boolean(i.cli);
  let recommendation, technique, restenosisRisk;
  if (cli) { recommendation = 'indicated'; technique = lesionLength >= 25 ? 'subintimal-angioplasty-or-bypass' : 'POBA-or-DCB-or-stent'; restenosisRisk = lesionLength >= 15 ? 'high' : 'moderate'; }
  else if (claudication && abi < 0.9) {
    if (lesionLength <= 15) { recommendation = 'structured-exercise-first-then-consider-revascularization'; technique = 'supervised-exercise-therapy-12-weeks'; restenosisRisk = lesionLength >= 10 ? 'high' : 'moderate'; }
    else { recommendation = 'structured-exercise-then-revascularization-if-fails'; technique = 'exercise-first-then-DCB-or-DES'; restenosisRisk = 'high'; }
  } else { recommendation = 'medical-management'; technique = 'risk-factor-control-and-exercise'; restenosisRisk = 'low'; }
  if (chronicTotalOcclusion) technique = `${technique} - CTO-crossing-wire-or-reentry-device`;
  if (calcification === 'severe') technique = `${technique} - consider-IVL-or-orbital-atherectomy`;
  return { version: VER, module: MOD, function: 'PeripheralAngioplasty', input, recommendation, technique, restenosisRisk, lesionLocation, lesionLength, tasc, ts: TS };
}

function DVTThrombolysis(input) {
  const i = input || {};
  const dvtLocation = String(i.dvtLocation || 'fem-pop');
  const acuityDays = Number(i.acuityDays || 7);
  const extent = String(i.extent || 'focal');
  const symptomSeverity = String(i.symptomSeverity || 'moderate');
  const bleedingRisk = Boolean(i.bleedingRisk);
  const contraindicationAnticoagulation = Boolean(i.contraindicationAnticoagulation);
  const phlegmasia = Boolean(i.phlegmasia);
  const iliacVein = Boolean(i.iliacVein);
  const onAnticoagulation = Boolean(i.onAnticoagulation);
  const renalFunction = Number(i.egfr || 60);
  const pregnancy = Boolean(i.pregnancy);
  const recentSurgery = Boolean(i.recentSurgery);
  const recentStroke = Boolean(i.recentStroke);
  const activePepticUlcer = Boolean(i.activePepticUlcer);
  let eligible, recommendation, technique;
  const exclusions = [];
  if (pregnancy) exclusions.push('pregnancy');
  if (recentSurgery && acuityDays <= 14) exclusions.push('recent-surgery-14d');
  if (recentStroke) exclusions.push('recent-stroke');
  if (activePepticUlcer) exclusions.push('active-peptic-ulcer');
  if (bleedingRisk) exclusions.push('high-bleeding-risk');
  if (exclusions.length > 0) { eligible = false; recommendation = 'anticoagulation-alone'; technique = 'LMWH-or-DOAC'; }
  else if (phlegmasia || iliacVein) { eligible = true; recommendation = 'catheter-directed-thrombolysis-consider'; technique = 'CDT-with-tPA-or-mechanical-thrombectomy'; }
  else if (acuityDays <= 14 && dvtLocation === 'iliofemoral' && symptomSeverity === 'severe') { eligible = true; recommendation = 'CDT-consider-if-low-bleed-risk'; technique = 'infusion-catheter-tPA'; }
  else if (acuityDays <= 14 && symptomSeverity === 'severe') { eligible = false; recommendation = 'anticoagulation-with-close-monitoring'; technique = 'LMWH-or-DOAC-then-reimage'; }
  else { eligible = false; recommendation = 'anticoagulation-alone-per-standard'; technique = 'LMWH-or-DOAC'; }
  if (renalFunction < 30) technique = `${technique} - DOAC-or-LMWH-preferred-over-IV-contrast`;
  return { version: VER, module: MOD, function: 'DVTThrombolysis', input, eligible, recommendation, technique, exclusions, dvtLocation, acuityDays, ts: TS };
}

function VaricoseVeinAblation(input) {
  const i = input || {};
  const veinInvolved = String(i.veinInvolved || 'great-saphenous');
  const veinDiameter = Number(i.veinDiameter || 0);
  const refluxDuration = Number(i.refluxDuration || 0);
  const ceapClass = String(i.ceapClass || 'C2');
  const symptomatic = Boolean(i.symptomatic);
  const priorTreatment = Boolean(i.priorTreatment);
  const anticoagulation = Boolean(i.anticoagulation);
  const pregnancy = Boolean(i.pregnancy);
  const thrombophilia = Boolean(i.thrombophilia);
  let recommendation, technique, followUp;
  if (pregnancy) { recommendation = 'compression-only'; technique = 'graduated-compression-30-40mmHg'; followUp = 'postpartum-reassess'; }
  else if (ceapClass === 'C1' || ceapClass === 'C0') { recommendation = 'no-treatment-needed'; technique = 'observation'; followUp = 'as-needed'; }
  else if (veinDiameter >= 3 && refluxDuration >= 500) {
    recommendation = 'endovenous-ablation'; technique = 'radiofrequency-or-laser-ablation'; followUp = '1-week-ultrasound-6-weeks-clinic';
    if (veinDiameter >= 10) technique = `${technique} - consider-ambulatory-phlebectomy`;
    if (ceapClass === 'C4' || ceapClass === 'C5' || ceapClass === 'C6') technique = `${technique} - aggressive-treatment`;
  }
  else if (veinDiameter < 3 || refluxDuration < 500) { recommendation = 'compression-or-sclerotherapy'; technique = 'foam-sclerotherapy-or-compression'; followUp = '6-weeks-clinic'; }
  else { recommendation = 'shared-decision'; technique = 'compression-with-monitoring'; followUp = '3-months-clinic'; }
  if (thrombophilia) technique = `${technique} - thrombophilia-workup-and-anticoagulation-considerations`;
  if (priorTreatment) technique = `${technique} - re-treatment-options-consider`;
  if (anticoagulation) technique = `${technique} - periprocedural-anticoagulation-management-needed`;
  return { version: VER, module: MOD, function: 'VaricoseVeinAblation', input, recommendation, technique, followUp, veinInvolved, veinDiameter, ceapClass, ts: TS };
}

function AVMEmbolization(input) {
  const i = input || {};
  const location = String(i.location || 'peripheral');
  const schobinger = String(i.schobinger || 'I');
  const size = String(i.size || 'small');
  const feedingArteries = Number(i.feedingArteries || 1);
  const highFlow = Boolean(i.highFlow);
  const previousEmbolization = Boolean(i.previousEmbolization);
  const symptoms = String(i.symptoms || 'cosmetic');
  let recommendation, technique, stages;
  if (schobinger === 'I' && symptoms === 'cosmetic') { recommendation = 'observation-or-compression'; technique = 'serial-monitoring'; stages = 0; }
  else if (schobinger === 'II' || schobinger === 'III') { recommendation = 'endovascular-embolization'; technique = 'liquid-embolization-Onyx-or-glue'; stages = feedingArteries >= 3 ? 3 : 2; }
  else if (schobinger === 'IV' || highFlow) { recommendation = 'urgent-multimodal-treatment'; technique = 'combination-embolization-then-surgical-resection'; stages = 4; }
  else { recommendation = 'individualized-treatment'; technique = 'multidisciplinary-team-review'; stages = 1; }
  if (previousEmbolization) technique = `${technique} - re-embolization-with-different-embolic-agent`;
  if (location === 'spine' || location === 'brain') technique = `${technique} - neurosurgery-team-required`;
  return { version: VER, module: MOD, function: 'AVMEmbolization', input, recommendation, technique, stages, schobinger, symptoms, ts: TS };
}

function RenalArteryStenting(input) {
  const i = input || {};
  const stenosis = Number(i.stenosis || 0);
  const bpUncontrolled = Boolean(i.bpUncontrolled);
  const bpOnMeds = Number(i.bpOnMeds || 0);
  const egfr = Number(i.egfr || 60);
  const egfrDecline = Number(i.egfrDecline || 0);
  const flashPulmonaryEdema = Boolean(i.flashPulmonaryEdema);
  const rapidHypertension = Boolean(i.rapidHypertension);
  const smallKidney = Boolean(i.smallKidney);
  const resistiveIndex = Number(i.resistiveIndex || 0.7);
  let recommendation, indication;
  const flashIndication = flashPulmonaryEdema || rapidHypertension;
  if (flashIndication && stenosis >= 70) { indication = 'flash-pulmonary-edema-or-rapid-hypertension'; recommendation = 'renal-artery-stenting-indicated'; }
  else if (smallKidney || resistiveIndex >= 0.8) { indication = 'kidney-likely-non-salvageable'; recommendation = 'medical-management-only'; }
  else if (egfrDecline >= 5 && stenosis >= 70) { indication = 'progressive-renal-dysfunction'; recommendation = 'renal-artery-stenting-consider'; }
  else if (bpUncontrolled && bpOnMeds >= 3 && stenosis >= 70) { indication = 'resistant-hypertension'; recommendation = 'renal-artery-stenting-consider-after-shared-decision'; }
  else { indication = 'medical-management-preferred'; recommendation = 'medical-management-with-close-followup'; }
  return { version: VER, module: MOD, function: 'RenalArteryStenting', input, indication, recommendation, stenosis, bpUncontrolled, bpOnMeds, egfr, ts: TS };
}

function MesentericIschemiaIntervention(input) {
  const i = input || {};
  const acuity = String(i.acuity || 'acute');
  const etiology = String(i.etiology || 'thrombotic');
  const painOutOfProportion = Boolean(i.painOutOfProportion);
  const lacticAcid = Number(i.lacticAcid || 1);
  const ctFindings = String(i.ctFindings || 'consistent');
  const vesselInvolvement = Number(i.vesselInvolvement || 1);
  const symptomDuration = Number(i.symptionDuration || 0);
  const wtLoss = Number(i.wtLoss || 0);
  const foodFear = Boolean(i.foodFear);
  let diagnosis, recommendation, technique;
  if (acuity === 'acute') {
    if (painOutOfProportion && lacticAcid >= 2 && ctFindings === 'consistent') { diagnosis = 'acute-mesenteric-ischemia'; recommendation = 'emergent-endovascular-or-open-revascularization'; technique = 'hybrid-endovascular-then-laparotomy-if-peritonitis'; }
    else if (lacticAcid < 2 && symptomDuration < 6) { diagnosis = 'early-mesenteric-ischemia'; recommendation = 'urgent-endovascular-revascularization'; technique = 'aspiration-thrombectomy-or-thrombolysis'; }
    else { diagnosis = 'mesenteric-ischemia-suspected'; recommendation = 'CT-angiography-immediate'; technique = 'diagnostic-imaging'; }
  } else {
    if (wtLoss >= 5 && foodFear && vesselInvolvement >= 1) { diagnosis = 'chronic-mesenteric-ischemia'; recommendation = 'mesenteric-revascularization'; technique = vesselInvolvement >= 3 ? 'multi-vessel-bypass' : 'endovascular-angioplasty-stent'; }
    else { diagnosis = 'chronic-mesenteric-ischemia-suspected'; recommendation = 'cta-with-mesenteric-protocol'; technique = 'diagnostic-imaging-then-shared-decision'; }
  }
  return { version: VER, module: MOD, function: 'MesentericIschemiaIntervention', input, diagnosis, recommendation, technique, acuity, lacticAcid, vesselInvolvement, ts: TS };
}

function ClaudicationRevascularization(input) {
  const i = input || {};
  const abi = Number(i.abi || 0.6);
  const lesionLocation = String(i.lesionLocation || 'fem-pop');
  const tasc = String(i.tasc || 'A');
  const exerciseTrial = Boolean(i.exerciseTrial);
  const priorStenting = Boolean(i.priorStenting);
  const lifeLimiting = Boolean(i.lifeLimiting);
  const occupation = String(i.occupation || 'sedentary');
  let recommendation, technique;
  if (exerciseTrial) { recommendation = 'structured-exercise-3-months-then-revascularize-if-fails'; technique = 'supervised-exercise-then-consider-endovascular'; }
  else if (lifeLimiting || occupation === 'active') {
    if (tasc === 'A' || tasc === 'B') { recommendation = 'endovascular-first'; technique = 'angioplasty-with-DCB-or-stent'; }
    else if (tasc === 'C') { recommendation = 'endovascular-or-bypass-shared-decision'; technique = lesionLocation === 'fem-pop' && tasc === 'C' ? 'endovascular-or-bypass' : 'endovascular'; }
    else { recommendation = 'open-bypass-preferred'; technique = 'surgical-bypass'; }
  } else { recommendation = 'medical-management-with-exercise'; technique = 'risk-factor-control-statins-supervised-exercise'; }
  if (priorStenting) technique = `${technique} - in-stent-restenosis-options-consider`;
  return { version: VER, module: MOD, function: 'ClaudicationRevascularization', input, recommendation, technique, abi, lesionLocation, tasc, exerciseTrial, ts: TS };
}

function VascularTraumaControl(input) {
  const i = input || {};
  const vesselInjured = String(i.vesselInjured || 'femoral-artery');
  const injuryMechanism = String(i.injuryMechanism || 'penetrating');
  const hemodynamicallyStable = Boolean(i.hemodynamicallyStable);
  const hardSigns = Boolean(i.hardSigns);
  const distalIschemia = Boolean(i.distalIschemia);
  const mskInjury = Boolean(i.mskInjury);
  const contamination = String(i.contamination || 'none');
  const timeSinceInjury = Number(i.timeSinceInjury || 0);
  let recommendation, technique;
  if (!hemodynamicallyStable || hardSigns) { recommendation = 'emergent-vascular-control'; technique = mskInjury ? 'REBOA-or-tourniquet-then-OR' : 'OR-for-vascular-control-and-repair'; }
  else if (distalIschemia && timeSinceInjury < 6) { recommendation = 'urgent-revascularization'; technique = 'endovascular-stent-graft-or-bypass'; }
  else if (hemodynamicallyStable && !hardSigns && !distalIschemia) { recommendation = 'CT-angiography-then-vascular-consult'; technique = 'non-operative-management-with-close-monitoring-or-endovascular'; }
  else { recommendation = 'multidisciplinary-team'; technique = 'vascular-and-trauma-surgery'; }
  if (contamination !== 'none') technique = `${technique} - consider-open-repair-with-debridement`;
  if (vesselInjured === 'aorta' || vesselInjured === 'iliac') technique = `${technique} - endovascular-stent-graft-preferred-when-anatomy-permits`;
  return { version: VER, module: MOD, function: 'VascularTraumaControl', input, recommendation, technique, vesselInjured, hemodynamicallyStable, hardSigns, timeSinceInjury, ts: TS };
}

module.exports = { CarotidStentPlacement, AAAEndovascularRepair, PeripheralAngioplasty, DVTThrombolysis, VaricoseVeinAblation, AVMEmbolization, RenalArteryStenting, MesentericIschemiaIntervention, ClaudicationRevascularization, VascularTraumaControl };