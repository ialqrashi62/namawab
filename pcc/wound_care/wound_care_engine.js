'use strict';
// Wound Care Engine: 10 pure deterministic functions
// Compliance: NPUAP, EPUAP, WOCN, AWMA, Wounds International, AHCPR

function BradenScale({ sensoryPerception, moisture, activity, mobility, nutrition, frictionShear }) {
  const total = sensoryPerception + moisture + activity + mobility + nutrition + frictionShear;
  let risk;
  if (total >= 19) risk = 'no-risk';
  else if (total >= 15) risk = 'mild-risk';
  else if (total >= 13) risk = 'moderate-risk';
  else if (total >= 10) risk = 'high-risk';
  else risk = 'very-high-risk';
  return { total, risk, recommendation: total <= 18 ? 'prevention-protocol' : 'standard' };
}

function PressureInjuryStaging({ stage, depth, tissueType, eschar, blistering }) {
  const stages = {
    1: 'non-blanchable-erythema-intact-skin',
    2: 'partial-thickness-dermis-loss',
    3: 'full-thickness-fat-visible',
    4: 'full-thickness-bone-tendon-muscle',
    'unstageable': 'eschar-or-slough-obscures-depth',
    'DTPI': 'deep-tissue-pressure-injury-persistent-non-blanchable',
  };
  let tissue;
  if (tissueType === 'granulation') tissue = 'healthy-granulation';
  else if (tissueType === 'slough') tissue = 'sloughy';
  else if (tissueType === 'necrotic') tissue = 'necrotic';
  else tissue = 'granulation';
  return { stage, description: stages[stage] || 'invalid', depth, tissue, healing: stage <= 2 };
}

function WagnerDFU({ depth, infection, gangrene }) {
  let grade;
  if (gangrene) grade = 5;
  else if (infection) grade = 4;
  else if (depth >= 4) grade = 3;
  else if (depth >= 1) grade = 2;
  else if (depth >= 0.1) grade = 1;
  else grade = 0;
  return { wagner: grade, depth, infection, gangrene, recommendation: grade >= 3 ? 'hospital-admit-iv-antibiotics' : 'outpatient' };
}

function WoundExudate({ amount, color, consistency }) {
  let amountCategory;
  if (amount === 'none' || amount === 'scant') amountCategory = 'dry';
  else if (amount === 'small') amountCategory = 'moist';
  else if (amount === 'moderate') amountCategory = 'wet';
  else amountCategory = 'saturated';
  let colorCategory;
  if (color === 'clear' || color === 'serous') colorCategory = 'normal';
  else if (color === 'pink' || color === 'serosanguineous') colorCategory = 'normal-mild';
  else if (color === 'yellow' || color === 'green') colorCategory = 'infection-suspect';
  else if (color === 'brown' || color === 'gray') colorCategory = 'slough-necrosis';
  else colorCategory = 'unknown';
  return { amount, amountCategory, color, colorCategory, consistency, infectionConcern: colorCategory === 'infection-suspect' };
}

function BatesJensen({ size, depth, edges, undermining, necroticTissue, exudateType, exudateAmount, skinColor, granulationTissue, epithelialization }) {
  const total = size + depth + edges + undermining + necroticTissue + exudateType + exudateAmount + skinColor + granulationTissue + epithelialization;
  let healing;
  if (total <= 30) healing = 'good-healing';
  else if (total <= 50) healing = 'moderate';
  else if (total <= 70) healing = 'poor-healing';
  else healing = 'no-healing';
  return { total, healing, recommendation: total > 50 ? 'wound-care-consult' : 'monitor' };
}

function VLUClassification({ ceap, ulcertype, location, duration }) {
  let severity;
  if (ceap >= 4) severity = 'advanced-chronic-venous-disease';
  else if (ceap >= 2) severity = 'moderate';
  else severity = 'mild';
  const healiable = !ulcertype || ulcertype === 'healing';
  return { ceap, ulcertype, location, duration, severity, healiable };
}

function DiabeticFootRisk({ neuropathy, pad, deformity, priorUlcer, priorAmputation, ckd, visionImpairment, smoking }) {
  let risk = 0;
  if (neuropathy) risk += 2;
  if (pad) risk += 1;
  if (deformity) risk += 1;
  if (priorUlcer) risk += 3;
  if (priorAmputation) risk += 5;
  if (ckd) risk += 1;
  if (visionImpairment) risk += 1;
  if (smoking) risk += 1;
  let category;
  if (risk >= 5) category = 'IUF-class-3';
  else if (risk >= 3) category = 'IUF-class-2';
  else if (risk >= 1) category = 'IUF-class-1';
  else category = 'IUF-class-0';
  return { riskScore: risk, category, recommendation: category === 'IUF-class-3' ? 'monthly-screening' : 'annual-screening' };
}

function NegativePressureWound({ woundType, exudateAmount, depth, infection, duration, dressingChangeDays }) {
  let suitable = !infection && depth >= 1;
  if (woundType === 'chronic') suitable = suitable;
  if (exudateAmount === 'saturated') suitable = suitable;
  let settings;
  if (depth < 2) settings = 'continuous-80mmHg';
  else if (depth < 5) settings = 'continuous-125mmHg';
  else settings = 'continuous-150mmHg';
  return { suitable, settings, changeFrequency: dressingChangeDays || 2, infectionContra: infection };
}

function CompressionTherapy({ abi, indication, ulcerSize, pain, priorCompression }) {
  if (abi < 0.5) return { appropriate: false, reason: 'severe-arterial-insufficiency', alternative: 'revascularization' };
  if (abi >= 0.5 && abi < 0.8) return { appropriate: 'caution', reason: 'mild-arterial-disease', compression: 'low-pressure' };
  if (indication === 'venous') return { appropriate: true, pressure: 30 + Math.min(20, ulcerSize), duration: 'until-heal' };
  return { appropriate: true, pressure: 20, duration: 'long-term' };
}

function WoundInfection({ erythema, warmth, swelling, pain, exudate, fever, leukocytosis }) {
  const localSigns = (erythema ? 1 : 0) + (warmth ? 1 : 0) + (swelling ? 1 : 0) + (pain ? 1 : 0) + (exudate ? 1 : 0);
  const systemic = (fever ? 1 : 0) + (leukocytosis ? 1 : 0);
  let classification;
  if (localSigns >= 4 && systemic >= 1) classification = 'deep-OM';
  else if (localSigns >= 3) classification = 'superficial-spreading-OM';
  else if (localSigns >= 1) classification = 'contamination-colonization';
  else classification = 'no-infection';
  return { classification, localSigns, systemic, treatment: classification === 'contamination-colonization' ? 'topical-antimicrobial' : classification === 'no-infection' ? 'standard-care' : 'systemic-antibiotics' };
}

module.exports = {
  BradenScale, PressureInjuryStaging, WagnerDFU, WoundExudate, BatesJensen,
  VLUClassification, DiabeticFootRisk, NegativePressureWound, CompressionTherapy, WoundInfection,
};
