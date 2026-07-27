'use strict';
// Neurology Extended Engine: 10 pure deterministic functions
// Compliance: AAN, AHA/ASA, ECTRIMS, MDS, MDS, NINDS, NMSS

function MSEDSS({ pyramidal, cerebellar, brainstem, sensory, bowelBladder, visual, cerebral, ambulationScore, age, diseaseDuration }) {
  const score = pyramidal + cerebellar + brainstem + sensory + bowelBladder + visual + cerebral;
  let classification;
  if (score <= 1.5) classification = 'normal-or-mild-disability';
  else if (score <= 3) classification = 'moderate-disability';
  else if (score <= 5) classification = 'walking-without-aid-or-restriction';
  else if (score <= 6.5) classification = 'walking-with-aid';
  else classification = 'restricted-to-wheelchair-or-bed';
  let treatment;
  if (classification === 'normal-or-mild-disability') treatment = 'monitor-relapse-monitoring';
  else if (classification === 'moderate-disability') treatment = 'DMT-relapse-management-MRI-monitoring';
  else if (classification === 'walking-without-aid-or-restriction') treatment = 'high-efficacy-DMT-rehab-symptom-management';
  else if (classification === 'walking-with-aid') treatment = 'escalate-DMT-rehab-mobility-aids';
  else treatment = 'maximal-DMT-caregiver-support';
  if (age >= 60 && diseaseDuration >= 20) treatment = 'palliative-DMT-balance-risk';
  return { score, classification, treatment };
}

function MigraineDisabilityMIDAS({ missedWorkSchool, missedHousehold, missedFamily, reducedWork, reducedHousehold }) {
  const total = missedWorkSchool + missedHousehold + missedFamily + reducedWork + reducedHousehold;
  let grade;
  if (total <= 5) grade = 'I-little-or-no-disability';
  else if (total <= 10) grade = 'II-mild-disability';
  else if (total <= 20) grade = 'III-moderate-disability';
  else grade = 'IV-severe-disability';
  let treatment;
  if (grade === 'I-little-or-no-disability') treatment = 'as-needed-NSAID-or-triptan';
  else if (grade === 'II-mild-disability') treatment = 'triptan-or-NSAID-as-needed-consider-preventive';
  else if (grade === 'III-moderate-disability') treatment = 'start-preventive-CGRP-or-beta-blocker';
  else treatment = 'high-efficacy-CGRP-anti-CGRP-or-onabotulinumtoxinA';
  return { score: total, grade, treatment };
}

function ParkinsonUPDRS({ tremor, rigidity, bradykinesia, posturalInstability, gait, speech, facialExpression, autonomicDysfunction, cognitive, medicationsYears, dyskinesias, hallucinations }) {
  const motor = tremor + rigidity + bradykinesia + posturalInstability + gait + speech + facialExpression;
  let hoehnYahr;
  if (posturalInstability >= 2 || motor >= 12) hoehnYahr = 'stage-3-bilateral-mild-disability';
  else if (posturalInstability === 1 || motor >= 8) hoehnYahr = 'stage-2-bilateral';
  else if (motor >= 4) hoehnYahr = 'stage-1-unilateral';
  else hoehnYahr = 'stage-0-no-signs';
  let treatment;
  if (hoehnYahr === 'stage-0-no-signs') treatment = 'no-treatment';
  else if (hoehnYahr === 'stage-1-unilateral') treatment = 'MAO-B-inhibitor-or-levodopa-low-dose';
  else if (hoehnYahr === 'stage-2-bilateral') treatment = 'levodopa-or-agonist-or-MAO-B';
  else treatment = 'levodopa-dopamine-agonist-COMT-inhibitor-DBS-if-eligible';
  if (dyskinesias) treatment = 'consider-DBS-pumps-apomorphine';
  if (hallucinations) treatment = 'reduce-dopaminergics-consider-psychosis-treatment';
  if (cognitive >= 2) treatment += '-with-dementia-management';
  if (autonomicDysfunction >= 1) treatment += '-orthostasis-bowel-bladder';
  return { motor, hoehnYahr, treatment };
}

function AlzheimerStaging({ mmse, moca, adl, behaviorChanges, cdrScore, imagingAtrophy, csfBiomarkers, age, familyHistory, diseaseDuration }) {
  let stage;
  if (cdrScore === 0) stage = 'no-dementia';
  else if (cdrScore === 0.5) stage = 'very-mild-MCI';
  else if (cdrScore === 1) stage = 'mild-Alzheimer';
  else if (cdrScore === 2) stage = 'moderate-Alzheimer';
  else if (cdrScore === 3) stage = 'severe-Alzheimer';
  else stage = 'not-staged';
  let treatment;
  if (stage === 'no-dementia') treatment = 'risk-factor-control';
  else if (stage === 'very-mild-MCI') treatment = 'monitor-cognitive-training';
  else if (stage === 'mild-Alzheimer') treatment = 'AChEIs-donepezil-rivastigmine-galantamine';
  else if (stage === 'moderate-Alzheimer') treatment = 'AChEIs-memantine-behavioral-intervention';
  else treatment = 'memantine-AChEIs-caregiver-support-palliative';
  if (behaviorChanges === 'severe') treatment += '-behavioral-nonpharmacologic-or-atypical-antipsychotic';
  if (imagingAtrophy === 'hippocampal') treatment += '-consider-lecanemab-or-donanemab';
  if (age >= 80) treatment += '-consider-deprescribing';
  return { stage, treatment };
}

function GuillainBarreSeverity({ weaknessOnset, nadirWeakness, respiratoryInvolvement, autonomicInstability, areflexia, sensorySymptoms, albuminocytologicDissociation }) {
  let severity;
  if (respiratoryInvolvement) severity = 'severe-ICU-mechanical-ventilation-monitoring';
  else if (nadirWeakness === 'bed-bound') severity = 'severe-bedbound';
  else if (nadirWeakness === 'walking-with-aid') severity = 'moderate-walking-aid';
  else if (nadirWeakness === 'mild-weakness') severity = 'mild-ambulatory';
  else severity = 'mild-monitor';
  let treatment;
  if (severity === 'severe-ICU-mechanical-ventilation-monitoring') treatment = 'IVIG-or-plasmapheresis-ICU-vent-monitoring';
  else if (severity === 'severe-bedbound') treatment = 'IVIG-or-plasmapheresis-rehab';
  else if (severity === 'moderate-walking-aid') treatment = 'IVIG-rehab-monitoring';
  else if (severity === 'mild-ambulatory') treatment = 'monitor-IVIG-if-progressing';
  else treatment = 'monitor';
  if (autonomicInstability) treatment += '-autonomic-monitoring-telemetry';
  return { severity, treatment };
}

function MyastheniaGravisMGFA({ ocular, bulbar, limb, respiratory, mgfaClass, myasthenicCrisis, achRAntibody, thymoma, priorPlasmapheresis }) {
  let classification = mgfaClass || 'not-classified';
  let treatment;
  if (myasthenicCrisis) treatment = 'ICU-IVIG-or-plasmapheresis-pyridostigmine-IV';
  else if (classification === 'I' || classification === 'II') treatment = 'pyridostigmine-steroid-sparing-immunosuppressant';
  else if (classification === 'III' || classification === 'IV') treatment = 'pyridostigmine-steroid-azathioprine-mycophenolate-IVIG';
  else if (classification === 'V') treatment = 'myasthenic-crisis-IVIG-or-PLEX-ICU';
  else treatment = 'pyridostigmine-immunosuppressant';
  if (thymoma) treatment = 'thymectomy';
  if (achRAntibody === 'positive' && !myasthenicCrisis) treatment += '-consider-thymectomy';
  return { classification, treatment };
}

function EpilepsySeizureControl({ seizureFrequency, onAED, aedLevel, aedAdherence, eegFindings, mriFindings, priorAEDs, drugResistant, vagusNerveStimulator, ketogenicDiet }) {
  let control;
  if (seizureFrequency === 0) control = 'seizure-free-12-mo';
  else if (seizureFrequency < 4) control = 'acceptable-control';
  else if (drugResistant) control = 'drug-resistant-epilepsy-presurgical-eval';
  else control = 'uncontrolled-add-second-AED';
  let treatment;
  if (control === 'seizure-free-12-mo') treatment = 'continue-current-AED-consider-withdrawal-if-2y-free';
  else if (control === 'acceptable-control') treatment = 'optimize-AED-dose-level';
  else if (control === 'uncontrolled-add-second-AED') treatment = 'add-second-AED-consider-adjuncts';
  else treatment = 'presurgical-eval-VNS-consider-RNS-ketogenic-diet';
  if (aedAdherence === 'poor') treatment = 'address-adherence-counseling';
  if (mriFindings === 'lesional') treatment = 'epilepsy-surgery-resection';
  if (vagusNerveStimulator) treatment = 'continue-VNS-titrate';
  if (ketogenicDiet) treatment = 'continue-ketogenic-diet';
  return { control, treatment };
}

function IntracranialHemorrhageScore({ ichVolume, ivh, age, gcs, infratentorial, anticoagulation, antiplatelet }) {
  let risk = 0;
  if (ichVolume >= 30) risk += 2;
  if (ivh) risk += 2;
  if (age >= 80) risk += 1;
  if (gcs <= 8) risk += 2;
  if (infratentorial) risk += 2;
  if (anticoagulation) risk += 2;
  if (antiplatelet) risk += 1;
  let category;
  if (risk >= 8) category = 'very-high-30-day-mortality';
  else if (risk >= 5) category = 'high-mortality';
  else if (risk >= 2) category = 'moderate-mortality';
  else category = 'low-mortality';
  let treatment;
  if (category === 'very-high-30-day-mortality') treatment = 'hemicraniectomy-consider-ICU-withdrawal-of-care-discussion';
  else if (category === 'high-mortality') treatment = 'ICU-reversal-anticoagulation-strict-BP-control';
  else if (category === 'moderate-mortality') treatment = 'medical-management-reversal-strict-BP-control-monitoring';
  else treatment = 'medical-management-BP-control-monitoring';
  if (anticoagulation) treatment += '-reversal-PCC-vitamin-K';
  if (infratentorial) treatment = 'neurosurgery-consult-hematoma-evacuation';
  return { riskScore: risk, category, treatment };
}

function StatusEpilepticusManagement({ duration, gcs, airwayCompromise, ivAccess, seizureType, priorAEDs, eegActivity, cnsInfection, metabolicCause, focalOrGeneralized }) {
  let phase;
  if (duration < 5) phase = 'early-phase-stabilization';
  else if (duration < 30) phase = 'first-line-benzodiazepines';
  else if (duration < 60) phase = 'second-line-AED-levetiracetam-or-fosphenytoin-or-valproate';
  else if (duration < 90) phase = 'third-line-anesthetics-midazolam-propofol-pentobarbital';
  else phase = 'refractory-consider-EEG-burst-suppression-24-48h';
  let treatment;
  if (phase === 'early-phase-stabilization') treatment = 'ABCs-glucose-vitals-IV-access';
  else if (phase === 'first-line-benzodiazepines') treatment = 'lorazepam-IV-IM-diazepam-IM-rectal-midazolam-IM-IN';
  else if (phase === 'second-line-AED-levetiracetam-or-fosphenytoin-or-valproate') treatment = 'levetiracetam-60mg-kg-OR-fosphenytoin-20mg-PE-kg-OR-valproate-40mg-kg';
  else if (phase === 'third-line-anesthetics-midazolam-propofol-pentobarbital') treatment = 'midazolam-OR-propofol-or-pentobarbital-continuous-IV-titrate-to-burst-suppression';
  else treatment = 'continue-anesthetic-EEG-monitoring-consider-other-causes';
  if (airwayCompromise) treatment = 'intubate-mechanical-ventilation';
  if (cnsInfection) treatment += '-start-empiric-antibiotics-antivirals';
  if (metabolicCause) treatment += '-correct-metabolic-derangement';
  if (focalOrGeneralized === 'focal') treatment += '-consider-focal-lesion-imaging';
  return { phase, treatment };
}

function CerebralVenousThrombosis({ durationHeadache = 0, focalDeficit = false, seizure = false, papilledema = false, consciousness = 'alert', gcs = 15 }) {
  const severityScore = (durationHeadache > 7 ? 2 : 0) + (focalDeficit ? 3 : 0) + (seizure ? 2 : 0) + (papilledema ? 1 : 0) + (gcs < 13 ? 4 : gcs < 15 ? 2 : 0);
  let category;
  if (severityScore >= 7) category = 'severe-with-venous-infarction';
  else if (severityScore >= 4) category = 'moderate-with-focal-deficit';
  else if (severityScore >= 1) category = 'mild-isolated-headache';
  else category = 'minimal-headache-only';
  return { severityScore, category, recommendation: severityScore >= 4 ? 'heparin-neuro-ICU-MRV-imaging' : (severityScore >= 1 ? 'anticoagulation-MRV-follow-up' : 'analgesia-observation') };
}

module.exports = {
  MSEDSS, MigraineDisabilityMIDAS, ParkinsonUPDRS, AlzheimerStaging, GuillainBarreSeverity,
  MyastheniaGravisMGFA, EpilepsySeizureControl, IntracranialHemorrhageScore, StatusEpilepticusManagement,
  CerebralVenousThrombosis
};
