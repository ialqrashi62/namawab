/**
 * pcc/obgyn/obgyn_engine.js — PCC #15: Obstetrics & Labor & Delivery
 * 10 deterministic functions for OB/L&D decision support.
 *
 * Compliance: ACOG · RCOG Green-top · SMFM · AWHONN.
 */
'use strict';

function round(x, d) { const f = Math.pow(10, d); return Math.round(x * f) / f; }

/**
 * 1. BishopScore — cervix readiness for induction.
 */
function BishopScore({ dilation, effacement, station, consistency, position }) {
  let score = 0;
  if (dilation >= 5) score += 3;
  else if (dilation >= 2) score += 2;
  else if (dilation >= 1) score += 1;
  if (effacement >= 80) score += 3;
  else if (effacement >= 60) score += 2;
  else if (effacement >= 40) score += 1;
  if (station <= -1) score += 2;
  else if (station <= 0) score += 1;
  if (consistency === 'soft') score += 2;
  else if (consistency === 'medium') score += 1;
  if (position === 'anterior') score += 2;
  else if (position === 'mid') score += 1;
  return { score, favorable: score >= 8, recommendation: score >= 8 ? 'induction_likely_successful' : 'cervical_ripening' };
}

/**
 * 2. GBSProphylaxis — Group B Strep screening.
 */
function GBSProphylaxis({ gbsStatus, priorInfantGBS, urineGBS, currentGBS, weeksGestation, ruptureDurationHrs, fever }) {
  if (gbsStatus === 'unknown' && weeksGestation < 37) return { giveAntibiotics: true, reason: 'preterm_unknown_gbs' };
  if (gbsStatus === 'positive' || currentGBS === 'positive' || priorInfantGBS || urineGBS) return { giveAntibiotics: true, reason: 'gbs_positive' };
  if (ruptureDurationHrs >= 18) return { giveAntibiotics: true, reason: 'prolonged_rupture' };
  if (fever) return { giveAntibiotics: true, reason: 'intrapartum_fever' };
  return { giveAntibiotics: gbsStatus === 'unknown', reason: gbsStatus === 'unknown' ? 'await_culture' : 'none' };
}

/**
 * 3. MagnesiumLoading — eclampsia prophylaxis.
 */
function MagnesiumLoading({ systolicBP, proteinuria, severeHeadache, visualSymptoms, platelets }) {
  const severeFeatures = systolicBP >= 160 || proteinuria === 'severe' || severeHeadache || visualSymptoms;
  if (severeFeatures && platelets >= 50) {
    return { dose: '4g_iv_loading_then_1g_per_hr', indication: 'severe_preeclampsia_eclampsia' };
  }
  return { dose: 'none', indication: 'criteria_not_met' };
}

/**
 * 4. PostpartumHemorrhageManagement — ACOG 4-stage protocol.
 */
function PostpartumHemorrhageManagement({ bloodLoss, uterineTone, platelets, fibrinogen, stage }) {
  const actions = [];
  if (stage >= 1) {
    actions.push('uterine_massage');
    actions.push('oxytocin_40u_in_1l_ns');
  }
  if (stage >= 2) {
    actions.push('methylergonovine_im');
    actions.push('carboprost_im');
    actions.push('misoprostol_800mcg_rectal');
  }
  if (stage >= 3) {
    if (platelets < 50) actions.push('transfuse_platelets');
    if (fibrinogen < 1.5) actions.push('cryoprecipitate');
    actions.push('consider_bakri_balloon');
    actions.push('prepare_or');
  }
  if (stage >= 4) {
    actions.push('stat_or_hysterectomy');
    actions.push('activate_mtp');
  }
  if (bloodLoss > 2000) actions.push('icu_admission');
  return { stage, bloodLoss, actions };
}

/**
 * 5. FetalHeartRateCategory — NICHD 3-tier system.
 */
function FetalHeartRateCategory({ baseline, variability, accelerations, decelerations }) {
  let category = 1;
  if (baseline < 110 || baseline > 160) category = 2;
  if (variability === 'absent') category = 3;
  if (decelerations === 'variable_repetitive' || decelerations === 'late') category = 2;
  if (decelerations === 'bradycardia') category = 3;
  if (variability === 'minimal' && decelerations === 'recurrent_late') category = 3;
  if (variability === 'moderate' && accelerations && category === 1) category = 1;
  return { category, action: category === 1 ? 'routine_monitoring' : category === 2 ? 'intrauterine_resuscitation' : 'prepare_for_delivery' };
}

/**
 * 6. APGARScore — newborn assessment.
 * (defined in nnicu; this is a separate standalone version for OR use)
 */
function APGARScore({ appearance, pulse, grimace, activity, respiration }) {
  const score = appearance + pulse + grimace + activity + respiration;
  return { score, status: score >= 7 ? 'reassuring' : score >= 4 ? 'depressed' : 'critical' };
}

/**
 * 7. HypertensiveDisorderClassification — pregnancy HTN.
 */
function HypertensiveDisorderClassification({ systolicBP, diastolicBP, gestationalAge, proteinuria, endOrganDamage }) {
  const elevated = systolicBP >= 140 || diastolicBP >= 90;
  const severe = systolicBP >= 160 || diastolicBP >= 110;
  if (!elevated) return { type: 'normal' };
  if (gestationalAge < 20) return { type: 'chronic_hypertension' };
  if (severe || endOrganDamage) return { type: 'severe_preeclampsia', delivery: 'immediate' };
  if (proteinuria) return { type: 'preeclampsia', delivery: 'consider_delivery_at_37w' };
  return { type: 'gestational_hypertension' };
}

/**
 * 8. MeconiumStainedAmnioticFluid — management.
 */
function MeconiumStainedAmnioticFluid({ meconiumGrade, apgar1min, apgar5min, hrAbove100 }) {
  if (meconiumGrade === 'thin' && apgar1min >= 7) return { action: 'routine_suctioning', intubation: false };
  if (meconiumGrade === 'thick' && apgar1min < 7) return { action: 'intubation_suctioning', intubation: true };
  if (meconiumGrade === 'thick') return { action: 'pediatric_attend_at_birth', intubation: false };
  if (apgar5min < 7) return { action: 'neonatal_resuscitation', intubation: apgar1min < 4 };
  return { action: 'routine', intubation: false };
}

/**
 * 9. VBACCandidate — trial of labor after cesarean.
 */
function VBACCandidate({ priorCesareanType, priorVBAC, hospitalVBAC, priorUterineRupture, placentaPrevia, classicalScar }) {
  if (classicalScar) return { vbacCandidate: false, reason: 'classical_incision' };
  if (priorUterineRupture) return { vbacCandidate: false, reason: 'prior_rupture' };
  if (placentaPrevia) return { vbacCandidate: false, reason: 'placenta_previa' };
  if (!hospitalVBAC) return { vbacCandidate: false, reason: 'no_emergent_c_section_capability' };
  if (priorCesareanType === 'low_transverse' && !priorVBAC) return { vbacCandidate: true, successRate: 0.75 };
  if (priorCesareanType === 'low_transverse' && priorVBAC) return { vbacCandidate: true, successRate: 0.9 };
  return { vbacCandidate: false, reason: 'unknown_scar' };
}

/**
 * 10. ShoulderDystociaManagement — HELPERR protocol.
 */
function ShoulderDystociaManagement({ minutesSinceDelivery, maneuversAttempted, fetalWeight }) {
  const nextStep = [];
  if (!maneuversAttempted.includes('mcRoberts')) nextStep.push('mcRoberts');
  else if (!maneuversAttempted.includes('suprapubic')) nextStep.push('suprapubic');
  else if (!maneuversAttempted.includes('episiotomy')) nextStep.push('episiotomy');
  else if (!maneuversAttempted.includes('rubin')) nextStep.push('rubin');
  else if (!maneuversAttempted.includes('woods_screw')) nextStep.push('woods_screw');
  else if (!maneuversAttempted.includes('reverse_woods_screw')) nextStep.push('reverse_woods_screw');
  else if (!maneuversAttempted.includes('deliver_posterior_arm')) nextStep.push('deliver_posterior_arm');
  else nextStep.push('zavanelli_or_clavicle_fracture');
  if (minutesSinceDelivery >= 5) nextStep.push('call_consultant_stat');
  return { nextStep, risk: fetalWeight >= 4500 ? 'macrosomia' : 'standard', timeCritical: minutesSinceDelivery >= 4 };
}

module.exports = {
  BishopScore, GBSProphylaxis, MagnesiumLoading,
  PostpartumHemorrhageManagement, FetalHeartRateCategory, APGARScore,
  HypertensiveDisorderClassification, MeconiumStainedAmnioticFluid,
  VBACCandidate, ShoulderDystociaManagement,
};
