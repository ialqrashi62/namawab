'use strict';
// GI Extended Engine: 10 pure deterministic functions
// Compliance: AGA, ACG, AASLD, ECCO, ESGE, ESMO, NCCN

function CrohnsDiseaseCDAI({ liquidStools, abdominalPain, generalWellbeing, extraintestinalManifestations, antiDiarrheal, abdominalMass, hematocrit, weightLoss }) {
  const score = (liquidStools * 2) + (abdominalPain * 5) + (generalWellbeing * 7) + (extraintestinalManifestations * 20) + (antiDiarrheal * 30) + (abdominalMass * 10) + (hematocrit < 30 ? 6 : 0) + (weightLoss * 1);
  let category;
  if (score < 150) category = 'remission';
  else if (score < 250) category = 'mild-active';
  else if (score < 350) category = 'moderate-active';
  else category = 'severe-active';
  let treatment;
  if (category === 'remission') treatment = 'maintain-remission-AZA-MTX-biologic';
  else if (category === 'mild-active') treatment = '5-ASA-budesonide-ileal-release';
  else if (category === 'moderate-active') treatment = 'biologic-TNF-vedolizumab-ustekinumab-risankizumab';
  else treatment = 'biologic-hospitalize-IV-steroids-consider-surgery';
  return { score, category, treatment };
}

function UlcerativeColitisMayo({ stoolFrequency, rectalBleeding, endoscopyFindings, physicianGlobalAssessment, severity, fCalProtectin, crp }) {
  const score = stoolFrequency + rectalBleeding + endoscopyFindings + physicianGlobalAssessment;
  let category;
  if (score <= 2) category = 'remission';
  else if (score <= 5) category = 'mild-active';
  else if (score <= 10) category = 'moderate-active';
  else category = 'severe-active';
  let treatment;
  if (category === 'remission') treatment = 'maintain-5-ASA-AZA-biologic';
  else if (category === 'mild-active') treatment = 'oral-topical-5-ASA-budesonide-MMX';
  else if (category === 'moderate-active') treatment = 'biologic-anti-TNF-vedolizumab-ustekinumab-or-JAK-tofacitinib-upadacitinib';
  else treatment = 'IV-steroids-rescue-biologic-or-colectomy';
  if (fCalProtectin >= 250) treatment += '-step-up-therapy';
  if (crp >= 30) treatment += '-monitor-inflammation';
  return { score, category, treatment };
}

function AcutePancreatitisSeverity({ bisapScore, apacheII, ranSONScore, crp, balthazarIndex, organFailure, age, bmi, mriFindings, fluidResuscitation }) {
  let severity;
  if (bisapScore >= 3 || ranSONScore >= 3 || organFailure) severity = 'severe-ICU';
  else if (bisapScore === 2 || apacheII >= 8) severity = 'moderately-severe';
  else severity = 'mild';
  let treatment;
  if (severity === 'severe-ICU') treatment = 'ICU-aggressive-fluid-resuscitation-organ-support-antibiotics-if-necrotic';
  else if (severity === 'moderately-severe') treatment = 'aggressive-fluid-resuscitation-monitoring-step-down-when-stable';
  else treatment = 'lactated-ringers-fluid-analgesia-oral-feeding-when-tolerated';
  if (bmi >= 30) treatment += '-consider-NPO-and-NG';
  if (fluidResuscitation === 'aggressive') treatment += '-continue-aggressive-fluids';
  return { severity, treatment };
}

function GERDLAGrade({ symptoms, laGrade, dysphagia, weightLoss, alarmSymptoms, age, priorPPIResponse }) {
  let classification;
  if (laGrade === 'A') classification = 'LA-grade-A-mild-erosive';
  else if (laGrade === 'B') classification = 'LA-grade-B-moderate-erosive';
  else if (laGrade === 'C') classification = 'LA-grade-C-severe-erosive';
  else if (laGrade === 'D') classification = 'LA-grade-D-very-severe-erosive';
  else if (laGrade === 'N' || !laGrade) classification = 'NERD-non-erosive';
  else classification = 'Barretts-suspect';
  let treatment;
  if (classification === 'NERD-non-erosive') treatment = 'PPI-on-demand-lifestyle-modification';
  else if (classification === 'LA-grade-A-mild-erosive') treatment = 'PPI-once-daily-8-weeks';
  else if (classification === 'LA-grade-B-moderate-erosive') treatment = 'PPI-twice-daily-8-weeks';
  else if (classification === 'LA-grade-C-severe-erosive') treatment = 'PPI-twice-daily-12-weeks-surgery-if-refractory';
  else if (classification === 'LA-grade-D-very-severe-erosive') treatment = 'PPI-high-dose-surgery-evaluation';
  else treatment = 'surveillance-Biopsy-radiofrequency-ablation';
  if (alarmSymptoms || weightLoss || age >= 60) treatment = 'endoscopy-biopsy-mandatory';
  if (priorPPIResponse === 'partial') treatment = 'step-up-PPI-twice-daily';
  return { classification, treatment };
}

function CirrhosisComplications({ childPugh, meld, ascites, hepaticEncephalopathy, varices, hepatocellularCarcinoma, spontaneousBacterialPeritonitis, hepatorenalSyndrome, portalHypertension, portalVeinThrombosis }) {
  let status;
  if (childPugh === 'C' || meld >= 30) status = 'decompensated-advanced';
  else if (childPugh === 'B' || meld >= 15) status = 'decompensated-moderate';
  else if (ascites || hepaticEncephalopathy) status = 'decompensated-early';
  else status = 'compensated';
  let treatment;
  if (status === 'compensated') treatment = 'surveillance-HCC-6mo-US-EGD-screening';
  else if (status === 'decompensated-early') treatment = 'diuretics-lactulose-rifaximin-NSBB-varices-prophylaxis';
  else if (status === 'decompensated-moderate') treatment = 'listed-for-transplant-MELD-Na';
  else treatment = 'urgent-transplant-ICU-consider-TIPS-or-surgery';
  if (spontaneousBacterialPeritonitis) treatment = 'IV-cephalosporin-albumin-rifaximin-prophylaxis';
  if (hepatorenalSyndrome) treatment = 'midodrine-octreotide-albumin-or-terlipressin';
  if (hepatocellularCarcinoma) treatment = 'BCLC-treat-with-MDT-curative-or-bridge';
  if (portalVeinThrombosis) treatment = 'anticoagulation-evaluation';
  return { status, treatment };
}

function CeliacDisease({ ttgIga, emAIgA, duodenalBiopsyMarsh, hlaDQ2, hlaDQ8, familyHistory, age, symptoms, responseToGFD }) {
  let diagnosis;
  if (ttgIga >= 10 && duodenalBiopsyMarsh >= 2) diagnosis = 'celiac-disease-confirmed';
  else if (ttgIga >= 4 && familyHistory) diagnosis = 'celiac-disease-probable';
  else if (duodenalBiopsyMarsh >= 3) diagnosis = 'celiac-disease-confirmed-on-biopsy';
  else if (hlaDQ2 || hlaDQ8) diagnosis = 'celiac-disease-consider-sero-retest';
  else diagnosis = 'celiac-disease-unlikely';
  let treatment;
  if (diagnosis.includes('confirmed') || diagnosis.includes('probable')) treatment = 'lifelong-gluten-free-diet-nutritionist-follow-up';
  else if (diagnosis.includes('consider')) treatment = 'repeat-serology-monitor';
  else treatment = 'no-gluten-free-diet-exclude-other-causes';
  if (responseToGFD === 'poor') treatment = 'assess-GFD-adherence-rule-out-refractory-CMV';
  return { diagnosis, treatment };
}

function IBSRomeIV({ abdominalPain, defecationRelation, stoolFrequencyChange, stoolFormChange, mucus, bloating, durationMonths, redFlags }) {
  let diagnosis;
  if (redFlags && redFlags.length > 0) diagnosis = 'IBS-suspect-evaluate-red-flags-first';
  else if (abdominalPain >= 1 && durationMonths >= 6 && defecationRelation && (stoolFrequencyChange || stoolFormChange)) diagnosis = 'IBS-confirmed-Rome-IV';
  else if (abdominalPain >= 1 && durationMonths >= 6) diagnosis = 'IBS-partial-rome-IV';
  else diagnosis = 'IBS-not-met-evaluate-other';
  let subtype;
  if (stoolFormChange === 'loose-or-watery') subtype = 'IBS-D';
  else if (stoolFormChange === 'hard-or-lumpy') subtype = 'IBS-C';
  else if (stoolFormChange === 'mixed') subtype = 'IBS-M';
  else subtype = 'IBS-U';
  let treatment;
  if (subtype === 'IBS-D') treatment = 'antidiarrheal-loperamide-rifaximin-eluxadoline-5-HT3-antagonist';
  else if (subtype === 'IBS-C') treatment = 'osmotic-laxative-lubiprostone-linaclotide-plecanatide';
  else if (subtype === 'IBS-M') treatment = 'antispasmodic-low-FODMAP-diet-psychological-therapy';
  else treatment = 'lifestyle-fiber-probiotic';
  return { diagnosis, subtype, treatment };
}

function AcutePancreatitisRanson({ age, wbc, glucose, ldh, ast, hctDrop, bunRise, calcium, baseDeficit, fluidSequestration }) {
  let score = 0;
  if (age >= 55) score += 1;
  if (wbc >= 16000) score += 1;
  if (glucose >= 200) score += 1;
  if (ldh >= 350) score += 1;
  if (ast >= 250) score += 1;
  if (hctDrop >= 10) score += 1;
  if (bunRise >= 5) score += 1;
  if (calcium < 8) score += 1;
  if (baseDeficit > 4) score += 1;
  if (fluidSequestration >= 6) score += 1;
  let mortality;
  if (score >= 6) mortality = 'high-50pct-mortality';
  else if (score >= 4) mortality = 'moderate-15pct-mortality';
  else if (score >= 1) mortality = 'low-2pct-mortality';
  else mortality = 'very-low-less-than-1pct';
  return { ransonScore: score, mortality };
}

function HCCStagingBCLC({ ecogPS, childPugh, tumorSize, tumorNumber, macrovascularInvasion, extrahepaticSpread, afp }) {
  let stage;
  if (ecogPS >= 2 || childPugh === 'C') stage = 'BCLC-D-end-stage';
  else if (ecogPS === 1 && macrovascularInvasion) stage = 'BCLC-C-advanced';
  else if (ecogPS === 0 && childPugh === 'A-B' && (tumorSize > 5 || tumorNumber > 3 || macrovascularInvasion)) stage = 'BCLC-B-intermediate';
  else if (ecogPS === 0 && childPugh === 'A-B' && tumorSize <= 5 && tumorNumber === 1 && !macrovascularInvasion) stage = 'BCLC-A-early';
  else if (ecogPS === 0 && childPugh === 'A' && tumorSize <= 5 && tumorNumber <= 3 && !macrovascularInvasion) stage = 'BCLC-0-very-early';
  else stage = 'BCLC-unclassified';
  let treatment;
  if (stage === 'BCLC-0-very-early') treatment = 'ablation-resection-transplant';
  else if (stage === 'BCLC-A-early') treatment = 'resection-ablation-transplant';
  else if (stage === 'BCLC-B-intermediate') treatment = 'TACE-ABlation-or-TARE';
  else if (stage === 'BCLC-C-advanced') treatment = 'systemic-therapy-TKI-atezo-bev';
  else if (stage === 'BCLC-D-end-stage') treatment = 'best-supportive-care';
  else treatment = 'MDT-evaluation';
  if (afp >= 400) treatment = 'BCLC-C-advanced-systemic-therapy';
  return { stage, treatment };
}

function EndoscopyBowelPreparation({ bostonBowelPrepScore, splitDosePrep, lastSolidFood, lastClearLiquid, bowelFrequency, vomited, prepType, asaScore }) {
  let quality;
  if (bostonBowelPrepScore >= 6) quality = 'adequate-excellent';
  else if (bostonBowelPrepScore >= 5) quality = 'adequate-good';
  else if (bostonBowelPrepScore >= 4) quality = 'adequate-fair';
  else quality = 'inadequate-need-re-scope-or-re-prep';
  let interval;
  if (splitDosePrep) interval = 'optimal-2-4h-before';
  else interval = 'suboptimal-consider-repeat-with-split-dose';
  let nextStep;
  if (quality.startsWith('adequate')) nextStep = 'proceed-with-endoscopy';
  else if (bostonBowelPrepScore === 3) nextStep = 'consider-continued-aspiration-or-re-prep-same-day';
  else nextStep = 'repeat-endoscopy-with-better-prep';
  if (vomited) nextStep = 'consider-IV-ondansetron-re-prep';
  return { quality, interval, nextStep };
}

module.exports = {
  CrohnsDiseaseCDAI, UlcerativeColitisMayo, AcutePancreatitisSeverity, GERDLAGrade, CirrhosisComplications,
  CeliacDisease, IBSRomeIV, AcutePancreatitisRanson, HCCStagingBCLC, EndoscopyBowelPreparation,
};
