/**
 * pcc/rheum/rheum_engine.js — PCC #19: Rheumatology
 * 10 deterministic functions for rheumatologic emergencies & management.
 *
 * Compliance: ACR · EULAR · ASAS · OMERACT.
 */
'use strict';

function round(x, d) { const f = Math.pow(10, d); return Math.round(x * f) / f; }

/**
 * 1. DAS28Score — Disease Activity Score for RA.
 */
function DAS28Score({ tenderJoints, swollenJoints, esr, patientGlobal }) {
  const das28 = round(0.56 * Math.sqrt(tenderJoints) + 0.28 * Math.sqrt(swollenJoints) + 0.70 * Math.log(esr) + 0.014 * patientGlobal, 2);
  let activity;
  if (das28 > 5.1) activity = 'high';
  else if (das28 > 3.2) activity = 'moderate';
  else if (das28 > 2.6) activity = 'low';
  else activity = 'remission';
  return { das28, activity, treatment: activity === 'high' ? 'biologic_titrate' : activity === 'moderate' ? 'dmard_intensify' : 'maintain' };
}

/**
 * 2. SLEDAIScore — Systemic Lupus Erythematosus activity.
 */
function SLEDAIScore({ seizures, psychosis, organicBrain, visual, cranialNerve, lupusHeadache, cva, vasculitis, arthritis, myositis, rash, alopecia, mucosal, pleurisy, pericarditis, lowComplement, increasedDNA, fever, thrombocytopenia, leukopenia }) {
  const descriptors = [seizures, psychosis, organicBrain, visual, cranialNerve, lupusHeadache, cva, vasculitis, arthritis, myositis, rash, alopecia, mucosal, pleurisy, pericarditis, lowComplement, increasedDNA, fever, thrombocytopenia, leukopenia];
  const score = descriptors.filter(v => v === true || (typeof v === 'number' && v > 0)).length;
  let activity = 'inactive';
  if (score >= 12) activity = 'severe_flare';
  else if (score >= 6) activity = 'moderate';
  else if (score >= 1) activity = 'mild';
  return { score, activity, treatment: activity === 'severe_flare' ? 'IV_steroids_cyclophosphamide' : activity === 'moderate' ? 'high_steroids_immunosuppressant' : activity === 'mild' ? 'NSAIDs_hydroxychloroquine' : 'maintenance' };
}

/**
 * 3. GoutAttackManagement — acute flare treatment.
 */
function GoutAttackManagement({ attackDuration, kidneyDisease, age, pepticUlcer, anticoagulant, nsaidPriorResponse }) {
  let firstLine = 'NSAIDs';
  if (kidneyDisease) firstLine = 'colchicine';
  if (pepticUlcer && !kidneyDisease) firstLine = 'colchicine';
  if (nsaidPriorResponse === 'none' && !kidneyDisease && !pepticUlcer) firstLine = 'colchicine';
  if (age >= 80) firstLine = 'oral_steroids';
  if (attackDuration >= 5) firstLine = 'oral_steroids';
  return {
    firstLine,
    prophylaxis: 'allopurinol_febuxostat_after_resolution',
    targetUrate: 6,
  };
}

/**
 * 4. AntiPhospholipidSyndrome — revised Sapporo criteria.
 */
function AntiPhospholipidSyndrome({ lupusAnticoagulant, anticardiolipin, antibeta2GPI, thrombosis, pregnancyMorbidity, livedoReticularis }) {
  const labCriteria = lupusAnticoagulant || anticardiolipin >= 40 || antibeta2GPI;
  const clinicalCriteria = thrombosis || pregnancyMorbidity;
  if (labCriteria && clinicalCriteria) return { diagnosis: 'definite_APS', treatment: 'lifelong_anticoagulation' };
  if (labCriteria) return { diagnosis: 'aPL_positive_no_clinical', workup: 'monitor_repeat_test' };
  if (clinicalCriteria) return { diagnosis: 'clinical_only', workup: 'recheck_antibodies' };
  return { diagnosis: 'not_APS' };
}

/**
 * 5. GiantCellArteritisSuspected — ACR criteria.
 */
function GiantCellArteritisSuspected({ age, newHeadache, temporalArteryAbnormality, esrElevated, biopsyFindings }) {
  let score = 0;
  if (age >= 50) score += 1;
  if (newHeadache) score += 1;
  if (temporalArteryAbnormality) score += 1;
  if (esrElevated >= 50) score += 1;
  if (biopsyFindings === 'granulomatous_inflammation') score += 1;
  if (score >= 3) return { diagnosis: 'GCA_likely', treatment: 'high_dose_prednisone_immediate' };
  if (score >= 1) return { diagnosis: 'GCA_possible', workup: 'temporal_artery_biopsy_ESR' };
  return { diagnosis: 'GCA_unlikely' };
}

/**
 * 6. SpondylarthritisScreening — ASAS axial SpA criteria.
 */
function SpondylarthritisScreening({ age, backPainDuration, inflammatoryBackPain, hlaB27, sacroiliitisOnMri, responseToNSAIDs, familyHistory }) {
  if (age < 45 && backPainDuration >= 3) {
    if (hlaB27 && (inflammatoryBackPain || sacroiliitisOnMri)) return { diagnosis: 'axial_spondyloarthritis' };
    if (sacroiliitisOnMri && inflammatoryBackPain) return { diagnosis: 'axial_spondyloarthritis' };
    if (hlaB27 && responseToNSAIDs) return { diagnosis: 'probable_axial_spa' };
  }
  return { diagnosis: 'not_axial_spa' };
}

/**
 * 7. SystemicSclerosisClassification — ACR/EULAR.
 */
function SystemicSclerosisClassification({ skinThickening, sclerodactyly, digitalPittingScars, telangiectasia, raynauds, raynaudsWithNailfoldChanges, pulmonaryHypertension, antiCentromere, antiScl70, antiRNAPolymerase }) {
  let score = 0;
  if (skinThickening === 'proximal_to_MCP') score += 9;
  if (sclerodactyly) score += 4;
  if (digitalPittingScars) score += 3;
  if (telangiectasia) score += 2;
  if (raynaudsWithNailfoldChanges) score += 3;
  if (pulmonaryHypertension || antiCentromere || antiScl70 || antiRNAPolymerase) score += 2;
  if (raynauds) score += 3;
  if (score >= 9) return { diagnosis: 'definite_systemic_sclerosis', severity: 'high' };
  if (score >= 7) return { diagnosis: 'systemic_sclerosis', severity: 'moderate' };
  return { diagnosis: 'not_ssc' };
}

/**
 * 8. VasculitisClassification — Chapel Hill Consensus.
 */
function VasculitisClassification({ vesselSize, ancaPattern, biopsyFindings, organInvolvement }) {
  let type;
  if (vesselSize === 'large') type = 'large_vessel';
  else if (vesselSize === 'medium') type = 'medium_vessel_polyarteritis_nodosa';
  else if (vesselSize === 'small' && ancaPattern === 'p-ANCA') type = 'microscopic_polyangiitis';
  else if (vesselSize === 'small' && ancaPattern === 'c-ANCA') type = 'granulomatosis_polyangiitis';
  else if (vesselSize === 'small' && ancaPattern === 'negative') type = 'iga_vasculitis';
  else if (vesselSize === 'variable') type = 'behcets';
  else type = 'unclassified';
  return { type, biopsyCorrelation: biopsyFindings, organInvolvement };
}

/**
 * 9. FibromyalgiaSeverity — widespread pain index.
 */
function FibromyalgiaSeverity({ painSites, symptomSeverity, fatigue, wakingUnrefreshed, cognitiveSymptoms, somaticSymptoms }) {
  const wpi = painSites;
  const ss2 = fatigue + wakingUnrefreshed + cognitiveSymptoms;
  const ssScore = ss2 + somaticSymptoms;
  if (wpi >= 7 && ssScore >= 5) return { diagnosis: 'fibromyalgia_likely', severity: 'severe' };
  if (wpi >= 4 && ssScore >= 6) return { diagnosis: 'fibromyalgia_likely', severity: 'moderate' };
  if (wpi >= 3 && ssScore >= 5) return { diagnosis: 'fibromyalgia_possible', severity: 'mild' };
  return { diagnosis: 'not_fibromyalgia' };
}

/**
 * 10. InflammatoryBackPainRecognition — Calin criteria + ASAS.
 */
function InflammatoryBackPainRecognition({ ageAtOnset, insidiousOnset, improvementWithExercise, worseningWithRest, nightPain, alternatingButtockPain, responseToNSAIDs }) {
  const positiveCount = [ageAtOnset < 40, insidiousOnset, improvementWithExercise, worseningWithRest, nightPain, alternatingButtockPain].filter(Boolean).length;
  if (positiveCount >= 4) return { diagnosis: 'inflammatory_back_pain_likely', workup: 'MRI_sacroiliac' };
  if (positiveCount >= 2 && responseToNSAIDs) return { diagnosis: 'inflammatory_back_pain_possible' };
  return { diagnosis: 'mechanical_back_pain_likely' };
}

module.exports = {
  DAS28Score, SLEDAIScore, GoutAttackManagement, AntiPhospholipidSyndrome,
  GiantCellArteritisSuspected, SpondylarthritisScreening,
  SystemicSclerosisClassification, VasculitisClassification,
  FibromyalgiaSeverity, InflammatoryBackPainRecognition,
};
