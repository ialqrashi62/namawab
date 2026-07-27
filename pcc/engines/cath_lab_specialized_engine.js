/**
 * pcc/engines/cath_lab_specialized_engine.js
 *
 * 10 deterministic functions for cath lab decision support.
 *
 * Per AGENTS.md §2.2 and BLUEPRINT v2:
 * - All functions are pure (no I/O, no Date.now, no random)
 * - All scoring is evidence-based
 * - LLM is NOT used here — these are clinical scores that must be
 *   deterministic for audit. LLMs are scoped to the chat copilot
 *   layer only.
 */
'use strict';

/* ============================================================
 * 1. CTOScoreJCTO
 * J-CTO score: predicts procedural success and time for
 * chronic total occlusion PCI.
 *
 * Criteria (0 or 1 each):
 *   - Blunt proximal cap
 *   - Severe calcification
 *   - Bend >45° within the CTO segment
 *   - Occlusion length >= 20 mm
 *   - Prior failed CTO attempt
 *
 * Total: 0-5
 *   0 = easy, 1 = intermediate, 2 = difficult, 3+ = very difficult
 * ============================================================ */
function CTOScoreJCTO({ bluntProximalCap, severeCalcification, severeBend, lengthGt20, priorFailedAttempt }) {
  let score = 0;
  if (bluntProximalCap) score += 1;
  if (severeCalcification) score += 1;
  if (severeBend) score += 1;
  if (lengthGt20) score += 1;
  if (priorFailedAttempt) score += 1;
  return { score, difficulty: score <= 0 ? 'easy' : score === 1 ? 'intermediate' : score === 2 ? 'difficult' : 'very_difficult' };
}

/* ============================================================
 * 2. SyntaxScore
 * SYNTAX score for left main + 3-vessel disease.
 *
 * Real SYNTAX requires a lesion-by-lesion call. For this
 * PCC, we implement a simplified version that returns a
 * category. The full SYNTAX calculator in production would
 * be the official SYNTAX website result, recorded here as
 * an integer 0-60+.
 *
 * Categories:
 *   0-22  low complexity
 *   23-32 intermediate
 *   33+   high
 * ============================================================ */
function SyntaxScoreCategory(integerScore) {
  if (typeof integerScore !== 'number' || integerScore < 0) {
    throw new Error('SyntaxScoreCategory: invalid score');
  }
  if (integerScore <= 22) return 'low';
  if (integerScore <= 32) return 'intermediate';
  return 'high';
}

/* ============================================================
 * 3. CalciumScoreIVUS
 * IVUS-based calcium scoring.
 *
 * 0 = none
 * 1 = superficial (<180° arc, 1 quadrant)
 * 2 = deep + superficial (1 quadrant)
 * 3 = deep + superficial (>1 quadrant)
 * 4 = circumferential calcification
 * ============================================================ */
function CalciumScoreIVUS({ quadrantsSuperficial, quadrantsDeep, circumferential }) {
  if (circumferential) return 4;
  if (quadrantsSuperficial > 1 && quadrantsDeep > 0) return 3;
  if (quadrantsSuperficial > 0 && quadrantsDeep > 0) return 2;
  if (quadrantsSuperficial > 0) return 1;
  return 0;
}

/* ============================================================
 * 4. FFRiFRAnalysis
 * Fractional flow reserve (FFR) / instantaneous wave-free
 * ratio (iFR) interpretation.
 *
 * FFR <= 0.80  -> positive (ischemia, treat)
 * iFR <= 0.89  -> positive
 * Otherwise    -> negative (defer)
 *
 * Returns classification + clinical action.
 * ============================================================ */
function FFRiFRAnalysis({ type, value }) {
  if (typeof value !== 'number' || value < 0 || value > 1.5) {
    throw new Error('FFRiFRAnalysis: invalid value');
  }
  if (type === 'FFR') {
    const positive = value <= 0.80;
    return {
      positive,
      recommendation: positive ? 'proceed_to_pci' : 'defer_optimize_medical_therapy',
      confidence_band: value <= 0.75 ? 'high' : value <= 0.80 ? 'borderline' : 'negative',
    };
  }
  if (type === 'iFR') {
    const positive = value <= 0.89;
    return {
      positive,
      recommendation: positive ? 'proceed_to_pci' : 'defer_optimize_medical_therapy',
      confidence_band: value <= 0.85 ? 'high' : value <= 0.89 ? 'borderline' : 'negative',
    };
  }
  throw new Error('FFRiFRAnalysis: type must be FFR or iFR');
}

/* ============================================================
 * 5. BifurcationMedina
 * Medina classification for bifurcation lesions.
 *
 * Each component is 0/1 (presence of disease):
 *   proximal, distal_main, side_branch
 *
 * Returns "0,0,0" to "1,1,1" string.
 * ============================================================ */
function BifurcationMedina({ proximal, distalMain, sideBranch }) {
  const p = proximal ? 1 : 0;
  const d = distalMain ? 1 : 0;
  const s = sideBranch ? 1 : 0;
  return { proximal: p, distalMain: d, sideBranch: s, notation: `${p},${d},${s}` };
}

/* ============================================================
 * 6. PerforationEllis
 * Ellis classification for coronary perforation.
 *
 * Type I: extraluminal crater without extravasation
 * Type II: pericardial or myocardial blush
 * Type III: extravasation of contrast (>= 1mm)
 *   CS (containment site) variant
 * Type IV: perforation into an adjacent cardiac chamber
 * Type V: distal perforation from guidewire
 *
 * Returns type + severity + recommended action.
 * ============================================================ */
function PerforationEllis(type, hasExtraPericardialEffusion) {
  let severity, action;
  switch (type) {
    case 'I':
      severity = 'low';
      action = 'observe_30min_then_repeat_angio';
      break;
    case 'II':
      severity = 'moderate';
      action = 'prolonged_balloon_inflation_reversal_anticoagulation';
      break;
    case 'III':
      severity = 'high';
      action = 'covered_stent_or_emergent_surgery';
      break;
    case 'IV':
      severity = 'critical';
      action = 'emergent_surgery';
      break;
    case 'V':
      severity = 'moderate';
      action = 'prolonged_balloon_reversal_anticoagulation';
      break;
    default:
      throw new Error('PerforationEllis: invalid type');
  }
  return {
    type,
    severity,
    action,
    requiresPericardiocentesis: hasExtraPericardialEffusion && (type === 'II' || type === 'III' || type === 'IV'),
  };
}

/* ============================================================
 * 7. RotablationBurr
 * Rotational atherectomy burr size selection.
 *
 * Burr-to-artery ratio target: 0.5-0.7
 * Common burr sizes: 1.25, 1.5, 1.75, 2.0, 2.25, 2.5 mm
 *
 * Returns recommended burr size and rationale.
 * ============================================================ */
function RotablationBurr(arteryReferenceDiameterMm) {
  if (typeof arteryReferenceDiameterMm !== 'number' || arteryReferenceDiameterMm <= 0) {
    throw new Error('RotablationBurr: invalid artery diameter');
  }
  // Conservative 0.6 ratio (mid-range)
  const target = arteryReferenceDiameterMm * 0.6;
  const sizes = [1.25, 1.5, 1.75, 2.0, 2.25, 2.5];
  let best = sizes[0];
  for (const s of sizes) {
    if (s <= target) best = s;
    else break;
  }
  return {
    arteryReferenceDiameterMm,
    targetBurrRatio: 0.6,
    recommendedBurrSizeMm: best,
    rationale: `Burr-to-artery ratio of 0.6 of ${arteryReferenceDiameterMm}mm reference diameter.`,
  };
}

/* ============================================================
 * 8. IVLDelivery
 * Intravascular lithotripsy balloon size.
 *
 * IVL balloons come in 2.5, 3.0, 3.5, 4.0 mm at 12mm length.
 * Rule: balloon-artery ratio 1:1.
 * ============================================================ */
function IVLDelivery(arteryReferenceDiameterMm) {
  if (typeof arteryReferenceDiameterMm !== 'number' || arteryReferenceDiameterMm <= 0) {
    throw new Error('IVLDelivery: invalid artery diameter');
  }
  const sizes = [2.5, 3.0, 3.5, 4.0];
  let best = sizes[0];
  for (const s of sizes) {
    if (s <= arteryReferenceDiameterMm) best = s;
    else break;
  }
  return {
    arteryReferenceDiameterMm,
    recommendedBalloonMm: best,
    pulseCycles: 8,
    rationale: 'IVL balloon 1:1 to reference diameter, 8 pulses per cycle.',
  };
}

/* ============================================================
 * 9. NoReflowPredict
 * Predicts risk of no-reflow phenomenon post-PCI.
 *
 * Risk factors:
 *   - SVG (saphenous vein graft) intervention
 *   - Thrombus-containing lesion
 *   - Long stent (>= 30mm)
 *   - High pressure post-dilation
 *   - Atherectomy
 *
 * Returns risk tier (low/moderate/high) and prophylactic action.
 * ============================================================ */
function NoReflowPredict({ isSVG, hasThrombus, longStent, highPressurePostDilatation, atherectomy }) {
  let score = 0;
  if (isSVG) score += 2;
  if (hasThrombus) score += 2;
  if (longStent) score += 1;
  if (highPressurePostDilatation) score += 1;
  if (atherectomy) score += 1;
  const risk = score >= 4 ? 'high' : score >= 2 ? 'moderate' : 'low';
  return {
    score,
    risk,
    prophylactic: risk === 'high' ? 'IC_adenosine_verapamil_nitroprusside' : risk === 'moderate' ? 'IC_adenosine' : 'none',
  };
}

/* ============================================================
 * 10. CoronaryDissectionType
 * NHLBI classification of coronary dissection.
 *
 * Type A: minor radiolucency, no persistence
 * Type B: linear dissection, persistence after 2 beats
 * Type C: extraluminal contrast, persistence
 * Type D: spiral dissection
 * Type E: filling defect, chronic
 * Type F: total occlusion
 * ============================================================ */
function CoronaryDissectionType(type) {
  let action;
  switch (type) {
    case 'A':
      action = 'observe';
      break;
    case 'B':
      action = 'observe_30min_then_repeat_angio';
      break;
    case 'C':
      action = 'stent_to_seal';
      break;
    case 'D':
      action = 'stent_to_seal';
      break;
    case 'E':
      action = 'consider_stent';
      break;
    case 'F':
      action = 'urgent_stent_or_surgery';
      break;
    default:
      throw new Error('CoronaryDissectionType: invalid type');
  }
  return { type, action };
}

module.exports = {
  CTOScoreJCTO,
  SyntaxScoreCategory,
  CalciumScoreIVUS,
  FFRiFRAnalysis,
  BifurcationMedina,
  PerforationEllis,
  RotablationBurr,
  IVLDelivery,
  NoReflowPredict,
  CoronaryDissectionType,
};
