/**
 * pcc/or/or_engine.js — PCC #13: Operating Room (Perioperative)
 * 10 deterministic functions for pre/intra/post-op decision support.
 *
 * Compliance: ASA · ERAS · NPO guidelines · AAGBI · WHO Surgical Safety.
 */
'use strict';

function round(x, d) { const f = Math.pow(10, d); return Math.round(x * f) / f; }

/**
 * 1. ASAClassification — physical status.
 */
function ASAClassification({ emergency, systemicDisease, moribund, brainDeadOrganDonor }) {
  if (brainDeadOrganDonor) return { asa: 6, mortalityPct: 'organ_donor' };
  if (moribund) return { asa: 5, mortalityPct: 50 };
  if (systemicDisease === 'severe') return { asa: 4, mortalityPct: 10 };
  if (systemicDisease === 'moderate') return { asa: 3, mortalityPct: 2 };
  if (systemicDisease === 'mild') return { asa: 2, mortalityPct: 0.1 };
  return { asa: 1, mortalityPct: 0.05 };
}

/**
 * 2. PreOpNPO — fasting time by intake.
 */
function PreOpNPO({ lastSolids, lastLiquids, lastClearLiquids, surgeryType }) {
  const now = Date.now();
  const fastingHours = (last) => last ? (now - new Date(last).getTime()) / 3600000 : 999;
  const solidsHours = fastingHours(lastSolids);
  const liquidsHours = fastingHours(lastLiquids);
  const clearHours = fastingHours(lastClearLiquids);
  const emergency = surgeryType === 'emergency';
  const npoCompliant =
    emergency ||
    (solidsHours >= 6 && clearHours >= 2) ||
    (liquidsHours >= 6 && clearHours >= 2);
  let recommendation = 'proceed';
  if (!npoCompliant) {
    if (clearHours < 2) recommendation = 'delay_2h_clear_liquids';
    else if (solidsHours < 6) recommendation = 'delay_4h_solids';
  }
  return {
    npoCompliant,
    fastingHours: { solids: round(solidsHours, 1), liquids: round(liquidsHours, 1), clear: round(clearHours, 1) },
    recommendation,
  };
}

/**
 * 3. MallampatiScore — airway assessment.
 */
function MallampatiScore({ softPalate, faucialPillars, uvula, tonsils }) {
  let classN = 1;
  if (softPalate === 'visible' && faucialPillars === 'visible' && uvula === 'visible') classN = 1;
  else if (softPalate === 'visible' && faucialPillars === 'partial' && uvula === 'visible') classN = 2;
  else if (softPalate === 'visible' && uvula === 'partial') classN = 3;
  else classN = 4;
  return { class: classN, difficultAirway: classN >= 3, recommendation: classN >= 3 ? 'prepare_difficult_airway_cart' : 'standard_airway' };
}

/**
 * 4. STOPBangScore — obstructive sleep apnea screen.
 */
function STOPBangScore({ snore, tired, observedStop, highBP, bmi, age, neckCircumference, male }) {
  let score = 0;
  if (snore) score++;
  if (tired) score++;
  if (observedStop) score++;
  if (highBP) score++;
  if (bmi >= 35) score++;
  if (age >= 50) score++;
  if (neckCircumference >= 40) score++;
  if (male) score++;
  let risk = 'low';
  if (score >= 5) risk = 'high';
  else if (score >= 3) risk = 'intermediate';
  return { score, risk, periOpMonitoring: score >= 3 ? 'continuous_capnography' : 'standard' };
}

/**
 * 5. AntibioticProphylaxis — surgical site infection prevention.
 */
function AntibioticProphylaxis({ surgeryType, age, allergies, egfr, weightKg }) {
  let agent = 'cefazolin';
  let dose = 2000;
  if (allergies?.includes('cefazolin') || allergies?.includes('penicillin')) {
    agent = allergies?.includes('vancomycin') ? 'linezolid' : 'vancomycin';
    dose = agent === 'vancomycin' ? 15 * weightKg : 600;
  }
  if (egfr < 30 && agent === 'cefazolin') dose = 1000;
  if (surgeryType === 'colorectal') agent = agent === 'cefazolin' ? 'cefazolin+metronidazole' : agent;
  if (age > 65) dose = 3000;
  return { agent, dose: round(dose, 0), timing: 'within_60_min_before_incision', redose: 'q4h_during_case' };
}

/**
 * 6. IntraopBloodLossEstimate — qualitative + quantitative.
 */
function IntraopBloodLossEstimate({ suctionVolume, gauzeWeightDiff, irrigationVolume, preopHct, currentHct, ebl }) {
  const ebl_calc = (suctionVolume - irrigationVolume) + (gauzeWeightDiff || 0);
  let severity = 'minimal';
  if (ebl_calc > 2000) severity = 'massive';
  else if (ebl_calc > 1000) severity = 'moderate';
  else if (ebl_calc > 500) severity = 'mild';
  const hctDelta = preopHct - currentHct;
  return {
    ebl_ml: round(ebl_calc, 0),
    severity,
    hctDelta: round(hctDelta, 1),
    mtpIndicated: severity === 'massive' || hctDelta > 10,
  };
}

/**
 * 7. ReversalAgentDecision — neuromuscular blockade reversal.
 */
function ReversalAgentDecision({ agent, lastDoseMin, trainOfFour, renalFailure, hepaticFailure, weightKg }) {
  if (trainOfFour >= 4) return { reversal: 'not_needed', agent: 'none' };
  if (agent === 'rocuronium' && lastDoseMin < 30) {
    return { reversal: 'sugammadex', agent: 'sugammadex', dose: 16 * weightKg };
  }
  if (agent === 'rocuronium' && lastDoseMin < 180) {
    return { reversal: 'sugammadex', agent: 'sugammadex', dose: 4 * weightKg };
  }
  if (renalFailure) return { reversal: 'neostigmine', agent: 'neostigmine_atropine', warning: 'sugammadex_avoided_renal_failure' };
  if (hepaticFailure) return { reversal: 'neostigmine', agent: 'neostigmine_atropine' };
  return { reversal: 'neostigmine', agent: 'neostigmine_atropine', dose: 0.05 * weightKg };
}

/**
 * 8. PostOpPainManagement — multimodal analgesia.
 */
function PostOpPainManagement({ procedureType, opioidTolerance, renalFailure, age, nsaidContraindicated }) {
  const plan = [];
  if (!nsaidContraindicated) plan.push('scheduled_acetaminophen_1g_q6h');
  if (!nsaidContraindicated && !renalFailure) plan.push('celecoxib_200mg_q12h');
  plan.push('gabapentin_300mg_q8h_if_neuropathic');
  if (procedureType === 'thoracic') plan.push('thoracic_epidural');
  else if (procedureType === 'major_joint') plan.push('peripheral_nerve_catheter');
  if (opioidTolerance) plan.push('PCA_with_basal_high_demand');
  else plan.push('iv_oxycodone_pca_no_basal');
  if (age > 65) plan.push('reduce_50%_opioid_dose');
  return { multimodal: plan.length >= 3, plan };
}

/**
 * 9. PACUDischarge — modified Aldrete score.
 */
function PACUDischarge({ activity, respiration, bpDelta, consciousness, spo2 }) {
  let score = 0;
  if (activity >= 4) score += 2;
  else if (activity >= 2) score += 1;
  if (respiration >= 12 && respiration <= 20) score += 2;
  else if (respiration >= 8 || respiration <= 24) score += 1;
  if (bpDelta <= 20) score += 2;
  else if (bpDelta <= 50) score += 1;
  if (consciousness === 'fully_awake') score += 2;
  else if (consciousness === 'arousable') score += 1;
  if (spo2 >= 92) score += 2;
  else if (spo2 >= 90) score += 1;
  return { aldrete: score, dischargeReady: score >= 9 };
}

/**
 * 10. WHO Surgical Safety Checklist.
 */
function WHOChecklist({ signInComplete, timeOutComplete, signOutComplete, surgicalSiteMarked, antibioticGiven, allergiesConfirmed }) {
  const items = {
    signIn: { complete: signInComplete, weight: 1 },
    antibiotic: { complete: antibioticGiven, weight: 2 },
    siteMarked: { complete: surgicalSiteMarked, weight: 2 },
    timeOut: { complete: timeOutComplete, weight: 3 },
    signOut: { complete: signOutComplete, weight: 2 },
    allergies: { complete: allergiesConfirmed, weight: 2 },
  };
  const total = Object.values(items).reduce((s, i) => s + (i.complete ? i.weight : 0), 0);
  const max = Object.values(items).reduce((s, i) => s + i.weight, 0);
  return {
    items,
    completionPct: round((total / max) * 100, 0),
    allComplete: total === max,
    canProceed: items.timeOut.complete && items.siteMarked.complete,
  };
}

module.exports = {
  ASAClassification, PreOpNPO, MallampatiScore, STOPBangScore,
  AntibioticProphylaxis, IntraopBloodLossEstimate, ReversalAgentDecision,
  PostOpPainManagement, PACUDischarge, WHOChecklist,
};
