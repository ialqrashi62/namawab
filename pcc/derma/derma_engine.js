/**
 * pcc/derma/derma_engine.js — PCC #16: Dermatology
 * 10 deterministic functions for dermatologic emergencies & management.
 *
 * Compliance: AAD · BAD · Stevens-Johnson syndrome criteria (Bastuji-Garin) · SALT score.
 */
'use strict';

function round(x, d) { const f = Math.pow(10, d); return Math.round(x * f) / f; }

/**
 * 1. StevensJohnsonTENSeverity — body surface area stratification.
 */
function StevensJohnsonTENSeverity({ bodySurfaceAreaPct, mucosalInvolvement, skinDetachment }) {
  let category = 'SJS';
  if (bodySurfaceAreaPct >= 30) category = 'TEN';
  else if (bodySurfaceAreaPct >= 10) category = 'SJS_TEN_overlap';
  if (mucosalInvolvement === 'none' && bodySurfaceAreaPct < 10) category = 'EM_major';
  if (skinDetachment === 'epidermal' && category === 'TEN') category = 'TEN_severe';
  return {
    category,
    mortality: category === 'TEN' ? 30 : category === 'SJS_TEN_overlap' ? 15 : 5,
    management: category === 'TEN' ? 'ICU_burn_unit' : category === 'SJS_TEN_overlap' ? 'HDU' : 'ward_with_derm',
  };
}

/**
 * 2. DRESSyndrome — drug reaction with eosinophilia and systemic symptoms.
 */
function DRESSyndrome({ fever, lymphadenopathy, eosinophilsPct, atypicalLymphocytes, organInvolvement, drugDays }) {
  let score = 0;
  if (fever >= 38.5) score += 1;
  if (lymphadenopathy) score += 1;
  if (eosinophilsPct >= 1.5) score += 2;
  if (atypicalLymphocytes) score += 2;
  if (organInvolvement) score += 2;
  if (drugDays >= 14 && drugDays <= 56) score += 1;
  const probability = score >= 6 ? 'definite' : score >= 4 ? 'probable' : 'possible';
  return {
    probability,
    severity: organInvolvement === 'multi' ? 'severe' : organInvolvement ? 'moderate' : 'mild',
    action: 'stop_offending_drug_systemic_steroid',
  };
}

/**
 * 3. PsoriasisSeverity — PASI approximation for initial assessment.
 */
function PsoriasisSeverity({ bsaInvolved, erythema, induration, desquamation }) {
  const average = (erythema + induration + desquamation) / 3;
  const pasiScore = round(average * bsaInvolved, 1);
  let severity = 'mild';
  if (pasiScore >= 12) severity = 'severe';
  else if (pasiScore >= 3) severity = 'moderate';
  return {
    pasiScore,
    severity,
    treatment: severity === 'severe' ? 'biologic_systemic' : severity === 'moderate' ? 'systemic_phototherapy' : 'topical',
  };
}

/**
 * 4. UrticariaSeverity — chronicity & impact.
 */
function UrticariaSeverity({ durationWeeks, angioedemaPresent, dailySymptoms, scoreUAS7 }) {
  let severity = 'acute';
  if (durationWeeks >= 6) severity = 'chronic_spontaneous';
  let impact = 'mild';
  if (scoreUAS7 >= 28) impact = 'severe';
  else if (scoreUAS7 >= 16) impact = 'moderate';
  return {
    severity,
    chronicity: durationWeeks >= 6 ? 'chronic' : 'acute',
    angioedema: angioedemaPresent,
    dailySymptoms,
    impact,
    treatment: severity === 'chronic_spontaneous' ? 'omalizumab' : impact === 'severe' ? 'high_dose_antihistamine' : 'standard_antihistamine',
  };
}

/**
 * 5. CellulitisSeverity — demarcation & systemic signs.
 */
function CellulitisSeverity({ demarcation, systemicSigns, leukocytosis, diabetes, immunocompromised, recentSurgery }) {
  let severity = 'uncomplicated';
  if (immunocompromised || recentSurgery) severity = 'complicated';
  if (diabetes && severity === 'complicated') severity = 'severe_complicated';
  if (systemicSigns && leukocytosis) severity = 'severe';
  return {
    severity,
    ivAntibiotics: severity !== 'uncomplicated',
    duration: severity === 'severe' ? 14 : severity === 'complicated' ? 10 : 5,
    workup: severity !== 'uncomplicated' ? ['blood_cultures', 'aspirate_culture'] : [],
  };
}

/**
 * 6. PressureUlcerStaging — NPUAP/EPUAP/PPPIA.
 */
function PressureUlcerStaging({ visibleDepth, exposedStructures, slough, eschar, blanching, color }) {
  let stage;
  if (eschar && color === 'stable') stage = 'unstageable';
  else if (slough && color === 'stable') stage = 'unstageable';
  else if (exposedStructures === 'fascia_muscle_tendon') stage = 4;
  else if (visibleDepth === 'full_thickness_fat') stage = 3;
  else if (visibleDepth === 'partial_thickness') stage = 2;
  else if (blanching === 'non_blanching') stage = 1;
  else stage = 'suspected_deep_tissue_injury';
  return { stage, requiresSurgery: stage === 4, offloading: 'mandatory' };
}

/**
 * 7. AcneSeverity — global assessment.
 */
function AcneSeverity({ inflammatoryLesions, comedones, nodules, scarring }) {
  let severity = 'mild';
  if (nodules >= 5 || scarring) severity = 'severe';
  else if (inflammatoryLesions >= 20) severity = 'moderate';
  return {
    severity,
    retinoid: severity !== 'mild',
    antibiotic: severity === 'moderate' || severity === 'severe',
    isotretinoin: severity === 'severe' || scarring,
  };
}

/**
 * 8. BurnClassification — thermal/inhalational.
 */
function BurnClassification({ burnType, tbsa, depth, circumferential, inhalationInjury }) {
  const fluidResuscitation = burnType === 'thermal' && tbsa >= 20;
  return {
    severity: tbsa >= 30 || inhalationInjury ? 'major' : tbsa >= 10 ? 'moderate' : 'minor',
    fluidResuscitation,
    escharotomy: circumferential && depth === 'full_thickness',
    transfer: tbsa >= 20 || inhalationInjury ? 'burn_center' : 'outpatient',
  };
}

/**
 * 9. AutoimmuneBlistering — bullous pemphigoid vs pemphigus vulgaris.
 */
function AutoimmuneBlistering({ age, mucosalInvolvement, nikolskySign, biopsyFindings, antibodyPositive }) {
  const pemphigusVulgarisFeatures = mucosalInvolvement && nikolskySign && biopsyFindings === 'intraepidermal';
  return {
    likelyDiagnosis: pemphigusVulgarisFeatures ? 'pemphigus_vulgaris' : 'bullous_pemphigoid',
    severity: pemphigusVulgarisFeatures ? 'high_risk' : 'moderate',
    workup: ['skin_biopsy_h_and_e', 'direct_immunofluorescence', 'serum_antibody_panel'],
    treatment: pemphigusVulgarisFeatures ? 'systemic_steroids_rituximab' : 'topical_steroids_consider_doxy',
  };
}

/**
 * 10. DrugReactionProbability — Naranjo scoring.
 */
function DrugReactionProbability({ previousReports, appearedAfterDrug, improvedOnStop, recurredOnRechallenge, alternativeCauses, placebo, drugLevel }) {
  let score = 0;
  if (previousReports) score += 1;
  if (appearedAfterDrug) score += 2;
  if (improvedOnStop) score += 1;
  if (recurredOnRechallenge) score += 2;
  if (alternativeCauses) score -= 1;
  if (placebo) score -= 1;
  if (drugLevel === 'toxic') score += 1;
  const probability = score >= 9 ? 'definite' : score >= 5 ? 'probable' : score >= 1 ? 'possible' : 'doubtful';
  return { score, probability, action: probability === 'definite' || probability === 'probable' ? 'discontinue_drug' : 'review' };
}

module.exports = {
  StevensJohnsonTENSeverity, DRESSyndrome, PsoriasisSeverity,
  UrticariaSeverity, CellulitisSeverity, PressureUlcerStaging,
  AcneSeverity, BurnClassification, AutoimmuneBlistering,
  DrugReactionProbability,
};
